import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40,
  text = 'Loading...',
  showText = true,
  ...props 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
        ...props.sx
      }}
    >
      <CircularProgress size={size} color="primary" />
      {showText && (
        <Typography color="text.secondary" variant="body2">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;