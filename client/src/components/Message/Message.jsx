import { useState, useContext, useEffect } from "react";
import { Users, Link, SquarePlus, Trash2, Send } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
export const API_URL = import.meta.env.VITE_API_URL

const Message = () => {
  const nav = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  
  // State for managing chats
  const [chatsList, setChatsList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);  // Initialize as empty array
  const [newMessage, setNewMessage] = useState('');

  // Fetch user's chats on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserChats(parsedUser);
    } else {
      nav('/Login'); 
    }
  }, [nav, setUser]);

  // Fetch user's chats
  const fetchUserChats = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/fetchChatList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user: userData,
        })
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setChatsList(data.chat || []);  // Ensure fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Fetch specific chat messages
  const fetchChatMessages = async (chatID) => {
    try {
        console.log(chatID)
      const response = await fetch(`${API_URL}/fetchChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user: user,
          chatID: chatID
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatMessages(data || []);  // Ensure fallback to empty array
        console.log(data)
        setSelectedChat(chatID);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_URL}/Message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user: user,
          chatData: {
            chatID: selectedChat,
            to: chatMessages.user1 === user.email ? chatMessages.user2 : chatMessages.user1,
            message: newMessage
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Optionally refresh chat or add message to local state
        setNewMessage('');
        fetchChatMessages(selectedChat);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessages = () => {
    // Ensure chatMessages is an array and has content
    const messages = chatMessages.chats || [];
    
    return messages.map((msg, index) => (
      <div 
        key={index} 
        className={`mb-2 ${msg.author === user.email ? 'text-right' : 'text-left'}`}
      >
        <span 
          className={`inline-block p-2 rounded-lg ${
            msg.author === user.email 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          {msg.message}
        </span>
        <div className="text-xs text-gray-500">
          {new Date(msg.time).toLocaleTimeString()}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-screen">
      {/* Chats List */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {chatsList.map((chat) => (
          <div 
            key={chat.chatID} 
            onClick={() => fetchChatMessages(chat.chatID)}
            className={`p-3 border-b cursor-pointer hover:bg-gray-200 ${selectedChat === chat.chatID ? 'bg-blue-100' : ''}`}
          >
            <div className="flex justify-between items-center">
              <span>{chat.chatWith}</span>
              <span className="text-sm text-gray-500">
                {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString() : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="w-3/4 flex flex-col">
        {selectedChat ? (
          <>
            {/* Messages Display */}
            <div className="flex-grow overflow-y-auto p-4">
              {renderMessages()}
            </div>

            {/* Message Input */}
            <div className="flex p-4 border-t">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-2 border rounded-l-lg"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;