import React from 'react';
import { IconButton, Menu, MenuItem, Avatar, Typography, Box, Divider } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const handleSwitchAccount = () => {
    navigate('/login');
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleMenu} sx={{ ml: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
          {userEmail?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 220, mt: 1 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userEmail}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleSwitchAccount}>Switch Account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;