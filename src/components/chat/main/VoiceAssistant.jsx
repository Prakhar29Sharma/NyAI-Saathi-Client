import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, Typography, IconButton, Dialog, 
  DialogContent, Fade, useMediaQuery, useTheme,
  Button, Alert, CircularProgress
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
  // States: greeting, listening, processing, received, permission, error
  const [status, setStatus] = useState('greeting'); 
  const [assistantText, setAssistantText] = useState('');
  const [processingText, setProcessingText] = useState('');
  const [currentSpeech, setCurrentSpeech] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [recognitionError, setRecognitionError] = useState('');
  const [isListeningActive, setIsListeningActive] = useState(false);
  const recognitionTimeout = useRef(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use speech recognition ONLY within this component
  const { 
    transcript, 
    listening, 
    resetTranscript, 
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Check for microphone permission when opened
  useEffect(() => {
    if (open) {
      if (!browserSupportsSpeechRecognition) {
        setStatus('error');
        setAssistantText('Your browser does not support speech recognition. Please try using Chrome or Edge.');
        return;
      }

      const checkMicrophonePermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissionError(false);
        } catch (err) {
          console.error('Microphone permission error:', err);
          setPermissionError(true);
          setStatus('permission');
          setAssistantText('Microphone access is required for voice recognition.');
        }
      };
      
      checkMicrophonePermission();
    }
  }, [open, browserSupportsSpeechRecognition]);

  // Step 1: Greet the user
  useEffect(() => {
    if (open && !permissionError && status !== 'error') {
      // Reset everything when opening
      setStatus('greeting');
      setAssistantText('');
      resetTranscript();
      setRecognitionError('');
      
      const greetingText = "Hello! How can I help you today?";
      setAssistantText(greetingText);
      
      // Slight delay before speaking to ensure dialog is visible
      setTimeout(() => {
        speak(greetingText, () => {
          // After greeting, start listening
          startListening();
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
      if (recognitionTimeout.current) {
        clearTimeout(recognitionTimeout.current);
      }
    };
  }, [open, resetTranscript, permissionError]);

  // Monitor listening status with a watchdog timer
  useEffect(() => {
    if (listening) {
      setIsListeningActive(true);
      // Clear any previous timeout
      if (recognitionTimeout.current) {
        clearTimeout(recognitionTimeout.current);
      }
      
      // Set a timeout to check if recognition is stalled (20 seconds)
      recognitionTimeout.current = setTimeout(() => {
        // If still listening after timeout, try restarting
        if (listening) {
          console.log("Restarting speech recognition due to possible stall");
          SpeechRecognition.stopListening();
          setTimeout(() => {
            startListening();
          }, 500);
        }
      }, 20000);
    } else {
      if (isListeningActive && status === 'listening') {
        // If we were listening but stopped unexpectedly (not by our command)
        if (!transcript.trim()) {
          // If no transcript, try again
          console.log("Recognition stopped without input, restarting...");
          setTimeout(() => {
            startListening();
          }, 300);
        }
      }
    }
    
    return () => {
      if (recognitionTimeout.current) {
        clearTimeout(recognitionTimeout.current);
      }
    };
  }, [listening, status, transcript]);
  
  const startListening = () => {
    setStatus('listening');
    try {
      SpeechRecognition.startListening({ 
        continuous: true, 
        language: 'en-IN',
        interimResults: true
      });
    } catch (err) {
      console.error("Error starting speech recognition:", err);
      setRecognitionError("There was a problem starting voice recognition.");
    }
  };
  
  // Check if response is received
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
      }, isMobile ? 2000 : 1500); // Slightly longer timeout on mobile
      
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
        startListening();
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
      } else {
        setStatus('greeting');
      }
    } else {
      resetTranscript();
      startListening();
    }
  };
  
  // Handle manual permission request
  const handleRequestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionError(false);
      
      // Reset to greeting status
      setStatus('greeting');
      const greetingText = "Hello! How can I help you today?";
      setAssistantText(greetingText);
      
      setTimeout(() => {
        speak(greetingText, () => {
          startListening();
        });
      }, 500);
    } catch (err) {
      console.error('Microphone permission error:', err);
      setPermissionError(true);
      setAssistantText('Voice input requires microphone access. Please enable it in your browser settings.');
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
    
    // Clear any timeouts
    if (recognitionTimeout.current) {
      clearTimeout(recognitionTimeout.current);
    }
    
    // Call the parent component's onClose function
    onClose();
  };
  
  // Special cases for error states
  if (!browserSupportsSpeechRecognition) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth 
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Browser Not Supported
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Your browser doesn't support speech recognition.
              Please use Chrome or Edge for this feature.
            </Typography>
            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Permission error UI
  if (permissionError && status === 'permission') {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth 
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom color="error">
              Microphone Access Required
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Voice Assistant needs access to your microphone. 
              Please grant permission in your browser settings.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleRequestPermission}>
                Request Permission
              </Button>
            </Box>
          </Box>
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
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: fullScreen ? '0' : '16px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{
        bgcolor: isDarkMode ? '#121212' : '#f8f8f8',
        color: isDarkMode ? 'white' : 'text.primary',
        p: { xs: 2, sm: 4 },
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
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' 
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {recognitionError && (
          <Alert 
            severity="warning" 
            sx={{ 
              width: '100%', 
              mb: 2,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => {
                  setRecognitionError('');
                  startListening();
                }}
              >
                Try Again
              </Button>
            }
          >
            {recognitionError}
          </Alert>
        )}
        
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '300px', sm: '350px' },
          width: '100%',
          textAlign: 'center',
          gap: { xs: 2, sm: 4 },
          position: 'relative'
        }}>
          {/* Logo at top */}
          <Box
            sx={{
              width: { xs: 50, sm: 60 },
              height: { xs: 50, sm: 60 },
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
          
          {/* Status indicator */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            <Box sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: listening ? '#4caf50' : '#ff9800',
              animation: listening ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 0.6, transform: 'scale(1)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' },
                '100%': { opacity: 0.6, transform: 'scale(1)' }
              }
            }} />
            <Typography variant="caption" color="text.secondary">
              {listening ? 'Listening...' : status === 'processing' ? 'Processing...' : 'Ready'}
            </Typography>
          </Box>
          
          {/* Main area with siri animation */}
          <Box sx={{ width: '100%', position: 'relative', py: 2 }}>
            <Box sx={{ 
              width: '100%', 
              height: { xs: 120, sm: 150 }, // Responsive fixed height
              position: 'relative',
              mb: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Siri waveform */}
              {(status === 'listening' || status === 'greeting') && (
                <SiriWaveform 
                  isActive={listening} 
                  isDarkMode={isDarkMode}
                  size={isMobile ? 240 : 280}
                />
              )}
              
              {/* Loading animation - only shown when processing */}
              {(status === 'processing' || status === 'received') && (
                <Box sx={{ 
                  position: 'relative',
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
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
                    top: '15%',
                    left: '15%',
                    right: '15%',
                    bottom: '15%',
                    border: '2px solid transparent',
                    borderTopColor: 'secondary.main',
                    borderRadius: '50%',
                    animation: 'spin 1.5s linear infinite reverse',
                  }} />
                  
                  {/* Inner rotating circle */}
                  <Box sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '30%',
                    right: '30%',
                    bottom: '30%',
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
                    width: { xs: 10, sm: 12 },
                    height: { xs: 10, sm: 12 },
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
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                mb: 2
              }}
            >
              {assistantText}
            </Typography>
            
            {/* Mic toggle button - more prominent for mobile */}
            {status === 'listening' && (
              <IconButton
                onClick={handleToggleListen}
                size="large"
                sx={{
                  my: 2,
                  bgcolor: listening ? 'primary.main' : 'grey.300',
                  color: listening ? 'white' : 'text.primary',
                  p: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    bgcolor: listening ? 'primary.dark' : 'grey.400',
                  }
                }}
              >
                {listening ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
              </IconButton>
            )}
            
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
                    width: { xs: 6, sm: 8 },
                    height: { xs: 6, sm: 8 },
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
                  mt: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
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
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    fontWeight: 400,
                    maxWidth: '90%',
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