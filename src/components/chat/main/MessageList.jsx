import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import PersonIcon from '@mui/icons-material/Person';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useChat } from '../../../context/ChatContext';
import { LoadingSpinner } from '../../common';
import { speakText, stopSpeaking, cleanTextForSpeech, initVoices } from '../../../utils/textToSpeech';
import NyaiLogo from '../../../assets/images/logo.png';

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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load available voices when component mounts
  useEffect(() => {
    const cleanup = initVoices();
    return cleanup;
  }, []);

  const handleSpeak = (message) => {
    if (speakingMessageId === message.id) {
      stopSpeaking();
      setSpeakingMessageId(null);
      setCurrentUtterance(null);
    } else {
      stopSpeaking();
      const cleanText = cleanTextForSpeech(message.text);
      
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
        p: { xs: 1, sm: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3 },
        bgcolor: isDarkMode ? '#1e1e2e' : '#f5f5f5',
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            bgcolor: isDarkMode 
              ? (message.isUser ? '#2d2d3a' : '#252534') 
              : (message.isUser ? '#e3f2fd' : 'white'),
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            boxShadow: isDarkMode 
              ? 'none' 
              : '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          {/* Avatar - conditionally hide on very small screens */}
          {!isMobile && (
            <Box
              sx={{
                width: 40, 
                height: 40,
                borderRadius: message.isUser ? '50%' : '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: message.isUser ? 'primary.main' : 'transparent'
              }}
            >
              {message.isUser ? (
                <PersonIcon style={{ color: '#fff' }} />
              ) : (
                <img 
                  src={NyaiLogo} 
                  alt="Nyai Saathi" 
                  style={{ 
                    width: 40, 
                    height: 40, 
                    objectFit: 'contain'
                  }} 
                />
              )}
            </Box>
          )}

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
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            lineHeight: 1.6,
                            '& :lang(hi), & :lang(mr), & :lang(kn), & :lang(gu), & :lang(bn), & :lang(ta), & :lang(te)': {
                              fontSize: { xs: '1.05rem', sm: '1.1rem' },
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
                            p: { xs: 1, sm: 2 },
                            borderRadius: 1,
                            overflow: 'auto',
                            color: isDarkMode ? 'white' : 'text.primary',
                            fontFamily: '"Roboto Mono", monospace',
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
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
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
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
                            fontWeight: 600,
                            fontSize: { xs: '1.2rem', sm: '1.5rem' }
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
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
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
                      size={isMobile ? "small" : "medium"}
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
                        <VolumeOffIcon fontSize={isMobile ? "small" : "small"} /> : 
                        <VolumeUpIcon fontSize={isMobile ? "small" : "small"} />
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
                display: 'block',
                fontSize: { xs: '0.65rem', sm: '0.75rem' }
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
            gap: { xs: 1, sm: 2 },
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            bgcolor: isDarkMode ? '#444654' : 'grey.50',
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2
          }}
        >
          {/* Update the typing indicator logo too */}
          {!isMobile && (
            <Box
              sx={{
                width: 40, 
                height: 40,
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={NyaiLogo} 
                alt="Nyai Saathi" 
                style={{ 
                  width: 40, 
                  height: 40, 
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <LoadingSpinner size={isMobile ? 20 : 24} text="" showText={false} />
          </Box>
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;