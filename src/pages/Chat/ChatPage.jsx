import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../../components/chat/sidebar/Sidebar';
import ChatArea from '../../components/chat/main/ChatArea';
import { useChat } from '../../context/ChatContext';

const ChatPage = () => {
  const { createNewChat, chats } = useChat();

  useEffect(() => {
    // Create initial chat if no chats exist
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

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
      <Sidebar onNewChat={createNewChat} />
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