import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();
const STORAGE_KEY = 'nyai-sathi-chats';

// Mock assistant responses
const MOCK_RESPONSES = [
  {
    text: "According to Indian legal precedents, this matter would typically be handled under Section 24 of the Civil Procedure Code...",
    delay: 1000
  },
  {
    text: "Based on recent Supreme Court judgments, particularly in the case of XYZ vs State (2023), the approach would be...",
    delay: 1500
  },
  {
    text: "The relevant sections of the Indian Penal Code that apply here are Sections 141-149, which deal with...",
    delay: 1200
  }
];

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

  const getMockResponse = () => {
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  };

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

  const addMessageToChat = (chatId, message) => {
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

    // Add mock assistant response after delay
    setTimeout(() => {
      const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: mockResponse.text,
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
    }, 1000);
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

  const value = {
    chats,
    currentChatId,
    loading,
    isDarkMode,
    createNewChat,
    addMessageToChat,
    setCurrentChatId,
    deleteChat,
    toggleTheme
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