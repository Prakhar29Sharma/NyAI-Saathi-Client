import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>Authentication Required</DialogTitle>
      <DialogContent>
        <Typography>
          Please login to continue using NyAI-Sathi
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            bgcolor: '#000000',
            color: '#ffffff',
            px: 3,
            '&:hover': {
              bgcolor: '#333333'
            }
          }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;