import React from 'react';
import { Box, Typography, Avatar, Divider, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';

const SettingsBar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  return (
    <Box sx={{ p: 2 }}>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
      {userEmail ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {userEmail.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>
              {userEmail.split('@')[0]}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
              {userEmail}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Button
          startIcon={<PersonOutlineIcon />}
          fullWidth
          onClick={() => navigate('/login')}
          sx={{ 
            color: 'white', 
            justifyContent: 'flex-start',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Sign In
        </Button>
      )}
      <Button
        startIcon={<SettingsIcon />}
        fullWidth
        sx={{ 
          color: 'white', 
          justifyContent: 'flex-start', 
          mt: 1,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
        }}
      >
        Settings
      </Button>
    </Box>
  );
};

export default SettingsBar;