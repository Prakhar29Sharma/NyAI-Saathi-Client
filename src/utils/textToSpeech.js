export const cleanTextForSpeech = (markdownText) => {
    return markdownText
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1') // Convert links to text
      .replace(/[#*`_]/g, '') // Remove markdown symbols
      .trim();
  };
  
  export const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };
  
  export const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };