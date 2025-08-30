import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ChatContext = createContext();

const initialState = {
  currentChat: null,
  chatHistory: [],
  isLoading: false,
  error: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'SET_CHAT_HISTORY':
      return { ...state, chatHistory: action.payload };
    case 'ADD_MESSAGE':
      if (state.currentChat) {
        return {
          ...state,
          currentChat: {
            ...state.currentChat,
            messages: [...state.currentChat.messages, action.payload],
          },
        };
      }
      return state;
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (message, chatId = null) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await api.post('/api/chat/send', {
        message,
        chatId,
      });

      const { chat, response: aiResponse } = response.data;
      
      dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });
      
      // Update chat history if this is a new chat
      if (!chatId) {
        await fetchChatHistory();
      }
      
      return { success: true, chat, response: aiResponse };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send message';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await api.get('/api/chat/history');
      dispatch({ type: 'SET_CHAT_HISTORY', payload: response.data.chats });
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await api.get(`/api/chat/${chatId}`);
      dispatch({ type: 'SET_CURRENT_CHAT', payload: response.data });
    } catch (error) {
      toast.error('Failed to load chat');
      console.error('Failed to load chat:', error);
    }
  };

  const clearChat = async (chatId) => {
    try {
      await api.delete(`/api/chat/${chatId}/messages`);
      await loadChat(chatId);
      toast.success('Chat cleared successfully');
    } catch (error) {
      toast.error('Failed to clear chat');
      console.error('Failed to clear chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await api.delete(`/api/chat/${chatId}`);
      await fetchChatHistory();
      dispatch({ type: 'SET_CURRENT_CHAT', payload: null });
      toast.success('Chat deleted successfully');
    } catch (error) {
      toast.error('Failed to delete chat');
      console.error('Failed to delete chat:', error);
    }
  };

  const value = {
    ...state,
    sendMessage,
    fetchChatHistory,
    loadChat,
    clearChat,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
