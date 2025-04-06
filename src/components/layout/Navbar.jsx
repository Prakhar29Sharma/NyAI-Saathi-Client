import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginModal from '../auth/LoginModal';

const Navbar = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChatClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      navigate('/chat');
      if (isMobile) setDrawerOpen(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
    if (isMobile) setDrawerOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    if (isMobile) setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { label: 'Home', action: handleHomeClick },
    { label: 'Chat', action: handleChatClick },
    { label: 'Login', action: handleLoginClick }
  ];

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
        <Toolbar sx={{ height: 80, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          
          {isMobile ? (
            <IconButton 
              edge="end" 
              color="inherit" 
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {navItems.map((item) => (
                <Button 
                  key={item.label}
                  onClick={item.action}
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
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '75%',
            maxWidth: 300,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h6" color="white">
            Menu
          </Typography>
          <IconButton 
            onClick={toggleDrawer(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ py: 2 }}>
          {navItems.map((item) => (
            <ListItem 
              key={item.label} 
              button 
              onClick={item.action}
              sx={{ 
                py: 2,
                '&:hover': { 
                  bgcolor: 'rgba(255, 255, 255, 0.1)' 
                }
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  color: 'white', 
                  fontSize: '1.2rem',
                  fontWeight: 500 
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </AppBar>
  );
};

export default Navbar;