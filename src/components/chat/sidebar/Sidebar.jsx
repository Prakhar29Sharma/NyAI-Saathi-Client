import React from 'react';
import { Box, Button, Typography, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ChatList from './ChatList';
import { useChat } from '../../../context/ChatContext';
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = ({ onClose }) => {
  const { createNewChat, isDarkMode } = useChat();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : 300,
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
      {isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          py: 2,
          px: 2,
          borderBottom: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        }}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 600, color: isDarkMode ? 'white' : 'text.primary' }}
          >
            NyAI Sathi
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ p: { xs: 2.5, sm: 2 } }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            createNewChat();
            if (isMobile && onClose) onClose();
          }}
          sx={{
            py: 1.5,
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'primary.main',
            color: 'white',
            fontSize: isMobile ? '1rem' : 'inherit',
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'primary.dark',
            }
          }}
        >
          New Chat
        </Button>
      </Box>
      
      <Divider sx={{ 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
        mb: isMobile ? 1 : 0
      }} />
      
      <ChatList onSelect={isMobile ? onClose : undefined} />
      
      <Divider sx={{ 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
      }} />
      
      <Box sx={{
        p: { xs: 2.5, sm: 2 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
      }}>
        <Button
          fullWidth
          startIcon={<HomeIcon />}
          onClick={() => window.location.href = '/'}
          sx={{
            justifyContent: 'flex-start',
            py: isMobile ? 1.5 : 1,
            color: isDarkMode ? 'white' : 'text.primary',
            fontSize: isMobile ? '1rem' : 'inherit',
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