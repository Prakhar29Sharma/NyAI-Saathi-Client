import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, IconButton, Dialog, 
  DialogContent, Fade 
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CloseIcon from '@mui/icons-material/Close';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useChat } from '../../../context/ChatContext';
import { LoadingSpinner } from '../../common';
import NyaiLogo from '../../../assets/images/logo.png';
import SiriWaveform from '../../voice/SiriWaveForm';

// Speech synthesis function
const speak = (text, onEnd = () => {}) => {
  if (!window.speechSynthesis) return null;
  
  window.speechSynthesis.cancel();
  
  // Remove markdown and code blocks for better speech
  const cleanText = text
    .replace(/```[\s\S]*?```/g, 'code block omitted')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/#/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .trim();
  
  // Break up long text into chunks that the speech API can handle
  const textChunks = chunkText(cleanText, 200); // ~200 words per chunk
  let currentChunk = 0;
  
  const speakNextChunk = () => {
    if (currentChunk >= textChunks.length) {
      onEnd();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(textChunks[currentChunk]);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      currentChunk++;
      speakNextChunk();
    };
    
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      currentChunk++;
      speakNextChunk();
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  speakNextChunk();
  
  return {
    cancel: () => {
      window.speechSynthesis.cancel();
    }
  };
};

// Helper function to chunk text
const chunkText = (text, wordsPerChunk) => {
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  
  return chunks;
};

const VoiceAssistant = ({ open, onClose, onSendMessage, queryType, lastResponse }) => {
  const { isDarkMode } = useChat();
  // States: greeting, listening, processing, received
  const [status, setStatus] = useState('greeting'); 
  const [assistantText, setAssistantText] = useState('');
  const [processingText, setProcessingText] = useState('');
  const [currentSpeech, setCurrentSpeech] = useState(null);
  
  // Use speech recognition ONLY within this component
  const { 
    transcript, 
    listening, 
    resetTranscript, 
    browserSupportsSpeechRecognition 
  } = useSpeechRecognition();

  // Step 1: Greet the user
  useEffect(() => {
    if (open) {
      // Reset everything when opening
      setStatus('greeting');
      setAssistantText('');
      resetTranscript();
      
      const greetingText = "Hello! How can I help you today?";
      setAssistantText(greetingText);
      
      // Slight delay before speaking to ensure dialog is visible
      setTimeout(() => {
        speak(greetingText, () => {
          // After greeting, start listening
          setStatus('listening');
          SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        });
      }, 500);
    } else {
      // Cleanup when closing
      SpeechRecognition.stopListening();
      window.speechSynthesis.cancel();
    }
    
    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
      SpeechRecognition.stopListening();
    };
  }, [open, resetTranscript]);
  
  // Check if response is received - MODIFIED
  useEffect(() => {
    if (status === 'processing' && lastResponse) {
      setStatus('received');
      setAssistantText("System is processing your query and generating response");
      
      // Announce that response has arrived and close
      speak("System is processing your query and generating response", () => {
        // Short delay before closing to let the user see the message
        setTimeout(() => {
          onClose();
        }, 2500); // Increased delay to ensure animation is visible
      });
    }
  }, [lastResponse, status, onClose]);
  
  // Add cleanup function for speech
  useEffect(() => {
    return () => {
      if (currentSpeech) {
        currentSpeech.cancel();
      }
      window.speechSynthesis.cancel();
    };
  }, [currentSpeech]);
  
  // Process user's speech for the query
  useEffect(() => {
    if (status === 'listening' && transcript && transcript.trim().length > 0) {
      // Stop listening after user finishes speaking (detected by pause)
      const timer = setTimeout(() => {
        if (transcript.trim().length > 0) {
          SpeechRecognition.stopListening();
          setStatus('processing');
          setProcessingText(transcript);
          
          // Process the request without affecting the input box
          handleProcessSpeech(transcript);
        }
      }, 1500); // Adjust time as needed to detect end of speech
      
      return () => clearTimeout(timer);
    }
  }, [transcript, status]);
  
  // Process speech and get response
  const handleProcessSpeech = useCallback(async (text) => {
    try {
      setStatus('processing');
      setAssistantText("I'm processing your request...");
      
      // Send the transcript directly to your API without affecting input box
      await onSendMessage(text);
      
      // Don't close the dialog - wait for response
      
    } catch (error) {
      console.error('Speech processing error:', error);
      setStatus('error');
      setAssistantText("I'm sorry, I couldn't process that. Please try again.");
      speak("I'm sorry, I couldn't process that. Please try again.", () => {
        resetTranscript();
        setStatus('listening');
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
      });
    }
  }, [onSendMessage, resetTranscript]);
  
  // Handle toggle listening
  const handleToggleListen = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (status === 'listening' && transcript) {
        setStatus('processing');
        handleProcessSpeech(transcript);
      }
    } else {
      resetTranscript();
      setStatus('listening');
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }
  };
  
  // Handle close with proper cleanup
  const handleModalClose = () => {
    // Ensure speech recognition is stopped
    SpeechRecognition.stopListening();
    
    // Cancel any ongoing speech synthesis
    window.speechSynthesis.cancel();
    
    // Clean up any current speech object
    if (currentSpeech) {
      currentSpeech.cancel();
    }
    
    // Call the parent component's onClose function
    onClose();
  };
  
  if (!browserSupportsSpeechRecognition) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth 
        maxWidth="sm"
      >
        <DialogContent>
          <Typography>
            Your browser doesn't support speech recognition.
            Please use Chrome or Edge for this feature.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog 
      open={open} 
      onClose={handleModalClose}
      fullWidth 
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{
        bgcolor: isDarkMode ? '#121212' : '#f8f8f8',
        color: isDarkMode ? 'white' : 'text.primary',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12,
          zIndex: 2
        }}>
          <IconButton 
            onClick={handleModalClose} 
            size="medium"
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' 
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '350px',
          width: '100%',
          textAlign: 'center',
          gap: 4,
          position: 'relative'
        }}>
          {/* Logo at top */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img 
              src={NyaiLogo} 
              alt="Nyai Saathi" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }} 
            />
          </Box>
          
          {/* Main area with siri animation */}
          <Box sx={{ width: '100%', position: 'relative', py: 2 }}>
            <Box sx={{ 
              width: '100%', 
              height: 150, // Fixed height
              position: 'relative',
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Siri waveform */}
              {(status === 'listening' || status === 'greeting') && (
                <SiriWaveform 
                  isActive={status === 'listening'} 
                  isDarkMode={isDarkMode}
                  size={280}
                />
              )}
              
              {/* Loading animation - only shown when processing */}
              {(status === 'processing' || status === 'received') && (
                <Box sx={{ 
                  position: 'relative',
                  width: 100,
                  height: 100,
                  margin: '0 auto' // Center horizontally
                }}>
                  {/* Outer rotating circle */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: '2px solid transparent',
                    borderTopColor: 'primary.main',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} />
                  
                  {/* Middle rotating circle */}
                  <Box sx={{
                    position: 'absolute',
                    top: 15,
                    left: 15,
                    right: 15,
                    bottom: 15,
                    border: '2px solid transparent',
                    borderTopColor: 'secondary.main',
                    borderRadius: '50%',
                    animation: 'spin 1.5s linear infinite reverse',
                  }} />
                  
                  {/* Inner rotating circle */}
                  <Box sx={{
                    position: 'absolute',
                    top: 30,
                    left: 30,
                    right: 30,
                    bottom: 30,
                    border: '2px solid transparent',
                    borderTopColor: 'error.main',
                    borderRadius: '50%',
                    animation: 'spin 2s linear infinite',
                  }} />
                  
                  {/* Center dot */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 12,
                    height: 12,
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    animation: 'pulse 1s ease-in-out infinite alternate',
                    '@keyframes pulse': {
                      '0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0.7 },
                      '100%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1 }
                    }
                  }} />
                </Box>
              )}
            </Box>
            
            {/* Assistant text with nice typography */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500, 
                fontSize: '1.25rem',
                mb: 2
              }}
            >
              {assistantText}
            </Typography>
            
            {/* Fun little bounce dots below text when processing */}
            {(status === 'processing' || status === 'received') && (
              <Box sx={{ 
                mt: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  mb: 1,
                  '& > div': {
                    width: 8,
                    height: 8,
                    margin: '0 4px',
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    animation: 'bounce 1.4s infinite ease-in-out both'
                  },
                  '& > div:nth-of-type(1)': {
                    animationDelay: '-0.32s'
                  },
                  '& > div:nth-of-type(2)': {
                    animationDelay: '-0.16s'
                  },
                  '& > div:nth-of-type(3)': {
                    animationDelay: '0s'
                  },
                  '@keyframes bounce': {
                    '0%, 80%, 100%': {
                      transform: 'scale(0)'
                    },
                    '40%': {
                      transform: 'scale(1)'
                    }
                  }
                }}>
                  <div></div>
                  <div></div>
                  <div></div>
                </Box>
                
                <Typography variant="body2" sx={{ 
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                  fontStyle: 'italic',
                  mt: 1
                }}>
                  {status === 'received' ? 'Preparing your response...' : 'Working on something brilliant for you...'}
                </Typography>
              </Box>
            )}
            
            {status === 'listening' && transcript && (
              <Fade in={Boolean(transcript)}>
                <Typography 
                  sx={{ 
                    mt: 2, 
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    maxWidth: '80%',
                    mx: 'auto'
                  }}
                >
                  "{transcript}"
                </Typography>
              </Fade>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceAssistant;