import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { useChat } from '../../../context/ChatContext';
import ProfileMenu from '../profile/ProfileMenu';

const ChatArea = () => {
  const { 
    currentChatId, 
    chats,
    isDarkMode, 
    toggleTheme,
    addMessageToChat 
  } = useChat();
  const [queryType, setQueryType] = useState('laws');
  const [isTyping, setIsTyping] = useState(false);

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSendMessage = async (apiMessage, displayMessage) => {
    if (!currentChatId) return;
    
    setIsTyping(true);
    try {
      // Use addMessageToChat from context to send the message
      const result = await addMessageToChat(currentChatId, apiMessage, queryType, displayMessage);
      return result;
    } catch (error) {
      console.error("API Error:", error);
      // Error handling is now done in the context
      return null;
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
          <MessageList 
            messages={currentChat.messages} 
            isTyping={isTyping} 
          />
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
          height: '100%',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography 
            variant="h6"
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
              textAlign: 'center'
            }}
          >
            Select a chat or start a new conversation
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
              textAlign: 'center'
            }}
          >
            Your chat history will be saved automatically
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatArea;