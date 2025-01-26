import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChat } from '../../../context/ChatContext';

const InputBox = ({ queryType, onQueryTypeChange, onSend }) => {
  const [message, setMessage] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { currentChatId, addMessageToChat, isDarkMode } = useChat();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

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

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Function to handle voice output
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN'; // Set language to Indian English
    utterance.rate = 1; // Adjust speed if necessary
    utterance.pitch = 1; // Adjust pitch if necessary
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Browser does not support speech recognition');
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setMessage(currentPlaceholders[placeholderIndex]);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && currentChatId) {
      onSend(message);
      speakText(message); // Speak the input message
      setMessage('');
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };

  return (
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
          <Tooltip title={listening ? "Stop Listening" : "Start Voice Input"}>
            <IconButton 
              onClick={handleVoiceInput}
              color={listening ? "secondary" : "primary"}
              disabled={!browserSupportsSpeechRecognition}
            >
              {listening ? <MicOffIcon /> : <MicIcon />}
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
  );
};

export default InputBox;
