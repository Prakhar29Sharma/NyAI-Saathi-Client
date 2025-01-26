import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../components/chat/sidebar/Sidebar';
import ChatArea from '../../components/chat/main/ChatArea';
import { useChat } from '../../context/ChatContext';

const ChatPage = () => {
  const { chats } = useChat();

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
      <Sidebar />
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