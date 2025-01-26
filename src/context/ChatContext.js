import React, { createContext, useContext, useState, useEffect } from 'react';
import {queryApi} from '../services/api';

const ChatContext = createContext();
const STORAGE_KEY = 'nyai-sathi-chats';

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem(STORAGE_KEY);
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats]);
  
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date().toISOString()
    };
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const addMessageToChat = async (chatId, message, queryType) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            title: chat.messages.length === 0 ? message.slice(0, 30) + '...' : chat.title,
            messages: [...chat.messages, userMessage]
          };
        }
        return chat;
      })
    );

    try {
      const chat = chats.find(c => c.id === chatId);
      const previousMessages = chat ? chat.messages : [];
      
      const response = await queryApi(message, queryType, previousMessages);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage]
            };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage]
            };
          }
          return chat;
        })
      );
    }
  };

  const deleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0]?.id || null);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Add updateChatTitle function
  const updateChatTitle = (chatId, newTitle) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle } 
          : chat
      )
    );
  };

  const value = {
    chats,
    currentChatId,
    loading,
    isDarkMode,
    createNewChat,
    addMessageToChat,
    setCurrentChatId,
    deleteChat,
    toggleTheme,
    updateChatTitle // Add to context
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