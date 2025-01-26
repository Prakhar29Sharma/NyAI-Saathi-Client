import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import LoginModal from '../auth/LoginModal';

const Navbar = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleChatClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      navigate('/chat');
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'transparent',
        boxShadow: 'none'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ height: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <GavelIcon sx={{ color: '#ffffff', fontSize: 35, mr: 2 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#ffffff',
                fontWeight: 800,
                letterSpacing: 1
              }}
            >
              NyAI-Sathi
            </Typography>
          </Box>
          <Box>
            <Button 
              onClick={() => navigate('/')}
              sx={{ 
                color: '#ffffff',
                mx: 1,
                fontSize: '1.1rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '0%',
                  height: '2px',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  transition: 'width 0.3s ease-in-out'
                },
                '&:hover::after': {
                  width: '80%'
                }
              }}
            >
              Home
            </Button>
            <Button 
              onClick={handleChatClick}
              sx={{ 
                color: '#ffffff',
                mx: 1,
                fontSize: '1.1rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '0%',
                  height: '2px',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  transition: 'width 0.3s ease-in-out'
                },
                '&:hover::after': {
                  width: '80%'
                }
              }}
            >
              Chat
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              sx={{ 
                color: '#ffffff',
                mx: 1,
                fontSize: '1.1rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '0%',
                  height: '2px',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  transition: 'width 0.3s ease-in-out'
                },
                '&:hover::after': {
                  width: '80%'
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </AppBar>
  );
};

export default Navbar;