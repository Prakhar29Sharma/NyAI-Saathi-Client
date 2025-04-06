import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '../../components/chat/sidebar/Sidebar';
import ChatArea from '../../components/chat/main/ChatArea';
import { useChat } from '../../context/ChatContext';

const ChatPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { chats } = useChat();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box 
      sx={{ 
        display: 'flex',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'hidden'
      }}
    >
      {/* Show sidebar permanently only on desktop */}
      {isDesktop && <Sidebar />}
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper'
        }}
      >
        <ChatArea />
      </Box>
    </Box>
  );
};

export default ChatPage;