const CHUNK_SIZE = 200;

export const cleanTextForSpeech = (markdownText) => {
  return markdownText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1')
    .replace(/[#*`_]/g, '')
    .trim();
};

export const speakText = (text, onEnd) => {
  const chunks = splitIntoChunks(text);
  let currentChunkIndex = 0;

  const speakNextChunk = () => {
    if (currentChunkIndex < chunks.length) {
      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;

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