import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ 
  children, 
  variant = 'contained',
  color = 'primary',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 4,
        py: variant === 'contained' ? 1.5 : 1,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;