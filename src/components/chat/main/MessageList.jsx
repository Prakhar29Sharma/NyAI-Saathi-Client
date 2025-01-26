import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useChat } from '../../../context/ChatContext';
import { LoadingSpinner } from '../../common';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const MessageList = ({ messages = [], isTyping = false }) => {
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bgcolor: isDarkMode ? '#1e1e2e' : '#f5f5f5',
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
            bgcolor: isDarkMode 
              ? (message.isUser ? '#2d2d3a' : '#252534') 
              : (message.isUser ? '#e3f2fd' : 'white'),
            p: 2,
            borderRadius: 2,
            boxShadow: isDarkMode 
              ? 'none' 
              : '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Avatar sx={{ bgcolor: message.isUser ? 'primary.main' : 'secondary.main' }}>
            {message.isUser ? <PersonIcon /> : <SmartToyIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            {message.isUser ? (
              <Typography color={isDarkMode ? 'white' : 'text.primary'}>
                {message.text}
              </Typography>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({children}) => (
                    <Typography 
                      sx={{ 
                        my: 1,
                        color: isDarkMode ? 'white' : 'text.primary'
                      }}
                    >
                      {children}
                    </Typography>
                  ),
                  pre: ({children}) => (
                    <Box
                      component="pre"
                      sx={{
                        bgcolor: isDarkMode ? 'rgba(0,0,0,0.3)' : '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        color: isDarkMode ? 'white' : 'text.primary',
                        '& code': {
                          color: isDarkMode ? '#a6e22e' : '#2f6f4f'
                        }
                      }}
                    >
                      {children}
                    </Box>
                  ),
                  code: ({children}) => (
                    <Typography
                      component="code"
                      sx={{
                        bgcolor: isDarkMode ? 'rgba(0,0,0,0.3)' : '#f5f5f5',
                        p: 0.5,
                        borderRadius: 0.5,
                        fontFamily: 'monospace',
                        color: isDarkMode ? '#a6e22e' : '#2f6f4f'
                      }}
                    >
                      {children}
                    </Typography>
                  )
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                mt: 1, 
                display: 'block' 
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>
          </Box>
        </Box>
      ))}
      {isTyping && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            bgcolor: isDarkMode ? '#444654' : 'grey.50',
            p: 2,
            borderRadius: 2
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <SmartToyIcon />
          </Avatar>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <LoadingSpinner size={24} text="" showText={false} />
          </Box>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;