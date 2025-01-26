import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, TextField, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArticleIcon from '@mui/icons-material/Article';
import { useChat } from '../../../context/ChatContext';

const ChatItem = ({ chat, isActive }) => {
  const { setCurrentChatId, deleteChat, updateChatTitle, isDarkMode } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      updateChatTitle(chat.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditTitle(chat.title);
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteChat(chat.id);
  };

  return (
    <ListItem
      button
      onClick={() => !isEditing && setCurrentChatId(chat.id)}
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: isActive ? 
          (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(25, 118, 210, 0.08)') : 
          'transparent',
        borderLeft: '3px solid',
        borderLeftColor: isActive ? 
          (isDarkMode ? 'white' : 'primary.main') : 
          'transparent',
        '&:hover': {
          bgcolor: isDarkMode ? 
            'rgba(255,255,255,0.05)' : 
            'rgba(0,0,0,0.04)',
          '& .action-buttons': {
            opacity: 1,
            visibility: 'visible'
          }
        },
        transition: 'all 0.2s ease'
      }}
    >
      <ArticleIcon 
        sx={{ 
          mr: 2, 
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
          fontSize: 20
        }} 
      />
      
      {isEditing ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <TextField
            fullWidth
            size="small"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            sx={{
              '& .MuiInputBase-root': {
                color: isDarkMode ? 'white' : 'inherit',
                '& fieldset': {
                  borderColor: isDarkMode ? 
                    'rgba(255,255,255,0.3)' : 
                    'rgba(0,0,0,0.23)'
                }
              }
            }}
          />
          <IconButton size="small" onClick={handleSave}>
            <CheckIcon sx={{ color: 'success.main', fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={handleCancel}>
            <CloseIcon sx={{ color: 'error.main', fontSize: 18 }} />
          </IconButton>
        </Box>
      ) : (
        <>
          <ListItemText
            primary={
              <Typography 
                variant="body2" 
                noWrap
                sx={{ 
                  color: isDarkMode ? 'white' : 'text.primary',
                  fontWeight: isActive ? 500 : 400
                }}
              >
                {chat.title}
              </Typography>
            }
            secondary={
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDarkMode ? 
                    'rgba(255,255,255,0.5)' : 
                    'text.secondary'
                }}
              >
                {new Date(chat.timestamp).toLocaleDateString()}
              </Typography>
            }
          />
          <Box 
            className="action-buttons"
            sx={{ 
              opacity: 0,
              visibility: 'hidden',
              transition: 'all 0.2s ease',
              display: 'flex',
              gap: 0.5
            }}
          >
            <IconButton 
              size="small" 
              onClick={handleEdit}
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                '&:hover': {
                  bgcolor: isDarkMode ? 
                    'rgba(255,255,255,0.1)' : 
                    'rgba(0,0,0,0.04)'
                }
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleDelete}
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  bgcolor: isDarkMode ? 
                    'rgba(255,255,255,0.1)' : 
                    'rgba(0,0,0,0.04)'
                }
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </>
      )}
    </ListItem>
  );
};

export default ChatItem;