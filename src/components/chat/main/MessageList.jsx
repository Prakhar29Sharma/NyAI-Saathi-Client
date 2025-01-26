import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useChat } from '../../../context/ChatContext';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const MessageList = ({ messages = [] }) => {
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bgcolor: isDarkMode ? '#343541' : 'background.default'
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            gap: 2,
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            bgcolor: isDarkMode ? 
              (message.isUser ? '#40414f' : '#444654') : 
              (message.isUser ? 'grey.100' : 'grey.50'),
            p: 2,
            borderRadius: 2
          }}
        >
          <Avatar sx={{ bgcolor: message.isUser ? 'primary.main' : 'secondary.main' }}>
            {message.isUser ? <PersonIcon /> : <SmartToyIcon />}
          </Avatar>
          <Box
            sx={{
              flex: 1
            }}
          >
            <Typography color={isDarkMode ? 'white' : 'text.primary'}>
              {message.text}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, display: 'block' }}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;