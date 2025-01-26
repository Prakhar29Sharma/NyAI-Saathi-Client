import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const UserProfile = () => {
  const [isLoggedIn] = React.useState(false);

  return (
    <Box sx={{ p: 2, color: 'white' }}>
      {isLoggedIn ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <PersonOutlineIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1">John Doe</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              john.doe@example.com
            </Typography>
          </Box>
        </Box>
      ) : (
        <Button
          fullWidth
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.3)',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Sign In
        </Button>
      )}
    </Box>
  );
};

export default UserProfile;