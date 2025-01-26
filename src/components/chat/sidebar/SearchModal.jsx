import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  Box,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useChat } from '../../../context/ChatContext';

const SearchModal = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, setCurrentChatId } = useChat();

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleChatSelect = (chatId) => {
    setCurrentChatId(chatId);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '50vh' }
      }}
    >
      <DialogTitle sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            autoFocus
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {searchQuery ? (
          <List>
            {filteredChats.map((chat) => (
              <ListItem 
                key={chat.id} 
                button
                onClick={() => handleChatSelect(chat.id)}
              >
                <ListItemText 
                  primary={chat.title}
                  secondary={`${chat.messages.length} messages`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Recent Chats
            </Typography>
            <List>
              {chats.slice(0, 5).map((chat) => (
                <ListItem 
                  key={chat.id} 
                  button
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <ListItemText 
                    primary={chat.title}
                    secondary={new Date(chat.timestamp).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;