import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { useChat } from '../../../context/ChatContext';
import ProfileMenu from '../profile/ProfileMenu';

const ChatArea = () => {
  const { currentChatId, chats, isDarkMode, toggleTheme } = useChat();
  const currentChat = chats.find(chat => chat.id === currentChatId);

  return (
    <Box
      sx={{
        flex: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDarkMode ? '#343541' : 'background.default',
        position: 'relative'
      }}
    >
      <Box sx={{ 
        position: 'absolute',
        right: 16,
        top: 16,
        display: 'flex',
        alignItems: 'center'
      }}>
        <IconButton onClick={toggleTheme}>
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <ProfileMenu />
      </Box>
      
      {currentChat ? (
        <>
          <MessageList messages={currentChat.messages} />
          <InputBox />
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <Typography color="white">
            Select a chat or start a new conversation
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatArea;