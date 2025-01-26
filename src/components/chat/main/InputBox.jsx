import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../../../context/ChatContext';

const InputBox = () => {
  const [message, setMessage] = useState('');
  const { currentChatId, addMessageToChat } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && currentChatId) {
      addMessageToChat(currentChatId, message.trim());
      setMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        position: 'sticky',
        bottom: 0,
        zIndex: 1,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        maxWidth: '800px', 
        margin: '0 auto',
        gap: 1,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: 2,
        p: 1
      }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your legal query here..."
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }
          }}
        />
        <IconButton 
          type="submit"
          color="primary"
          disabled={!message.trim() || !currentChatId}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default InputBox;