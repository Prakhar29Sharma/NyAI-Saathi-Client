import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, IconButton, ToggleButtonGroup, ToggleButton, 
  Tooltip, MenuItem, Select, FormControl
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import MicIcon from '@mui/icons-material/Mic';
import TranslateIcon from '@mui/icons-material/Translate';
import { useChat } from '../../../context/ChatContext';
import VoiceAssistant from './VoiceAssistant';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' }
];

const InputBox = ({ queryType, onQueryTypeChange, onSend }) => {
  const [message, setMessage] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [language, setLanguage] = useState('en');
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const { currentChatId, isDarkMode, chats } = useChat();

  const lawQueries = [
    "What are the provisions under Section 302 IPC?",
    "Explain rights under Article 21 of Constitution",
    "What is the procedure for filing RTI?",
    "Explain POCSO Act sections",
    "What are cyber laws in India?"
  ];

  const judgmentQueries = [
    "Recent Supreme Court judgments on Article 370",
    "Landmark cases on right to privacy",
    "High Court decisions on cryptocurrency in 2023",
    "Supreme Court views on death penalty",
    "Mention judgments on environmental protection"
  ];

  const currentPlaceholders = queryType === 'laws' ? lawQueries : judgmentQueries;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % currentPlaceholders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [queryType, currentPlaceholders.length]);

  useEffect(() => {
    setPlaceholderIndex(0);
  }, [queryType]);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  
  useEffect(() => {
    if (currentChat && currentChat.messages.length > 0) {
      const lastMessage = currentChat.messages[currentChat.messages.length - 1];
      if (!lastMessage.isUser) {
        setLastResponse(lastMessage.text);
      }
    }
  }, [currentChat]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setMessage(currentPlaceholders[placeholderIndex]);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && currentChatId) {
      let apiMessage = message;
      if (language !== 'en') {
        const langName = LANGUAGES.find(l => l.code === language)?.name.split(' ')[0];
        apiMessage = `${message}\n\nRespond in ${langName}`;
      }
      
      const messageToSend = message;
      setMessage('');
      
      await onSend(apiMessage, messageToSend);
    }
  };

  const handleVoiceAssistant = () => {
    setVoiceAssistantOpen(true);
  };

  const handleSendVoiceMessage = async (voiceMessage) => {
    if (voiceMessage.trim()) {
      let apiMessage = voiceMessage;
      if (language !== 'en') {
        const langName = LANGUAGES.find(l => l.code === language)?.name.split(' ')[0];
        apiMessage = `${voiceMessage}\n\nRespond in ${langName}`;
      }
      
      // Send directly to backend without updating input box
      await onSend(apiMessage, voiceMessage);
      return true;
    }
    return false;
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          bgcolor: isDarkMode ? '#1e1e2e' : '#f5f5f5'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          maxWidth: '800px', 
          margin: '0 auto',
          gap: 2,
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <ToggleButtonGroup
              value={queryType}
              exclusive
              onChange={onQueryTypeChange}
              aria-label="query type"
              size="small"
              sx={{
                alignSelf: 'center',
                bgcolor: isDarkMode ? '#252534' : 'white',
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 0.5,
                  color: isDarkMode ? 'white' : 'text.primary',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                  '&.Mui-selected': {
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    color: isDarkMode ? 'white' : 'primary.main'
                  }
                }
              }}
            >
              <ToggleButton value="laws" aria-label="laws">
                <GavelIcon sx={{ mr: 1, fontSize: 20 }} />
                Laws
              </ToggleButton>
              <ToggleButton value="judgements" aria-label="judgements">
                <HistoryIcon sx={{ mr: 1, fontSize: 20 }} />
                Judgements
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControl 
              size="small"
              sx={{
                minWidth: 120,
                bgcolor: isDarkMode ? '#252534' : 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'
                },
                '& .MuiSelect-select': {
                  color: isDarkMode ? 'white' : 'text.primary',
                },
                '& .MuiSvgIcon-root': {
                  color: isDarkMode ? 'white' : 'text.primary',
                }
              }}
            >
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                displayEmpty
                startAdornment={<TranslateIcon sx={{ mr: 1, fontSize: 20 }} />}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ 
            display: 'flex',
            gap: 1,
            boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
            borderRadius: 2,
            p: 1,
            bgcolor: isDarkMode ? '#252534' : 'white'
          }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentPlaceholders[placeholderIndex]}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  borderRadius: 2,
                  color: isDarkMode ? 'white' : 'text.primary',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)'
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary'
                }
              }}
            />
            
            {/* Voice Assistant button */}
            <Tooltip title="Voice Assistant">
              <IconButton
                onClick={handleVoiceAssistant}
                sx={{
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
            
            <IconButton 
              type="submit"
              color="primary"
              disabled={!message.trim() || !currentChatId}
              sx={{
                color: isDarkMode ? 'white' : 'primary.main'
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      
      {/* Voice Assistant dialog */}
      <VoiceAssistant 
        open={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
        onSendMessage={handleSendVoiceMessage}
        queryType={queryType}
        lastResponse={lastResponse}
      />
    </>
  );
};

export default InputBox;
