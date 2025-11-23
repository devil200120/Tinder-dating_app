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
    const response = await api.get(`/chats/${chatId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Send message
  sendMessage: async (chatId, message, type = 'text') => {
    const response = await api.post(`/chats/${chatId}/messages`, {
      content: message,
      type,
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
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
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
};