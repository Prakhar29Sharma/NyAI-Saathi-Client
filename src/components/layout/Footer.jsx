import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';

const Footer = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChatClick = (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      setLoginModalOpen(true);
    } else {
      navigate('/chat');
    }
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#000000',
        color: '#ffffff',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              NyAI-Sathi is your AI-powered legal research assistant.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link 
              href="#" 
              onClick={handleChatClick}
              sx={{ 
                color: 'white',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Chat
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">
              Email: support@nyaisathi.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </Box>
  );
};

export default Footer;