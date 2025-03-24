const CHUNK_SIZE = 200;

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

export const cleanTextForSpeech = (markdownText) => {
  return markdownText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1')
    .replace(/[#*`_]/g, '')
    .trim();
};

export const speakText = (text, onEnd) => {
  // Detect language of text
  const detectedLang = detectLanguage(text);
  const langCode = LANGUAGE_VOICES[detectedLang] || 'en-IN';
  
  const chunks = splitIntoChunks(text);
  let currentChunkIndex = 0;

  const speakNextChunk = () => {
    if (currentChunkIndex < chunks.length) {
      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
      
      // Set language based on detected language
      utterance.lang = langCode;
      
      // Adjust rate and pitch for better multilingual performance
      utterance.rate = detectedLang === 'en' ? 0.9 : 0.85;
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
        currentChunkIndex++;
        if (currentChunkIndex < chunks.length) {
          speakNextChunk();
        } else {
          onEnd && onEnd();
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        onEnd && onEnd();
      };

      window.speechSynthesis.speak(utterance);
      return utterance;
    }
  };

  return speakNextChunk();
};

const splitIntoChunks = (text) => {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  words.forEach(word => {
    if (currentChunk.length + word.length > CHUNK_SIZE) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += word + ' ';
  });

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

// Initialize voices when this module is imported
export const initVoices = () => {
  const loadVoices = () => {
    window.speechSynthesis.getVoices();
  };
  
  loadVoices();
  
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  
  return () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = null;
    }
  };
};