import React, { createContext, useState, useEffect } from 'react';
import { mockMatches, mockMessages, mockUsers } from '../utils/mockData';
import { generateId } from '../utils/helpers';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize matches and messages
  useEffect(() => {
    setMatches(mockMatches);
    setMessages(mockMessages);
    calculateUnreadCount(mockMatches);
  }, []);

  // Calculate total unread messages
  const calculateUnreadCount = (matchList) => {
    const count = matchList.filter(match => match.unread).length;
    setUnreadCount(count);
  };

  // Get messages for a specific chat
  const getMessages = (userId) => {
    return messages[userId] || [];
  };

  // Send a new message
  const sendMessage = (userId, text) => {
    const newMessage = {
      id: generateId(),
      senderId: 'me',
      text,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage]
    }));

    // Update last message in matches
    setMatches(prev => prev.map(match => 
      match.userId === userId
        ? { ...match, lastMessage: text, timestamp: new Date() }
        : match
    ));

    // Simulate receiving a response after 2-5 seconds
    setTimeout(() => {
      receiveMessage(userId);
    }, Math.random() * 3000 + 2000);
  };

  // Simulate receiving a message
  const receiveMessage = (userId) => {
    const responses = [
      "That's interesting! Tell me more.",
      "I totally agree with you!",
      "Haha, that's funny! 😄",
      "What do you think about that?",
      "I'd love to hear more about your interests!",
      "That sounds like a great idea!",
      "When are you free to meet up?",
      "I'm having such a great conversation with you!"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const newMessage = {
      id: generateId(),
      senderId: userId,
      text: randomResponse,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage]
    }));

    // Update last message in matches
    setMatches(prev => prev.map(match => 
      match.userId === userId
        ? { ...match, lastMessage: randomResponse, timestamp: new Date(), unread: true }
        : match
    ));

    // Update unread count
    calculateUnreadCount(matches.map(match => 
      match.userId === userId
        ? { ...match, unread: true }
        : match
    ));
  };

  // Mark messages as read
  const markAsRead = (userId) => {
    setMessages(prev => ({
      ...prev,
      [userId]: (prev[userId] || []).map(msg => ({ ...msg, read: true }))
    }));

    setMatches(prev => {
      const updated = prev.map(match => 
        match.userId === userId
          ? { ...match, unread: false }
          : match
      );
      calculateUnreadCount(updated);
      return updated;
    });
  };

  // Delete a chat
  const deleteChat = (userId) => {
    setMatches(prev => prev.filter(match => match.userId !== userId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[userId];
      return newMessages;
    });
  };

  // Add a new match
  const addMatch = (user) => {
    const newMatch = {
      id: user.id,
      userId: user.id,
      name: user.name,
      age: user.age,
      image: user.images[0],
      lastMessage: `You matched with ${user.name}!`,
      timestamp: new Date(),
      unread: true,
      online: user.online
    };

    setMatches(prev => [newMatch, ...prev]);
    setMessages(prev => ({
      ...prev,
      [user.id]: []
    }));

    calculateUnreadCount([newMatch, ...matches]);
  };

  // Get match by userId
  const getMatchById = (userId) => {
    return matches.find(match => match.userId === parseInt(userId));
  };

  // Get user details by userId
  const getUserById = (userId) => {
    return mockUsers.find(user => user.id === parseInt(userId));
  };

  const value = {
    matches,
    messages,
    activeChat,
    unreadCount,
    setActiveChat,
    getMessages,
    sendMessage,
    markAsRead,
    deleteChat,
    addMatch,
    getMatchById,
    getUserById
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
