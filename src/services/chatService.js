// services/chatService.js
import api from './api.js';

export const chatService = {
  // Get all chats
  getChats: async () => {
    const response = await api.get('/chats');
    return response.data;
  },

  // Get chat messages
  getChatMessages: async (chatId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${chatId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Send message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Send file message
  sendFileMessage: async (formData) => {
    const response = await api.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Send image message
  sendImageMessage: async (chatId, image) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'image');
    
    const response = await api.post(`/chats/${chatId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (chatId) => {
    const response = await api.put(`/chats/${chatId}/read`);
    return response.data;
  },

  // Delete message
  deleteMessage: async (messageId, deleteType = 'me') => {
    const response = await api.delete(`/messages/${messageId}`, {
      data: { deleteType }
    });
    return response.data;
  },

  // Edit message
  editMessage: async (messageId, content) => {
    console.log('ChatService: Editing message', { messageId, content });
    try {
      const response = await api.put(`/messages/${messageId}`, {
        content
      });
      console.log('ChatService: Edit message response', response.data);
      return response.data;
    } catch (error) {
      console.error('ChatService: Edit message error', error.response?.data || error.message);
      throw error;
    }
  },

  // Add reaction to message
  addReaction: async (messageId, emoji) => {
    console.log('ChatService: Adding reaction', { messageId, emoji });
    try {
      const response = await api.post(`/messages/${messageId}/react`, {
        emoji
      });
      console.log('ChatService: Add reaction response', response.data);
      return response.data;
    } catch (error) {
      console.error('ChatService: Add reaction error', error.response?.data || error.message);
      throw error;
    }
  },

  // Remove reaction from message
  removeReaction: async (messageId, emoji) => {
    console.log('ChatService: Removing reaction', { messageId, emoji });
    try {
      const response = await api.delete(`/messages/${messageId}/react`, {
        data: { emoji }
      });
      console.log('ChatService: Remove reaction response', response.data);
      return response.data;
    } catch (error) {
      console.error('ChatService: Remove reaction error', error.response?.data || error.message);
      throw error;
    }
  },

  // Start typing
  startTyping: async (chatId) => {
    const response = await api.post(`/chats/${chatId}/typing`);
    return response.data;
  },

  // Stop typing
  stopTyping: async (chatId) => {
    const response = await api.delete(`/chats/${chatId}/typing`);
    return response.data;
  },

  // Send surprise message
  sendSurpriseMessage: async (messageData) => {
    console.log('ChatService: Sending surprise message', messageData);
    try {
      const response = await api.post('/messages', {
        ...messageData,
        isSurprise: true,
        type: 'surprise'
      });
      console.log('ChatService: Send surprise message response', response.data);
      return response.data;
    } catch (error) {
      console.error('ChatService: Send surprise message error', error.response?.data || error.message);
      throw error;
    }
  },

  // Reveal surprise message
  revealSurpriseMessage: async (messageId) => {
    console.log('ChatService: Revealing surprise message', { messageId });
    try {
      const response = await api.post(`/messages/${messageId}/reveal`);
      console.log('ChatService: Reveal surprise message response', response.data);
      return response.data;
    } catch (error) {
      console.error('ChatService: Reveal surprise message error', error.response?.data || error.message);
      throw error;
    }
  },

  // Mark message as read
  markMessageAsRead: async (messageId) => {
    console.log('ChatService: Marking message as read', { messageId });
    try {
      const response = await api.post(`/messages/${messageId}/read`);
      console.log('ChatService: Mark message as read response', response.data);
      return response.data;
    } catch (error) {
      console.error('ChatService: Mark message as read error', error.response?.data || error.message);
      throw error;
    }
  },
};