import React, { useState } from 'react';
import { 
  Box, Container, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Alert 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import courtImage from '../../assets/images/court.jpg';

// Sample credentials
const MOCK_CREDENTIALS = [
  { email: 'user@example.com', password: 'user123' },
  { email: 'admin@example.com', password: 'admin123' }
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidUser = MOCK_CREDENTIALS.some(
      cred => cred.email === formData.email && cred.password === formData.password
    );

    if (isValidUser) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/chat');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${courtImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)',
          zIndex: -1
        }
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
            Login to access NyAI-Sathi
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-input': { color: 'white' }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ 
                mt: 3,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              Login
            </Button>
          </form>

          <Typography 
            variant="caption" 
            sx={{ 
              mt: 3, 
              display: 'block', 
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            Sample credentials: admin@example.com / admin123
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;