const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const authenticateToken = require('../middleware/JWTauth');

router.post('/', authenticateToken, async (req, res) => {
    const applydata = req.body;
    const { user, chatData } = applydata;
    const authuser = req.user;

    if (user.email !== authuser.email || user.username !== authuser.id) {
        return res.status(403).json({ message: 'Token failure' });
    }

    const users = db.collection('users');
    const chats = db.collection('chats');

    try {
        // Find sender and receiver user documents
        const senderUser = await users.findOne({ email: user.email });
        const receiverUser = await users.findOne({ email: chatData.to });

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        let chatId = chatData.chatID;

        // If chatID is null, check if chat exists
        if (!chatId) {
            // Check existing chats for both users
            const existingChat = await chats.findOne({
                $or: [
                    { user1: senderUser.email, user2: receiverUser.email },
                    { user1: receiverUser.email, user2: senderUser.email }
                ]
            });

            if (existingChat) {
                return res.status(200).json({ message: 'Chat already exists' });
            }

            // Create new chat
            const newChat = {
                user1: senderUser.email,
                user2: receiverUser.email,
                chats: []
            };

            const insertResult = await chats.insertOne(newChat);
            chatId = insertResult.insertedId;
        }

        // Prepare message object
        const messageObject = {
            author: user.email,
            message: chatData.message,
            time: new Date()
        };

        // Update chat with new message
        if(chatData.message !== ""){    
            await chats.updateOne(
                { _id: new ObjectId(chatId) },
                { $push: { chats: messageObject } }
            );
        }

        // Update sender's chats array
        await users.updateOne(
            { email: user.email },
            { 
                $set: { 
                    chats: updateUserChats(senderUser.chats || [], chatId, receiverUser.email, messageObject.time) 
                }
            }
        );

        // Update receiver's chats array
        await users.updateOne(
            { email: receiverUser.email },
            { 
                $set: { 
                    chats: updateUserChats(receiverUser.chats || [], chatId, senderUser.email, messageObject.time) 
                }
            }
        );

        res.status(201).json({ chatId, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper function to update user's chats array
function updateUserChats(existingChats, chatId, chatWith, lastMessageTime) {
    const existingChatIndex = existingChats.findIndex(chat => chat.chatID.toString() === chatId.toString());

    if (existingChatIndex !== -1) {
        // Update existing chat entry
        existingChats[existingChatIndex].lastMessageTime = lastMessageTime;
        existingChats[existingChatIndex].lastFetchTime = new Date();
    } else {
        // Add new chat entry
        existingChats.push({
            chatID: chatId,
            chatWith: chatWith,
            lastMessageTime: lastMessageTime,
            lastFetchTime: new Date()
        });
    }

    return existingChats;
}

module.exports = router;