import React from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatList from './ChatList';
import { useChat } from '../../../context/ChatContext';
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = () => {
  const { createNewChat, isDarkMode } = useChat();

  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDarkMode ? '#1a1a2e' : '#f8f9fa',
        borderRight: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
        '& *::-webkit-scrollbar': {
          width: '6px',
        },
        '& *::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '& *::-webkit-scrollbar-thumb': {
          background: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createNewChat}
          sx={{
            py: 1,
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'primary.dark',
            }
          }}
        >
          New Chat
        </Button>
      </Box>
      
      <Divider sx={{ 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
      }} />
      
      <ChatList />
      
      <Divider sx={{ 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
      }} />
      
      <Box sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
      }}>
        <Button
          fullWidth
          startIcon={<HomeIcon />}
          onClick={() => window.location.href = '/'}
          sx={{
            justifyContent: 'flex-start',
            color: isDarkMode ? 'white' : 'text.primary',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
            }
          }}
        >
          Home
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;