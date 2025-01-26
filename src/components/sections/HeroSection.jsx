import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import juryImage from '../../assets/images/jury.jpeg';
import { useChat } from '../../context/ChatContext';
import LoginModal from '../auth/LoginModal';

const HeroSection = () => {
  const navigate = useNavigate();
  const { createNewChat } = useChat();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleStartChat = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      createNewChat();
      navigate('/chat');
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        mt: '-80px', // Compensate for navbar height
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${juryImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -2
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
          zIndex: -1
        }
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          textAlign: 'center',
          color: 'white',
          pt: 15 // Add padding top to account for navbar
        }}
      >
        <Box data-aos="fade-up" data-aos-delay="200">
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Welcome to NyAI-Sathi
          </Typography>
        </Box>
        <Box data-aos="fade-up" data-aos-delay="400">
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 5,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Your AI-powered legal research assistant
          </Typography>
        </Box>
        <Box data-aos="fade-up" data-aos-delay="600">
          <Button 
            variant="contained"
            size="large"
            onClick={handleStartChat}
            sx={{ 
              bgcolor: '#ffffff',
              color: '#000000',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                bgcolor: '#ffffff',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }
            }}
          >
            Start Chatting
          </Button>
        </Box>
      </Container>
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </Box>
  );
};

export default HeroSection;