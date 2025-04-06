import React, { useState } from 'react';
import { ListItem, ListItemText, IconButton, TextField, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import { useChat } from '../../../context/ChatContext';

const ChatItem = ({ chat, isActive, onSelect }) => {
  const { setCurrentChatId, deleteChat, updateChatTitle, isDarkMode } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleChatSelect = () => {
    if (!isEditing) {
      setCurrentChatId(chat.id);
      if (onSelect) onSelect();
    }
  };

  return (
    <ListItem
      button
      onClick={handleChatSelect}
      sx={{
        px: { xs: 2.5, sm: 2 },
        py: { xs: 2, sm: 1.5 },
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
          mr: { xs: 2.5, sm: 2 }, 
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
          fontSize: { xs: 22, sm: 20 }
        }} 
      />
      
      {isEditing ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 1 } 
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
                fontSize: { xs: '1rem', sm: 'inherit' },
                padding: { xs: '10px 14px', sm: '8px 14px' },
                '& fieldset': {
                  borderColor: isDarkMode ? 
                    'rgba(255,255,255,0.3)' : 
                    'rgba(0,0,0,0.23)'
                }
              }
            }}
          />
          <IconButton size={isMobile ? "medium" : "small"} onClick={handleSave}>
            <CheckIcon sx={{ color: 'success.main', fontSize: { xs: 20, sm: 18 } }} />
          </IconButton>
          <IconButton size={isMobile ? "medium" : "small"} onClick={handleCancel}>
            <CloseIcon sx={{ color: 'error.main', fontSize: { xs: 20, sm: 18 } }} />
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
                  fontWeight: isActive ? 500 : 400,
                  fontSize: { xs: '1rem', sm: 'inherit' }
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
                    'text.secondary',
                  fontSize: { xs: '0.8rem', sm: 'inherit' }
                }}
              >
                {new Date(chat.timestamp).toLocaleDateString()}
              </Typography>
            }
          />
          <Box 
            className="action-buttons"
            sx={{ 
              opacity: { xs: 1, md: 0 },
              visibility: { xs: 'visible', md: 'hidden' },
              transition: 'all 0.2s ease',
              display: 'flex',
              gap: { xs: 1, sm: 0.5 }
            }}
          >
            <IconButton 
              size={isMobile ? "medium" : "small"} 
              onClick={handleEdit}
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                padding: { xs: '8px', sm: '4px' },
                '&:hover': {
                  bgcolor: isDarkMode ? 
                    'rgba(255,255,255,0.1)' : 
                    'rgba(0,0,0,0.04)'
                }
              }}
            >
              <EditIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
            </IconButton>
            <IconButton 
              size={isMobile ? "medium" : "small"} 
              onClick={handleDelete}
              sx={{
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                padding: { xs: '8px', sm: '4px' },
                '&:hover': {
                  color: 'error.main',
                  bgcolor: isDarkMode ? 
                    'rgba(255,255,255,0.1)' : 
                    'rgba(0,0,0,0.04)'
                }
              }}
            >
              <DeleteIcon sx={{ fontSize: { xs: 20, sm: 18 } }} />
            </IconButton>
          </Box>
        </>
      )}
    </ListItem>
  );
};

export default ChatItem;