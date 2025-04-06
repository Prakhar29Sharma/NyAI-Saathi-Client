import React from 'react';
import { List, Box, Typography } from '@mui/material';
import ChatItem from './ChatItem';
import { useChat } from '../../../context/ChatContext';

const ChatList = ({ onSelect }) => {
  const { chats, currentChatId, isDarkMode } = useChat();

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
      }}
    >
      {chats.length > 0 ? (
        <List sx={{ py: 0 }}>
          {chats.map((chat) => (
            <ChatItem 
              key={chat.id} 
              chat={chat} 
              isActive={chat.id === currentChatId} 
              onSelect={onSelect}
            />
          ))}
        </List>
      ) : (
        <Box sx={{ 
          p: 3, 
          textAlign: 'center',
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'
        }}>
          <Typography variant="body2">
            No chats yet. Start a new conversation!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatList;