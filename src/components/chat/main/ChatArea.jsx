import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { useChat } from '../../../context/ChatContext';
import ProfileMenu from '../profile/ProfileMenu';
import { queryApi } from '../../../services/api';

const ChatArea = () => {
  const { currentChatId, chats, isDarkMode, toggleTheme } = useChat();
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const [queryType, setQueryType] = useState('laws');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message) => {
    const newMessage = { 
      id: Date.now(),
      text: message, 
      isUser: true,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const response = await queryApi(message, queryType, messages);
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error processing your request.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDarkMode ? '#1e1e2e' : '#f5f5f5',
        color: isDarkMode ? 'white' : 'text.primary',
        position: 'relative'
      }}
    >
      <Box sx={{ 
        position: 'absolute',
        right: 16,
        top: 16,
        display: 'flex',
        alignItems: 'center',
        zIndex: 2
      }}>
        <IconButton 
          onClick={toggleTheme}
          sx={{ 
            color: isDarkMode ? 'white' : 'text.primary',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <ProfileMenu />
      </Box>
      
      {currentChat ? (
        <>
          <MessageList messages={messages} isTyping={isTyping} />
          <InputBox 
            queryType={queryType} 
            onQueryTypeChange={(_, newValue) => setQueryType(newValue)}
            onSend={handleSendMessage}
          />
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <Typography color="text.primary">
            Select a chat or start a new conversation
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatArea;