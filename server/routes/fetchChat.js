const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const authenticateToken = require('../middleware/JWTauth');

router.post('/', authenticateToken, async (req, res) => {
   const applydata = req.body;
   const { user, chatID } = applydata;
   const authuser = req.user;
   console.log(chatID)
   if (user.email !== authuser.email || user.username !== authuser.id) {
       return res.status(505).json({ message: 'token failure' });
   }
   
   const chats = db.collection('chats');
   const users = db.collection('users');

   try {
       // Fetch chat object
       const chatObject = await chats.findOne({ _id: new ObjectId(chatID) });
       
       if (!chatObject) {
           return res.status(404).json({ message: 'Chat not found' });
       }

       // Update last fetch time for user's chat entry
       await users.updateOne(
           { 
               username: user.username, 
               'chats.chatID': new ObjectId(chatID) 
           },
           { 
               $set: { 
                   'chats.$.lastFetchTime': new Date() 
               } 
           }
       );

       // Send chat object as response
       res.status(200).json(chatObject);

   } catch (error) {
       console.error('Error fetching chats:', error);
       res.status(500).json({ message: 'Internal Server Error' });
   }
});

module.exports = router;