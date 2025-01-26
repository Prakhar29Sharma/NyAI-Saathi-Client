import React, { createContext, useContext, useState, useEffect } from 'react';
import { queryApi } from '../services/api';

const ChatContext = createContext();
const STORAGE_KEY = 'nyai-sathi-chats';
const CURRENT_CHAT_KEY = 'nyai-sathi-current-chat';

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(() => {
    // Initialize chats from localStorage
    const savedChats = localStorage.getItem(STORAGE_KEY);
    return savedChats ? JSON.parse(savedChats) : [];
  });

  const [currentChatId, setCurrentChatId] = useState(() => {
    // Initialize currentChatId from localStorage
    return localStorage.getItem(CURRENT_CHAT_KEY) || null;
  });

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('isDarkMode') === 'true'
  );

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  // Save current chat ID whenever it changes
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem(CURRENT_CHAT_KEY, currentChatId);
    } else {
      localStorage.removeItem(CURRENT_CHAT_KEY);
    }
  }, [currentChatId]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

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

  // Initialize with a new chat if no chats exist
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  const deleteChat = (chatId) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      if (currentChatId === chatId && updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
      }
      return updatedChats;
    });
  };

  const updateChatTitle = (chatId, newTitle) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle } 
          : chat
      )
    );
  };

  const addMessageToChat = async (chatId, message, queryType) => {
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    chats,
    currentChatId,
    isDarkMode,
    createNewChat,
    addMessageToChat,
    setCurrentChatId,
    deleteChat,
    toggleTheme,
    updateChatTitle
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