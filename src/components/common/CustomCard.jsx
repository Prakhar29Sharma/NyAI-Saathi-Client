import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const CustomCard = ({ 
  title, 
  children, 
  elevation = 2,
  ...props 
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        ...props.sx
      }}
    >
      {title && (
        <Typography 
          variant="h6" 
          gutterBottom 
          fontWeight="600"
        >
          {title}
        </Typography>
      )}
      <Box>
        {children}
      </Box>
    </Paper>
  );
};

export default CustomCard;