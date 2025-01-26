import React, { useState } from 'react';
import { Box, Button, IconButton, Drawer, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChatList from './ChatList';
import SettingsBar from '../settings/SettingsBar';
import SearchModal from './SearchModal';

const Sidebar = ({ onNewChat }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Open Sidebar Button - Only visible when sidebar is closed */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            left: 20,
            top: 20,
            zIndex: 1200,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            bgcolor: '#202123',
            transition: 'width 0.3s ease'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mb: 2,
            alignItems: 'center'
          }}>
            <Button
              startIcon={<AddIcon />}
              onClick={onNewChat}
              sx={{
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                flex: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              New Chat
            </Button>
            <IconButton 
              onClick={() => setSearchOpen(true)}
              sx={{ color: 'white' }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton 
              onClick={() => setIsOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <ChatList />
          <Box sx={{ mt: 'auto' }}>
            <SettingsBar />
          </Box>
        </Box>
      </Drawer>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Sidebar;