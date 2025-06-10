import { useState, useContext, useEffect } from "react";
import { Users, Link, SquarePlus, Trash2, Send, Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
export const API_URL = import.meta.env.VITE_API_URL
import { Video } from 'lucide-react';

const Message = () => {
  const nav = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  
  // State for managing chats
  const [chatsList, setChatsList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lastFetchTimes, setLastFetchTimes] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserChats(parsedUser);
    } else {
      nav('/Login'); 
    }

    // Set initial sidebar state based on screen size
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [nav, setUser]);

  const createMeetingAndSend = async () => {
  if (!selectedChat) return;

  const roomId = Math.random().toString(36).substring(2, 12); // Random 10-char string
  const meetingLink = `https://meet.jit.si/${roomId}`;

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
          to: chatMessages.user1 === user.username ? chatMessages.user2 : chatMessages.user1,
          message: `📹 Interview Meeting Link: ${meetingLink}`
        }
      })
    });

    const data = await response.json();
    if (response.ok) {
      fetchChatMessages(selectedChat); // Refresh chat
    }
  } catch (error) {
    console.error('Error sending meeting link:', error);
  }
};


  const fetchUserChats = async (userData, forceRefresh = false) => {
    try {
      const response = await fetch(`${API_URL}/fetchChatList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user: userData })
      });

      const data = await response.json();
      console.log(data.chat)
      if (response.ok) {
        // Sort chats by last message time
        const sortedChats = (data.chat || []).sort((a, b) => 
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        );
        // Mark chats as unread based on last fetch time
        const updatedChats = sortedChats.map(chat => ({
          ...chat,
          isUnread: !chat.lastFetchTime || 
                    new Date(chat.lastMessageTime) > new Date(chat.lastFetchTime) 
                    
        }));

        setChatsList(updatedChats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchChatMessages = async (chatID) => {
    try {
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
        setChatMessages(data || []);
        setSelectedChat(chatID);

        // Update last fetch time for this chat
        setLastFetchTimes(prev => ({
          ...prev,
          [chatID]: new Date().toISOString()
        }));

        // Refetch and update chat list
        fetchUserChats(user);

        // Close sidebar on mobile after selecting chat
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        }
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

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
            to: chatMessages.user1 === user.username ? chatMessages.user2 : chatMessages.user1,
            message: newMessage
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        setNewMessage('');
        fetchChatMessages(selectedChat);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessages = () => {
    const messages = chatMessages.chats || [];
    
    return messages.map((msg, index) => (
      <div 
        key={index} 
        className={`mb-2 ${msg.author === user.username ? 'text-right' : 'text-left'}`}
      >
        <span 
          className={`inline-block p-2 rounded-lg ${
            msg.author === user.username 
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
    <div className="flex flex-col md:flex-row relative" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full text-white text-center py-4 z-50 mt-16 shadow-lg">
        <h2 className="text-lg text-violet-900 font-bold">Messages</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 right-4 p-2 rounded-full bg-violet-900 "
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Chats List Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 fixed md:static w-full md:w-1/4 bg-gray-100 h-full z-40 overflow-y-auto ${window.innerWidth >= 768 ? '' : 'pt-16'}`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 hidden md:block">Chats</h2>
          {chatsList.map((chat) => (
            <div 
              key={chat.chatID} 
              onClick={() => fetchChatMessages(chat.chatID)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-200 ${
                selectedChat === chat.chatID ? 'bg-blue-100' : ''
              } ${chat.isUnread ? 'font-bold bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span>{chat.chatWith}</span>
                  {chat.isUnread && (
                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString() : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className={`flex-1 flex flex-col h-full ${window.innerWidth >= 768 ? '' : 'pt-16'}`}>
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

              {/* Meeting Button */}
              <button 
                onClick={createMeetingAndSend}
                className="bg-green-500 text-white p-2"
                title="Send Meeting Link"
              >
                <Video size={20} />
              </button>

              {/* Send Button */}
              <button 
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg"
                title="Send Message"
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