import React, { useState } from 'react';
import { Box, Typography, IconButton, useMediaQuery, useTheme, SwipeableDrawer } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import MessageList from './MessageList';
import InputBox from './InputBox';
import { useChat } from '../../../context/ChatContext';
import ProfileMenu from '../profile/ProfileMenu';
import Sidebar from '../sidebar/Sidebar';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentChat = chats.find(chat => chat.id === currentChatId);

  const handleSendMessage = async (apiMessage, displayMessage) => {
    if (!currentChatId) return;
    
    setIsTyping(true);
    try {
      const result = await addMessageToChat(currentChatId, apiMessage, queryType, displayMessage);
      return result;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    } finally {
      setIsTyping(false);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
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
      {/* Mobile drawer for sidebar */}
      {isMobile && (
        <>
          <IconButton
            onClick={toggleDrawer(true)}
            sx={{
              position: 'absolute',
              left: 16,
              top: 16,
              zIndex: 3,
              color: isDarkMode ? 'white' : 'text.primary',
              bgcolor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(5px)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: 1,
              '&:hover': {
                bgcolor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            sx={{
              '& .MuiDrawer-paper': {
                width: { xs: '85%', sm: 300 },
                boxSizing: 'border-box',
                boxShadow: '0 0 20px rgba(0,0,0,0.25)',
              },
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              }
            }}
          >
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </SwipeableDrawer>
        </>
      )}
      
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
            onQueryTypeChange={(_, newValue) => newValue && setQueryType(newValue)}
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
          gap: 2,
          px: 3
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