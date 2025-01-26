import React from 'react';
import { ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useChat } from '../../../context/ChatContext';

const ChatItem = ({ chat, isActive }) => {
  const { setCurrentChatId, deleteChat } = useChat();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteChat(chat.id);
  };

  return (
    <ListItem
      button
      onClick={() => setCurrentChatId(chat.id)}
      sx={{
        color: 'white',
        p: 2,
        bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        '&:hover': { 
          bgcolor: 'rgba(255,255,255,0.05)',
          '& .delete-button': {
            opacity: 1
          }
        },
        '& .MuiListItemIcon-root': {
          color: 'white'
        },
        '& .MuiTypography-root': {
          color: 'white'
        },
        '& .MuiTypography-secondary': {
          color: 'rgba(255,255,255,0.7)'
        }
      }}
    >
      <ChatBubbleOutlineIcon sx={{ mr: 2, color: 'text.secondary' }} />
      <ListItemText
        primary={
          <Typography noWrap>
            {chat.title}
          </Typography>
        }
        secondary={new Date(chat.timestamp).toLocaleDateString()}
      />
      <IconButton 
        className="delete-button"
        onClick={handleDelete}
        sx={{ 
          opacity: 0,
          transition: 'opacity 0.2s'
        }}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
};

export default ChatItem;