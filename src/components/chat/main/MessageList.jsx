import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useChat } from '../../../context/ChatContext';
import { LoadingSpinner } from '../../common';
import { cleanTextForSpeech, stopSpeaking } from '../../../utils/textToSpeech';

// Add language-voice mapping
const LANGUAGE_VOICES = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'mr': 'mr-IN'
};

// Helper to detect language of text for proper speech
const detectLanguage = (text) => {
  // Simple detection based on script characters
  const devanagariPattern = /[\u0900-\u097F]/; // Hindi, Marathi
  
  if (devanagariPattern.test(text)) {
    // Check for Marathi-specific characters or words if needed
    if (text.includes('ी') || text.includes('मराठी')) {
      return 'mr';
    }
    return 'hi';
  }
  
  return 'en'; // Default to English
};

const speakText = (text, onEnd) => {
  window.speechSynthesis.cancel();
  
  // Detect language of text
  const detectedLang = detectLanguage(text);
  const langCode = LANGUAGE_VOICES[detectedLang] || 'en-IN';
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  
  // Adjust rate and pitch for better multilingual performance
  utterance.rate = detectedLang === 'en' ? 1 : 0.9;
  utterance.pitch = 1;
  
  // Find appropriate voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith(langCode.split('-')[0]) && 
    voice.localService
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  utterance.onend = () => {
    onEnd && onEnd();
  };
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    onEnd && onEnd();
  };
  
  window.speechSynthesis.speak(utterance);
  return utterance;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const MessageList = ({ messages = [], isTyping = false }) => {
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useChat();
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    
    // Some browsers need this event to load voices
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleSpeak = (message) => {
    if (speakingMessageId === message.id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      setCurrentUtterance(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = message.text.replace(/```[\s\S]*?```/g, '').replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1').replace(/[#*`_]/g, '').trim();
      
      const utterance = speakText(cleanText, () => {
        setSpeakingMessageId(null);
        setCurrentUtterance(null);
      });

      if (utterance) {
        setSpeakingMessageId(message.id);
        setCurrentUtterance(utterance);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (currentUtterance) {
        stopSpeaking();
        setCurrentUtterance(null);
      }
    };
  }, [currentUtterance]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        bgcolor: isDarkMode ? '#1e1e2e' : '#f5f5f5',
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            gap: 2,
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            bgcolor: isDarkMode 
              ? (message.isUser ? '#2d2d3a' : '#252534') 
              : (message.isUser ? '#e3f2fd' : 'white'),
            p: 2,
            borderRadius: 2,
            boxShadow: isDarkMode 
              ? 'none' 
              : '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Avatar sx={{ bgcolor: message.isUser ? 'primary.main' : 'secondary.main' }}>
            {message.isUser ? <PersonIcon /> : <SmartToyIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                {message.isUser ? (
                  <Typography color={isDarkMode ? 'white' : 'text.primary'}>
                    {message.text}
                  </Typography>
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({children}) => (
                        <Typography 
                          sx={{ 
                            my: 1,
                            color: isDarkMode ? 'white' : 'text.primary',
                            fontFamily: '"Noto Sans", "Noto Sans Devanagari", "Noto Sans Bengali", system-ui, sans-serif',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            '& :lang(hi), & :lang(mr), & :lang(kn), & :lang(gu), & :lang(bn), & :lang(ta), & :lang(te)': {
                              fontSize: '1.1rem',
                              lineHeight: 1.8
                            }
                          }}
                        >
                          {children}
                        </Typography>
                      ),
                      pre: ({children}) => (
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: isDarkMode ? 'rgba(0,0,0,0.3)' : '#f5f5f5',
                            p: 2,
                            borderRadius: 1,
                            overflow: 'auto',
                            color: isDarkMode ? 'white' : 'text.primary',
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: '0.9rem',
                            '& code': {
                              color: isDarkMode ? '#a6e22e' : '#2f6f4f'
                            }
                          }}
                        >
                          {children}
                        </Box>
                      ),
                      code: ({children}) => (
                        <Typography
                          component="code"
                          sx={{
                            bgcolor: isDarkMode ? 'rgba(0,0,0,0.3)' : '#f5f5f5',
                            p: 0.5,
                            borderRadius: 0.5,
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: '0.9rem',
                            color: isDarkMode ? '#a6e22e' : '#2f6f4f'
                          }}
                        >
                          {children}
                        </Typography>
                      ),
                      h1: ({children}) => (
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mt: 3, 
                            mb: 1.5,
                            color: isDarkMode ? 'white' : 'text.primary',
                            fontFamily: '"Noto Sans", system-ui, sans-serif',
                            fontWeight: 600
                          }}
                        >
                          {children}
                        </Typography>
                      ),
                      h2: ({children}) => (
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mt: 2.5, 
                            mb: 1,
                            color: isDarkMode ? 'white' : 'text.primary',
                            fontFamily: '"Noto Sans", system-ui, sans-serif',
                            fontWeight: 600
                          }}
                        >
                          {children}
                        </Typography>
                      )
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                )}
              </Box>
              {!message.isUser && (
                <Box sx={{ display: 'flex' }}>
                  <Tooltip title={speakingMessageId === message.id ? "Stop Speaking" : "Read Aloud"}>
                    <IconButton 
                      onClick={() => handleSpeak(message)}
                      size="small"
                      sx={{
                        ml: 1,
                        color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: isDarkMode ? 
                            'rgba(255,255,255,0.1)' : 
                            'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      {speakingMessageId === message.id ? 
                        <VolumeOffIcon fontSize="small" /> : 
                        <VolumeUpIcon fontSize="small" />
                      }
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                mt: 1, 
                display: 'block' 
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>
          </Box>
        </Box>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            bgcolor: isDarkMode ? '#444654' : 'grey.50',
            p: 2,
            borderRadius: 2
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <SmartToyIcon />
          </Avatar>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <LoadingSpinner size={24} text="" showText={false} />
          </Box>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;