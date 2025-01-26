import React from 'react';
import { Box } from '@mui/material';
import ChatItem from './ChatItem';
import { useChat } from '../../../context/ChatContext';

const ChatList = () => {
  const { chats, currentChatId, setCurrentChatId } = useChat();

  return (
    <Box sx={{ overflow: 'auto', flex: 1, py: 2 }}>
      {chats.map((chat) => (
        <ChatItem 
          key={chat.id} 
          chat={chat}
          isActive={chat.id === currentChatId}
          onClick={() => setCurrentChatId(chat.id)}
        />
      ))}
    </Box>
  );
};

export default ChatList;