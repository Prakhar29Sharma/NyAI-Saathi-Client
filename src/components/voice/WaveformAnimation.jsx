import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const WaveformAnimation = ({ isActive, isDarkMode, size = 120 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  
  // Set up audio analyzer when component mounts
  useEffect(() => {
    let audioContext;
    
    const setupAudioAnalyzer = async () => {
      try {
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Get microphone stream if active
        if (isActive) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;
          
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          
          // Start animation
          startAnimation();
        }
      } catch (error) {
        console.error('Audio analyzer setup failed:', error);
      }
    };
    
    if (isActive) {
      setupAudioAnalyzer();
    }
    
    return () => {
      // Clean up
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive]);
  
  // Animation function
  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    // Animation loop
    const animate = () => {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isActive) {
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Draw each bar
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2;
          
          // Use dynamic color based on frequency
          const hue = i * 3 % 360;
          ctx.fillStyle = isDarkMode 
            ? `hsla(${hue}, 80%, 60%, 0.8)`
            : `hsla(${hue}, 70%, 50%, 0.8)`;
            
          // Draw centered bar (like equalizer)
          ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
          
          x += barWidth + 1;
        }
      } else {
        // Draw default idle state
        const centerY = canvas.height / 2;
        const amplitude = 10;
        const frequency = 0.05;
        const defaultBars = 30;
        
        for (let i = 0; i < defaultBars; i++) {
          const x = i * (canvas.width / defaultBars);
          // Generate smooth sine wave when idle
          barHeight = Math.sin(Date.now() * 0.002 + i * frequency) * amplitude + 15;
          
          ctx.fillStyle = isDarkMode 
            ? 'rgba(90, 120, 255, 0.6)' 
            : 'rgba(66, 99, 235, 0.5)';
            
          ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };
  
  // Handle inactive state with gentle wave animation
  useEffect(() => {
    if (!isActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const drawIdleWave = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerY = canvas.height / 2;
        const bars = 30;
        const barWidth = (canvas.width / bars) - 1;
        
        for (let i = 0; i < bars; i++) {
          // Create gentle wave effect
          const time = Date.now() * 0.001;
          const amplitude = 8;
          const frequency = 0.15;
          const phase = i * frequency;
          
          // Different waves with phase offsets
          const h1 = Math.sin(time + phase) * amplitude + 10;
          const h2 = Math.sin(time * 0.8 + phase * 1.2) * amplitude * 0.6 + 8;
          
          // Combine waves
          const height = Math.abs(h1 + h2);
          
          ctx.fillStyle = isDarkMode 
            ? 'rgba(90, 120, 255, 0.5)' 
            : 'rgba(66, 99, 235, 0.4)';
            
          ctx.fillRect(i * (barWidth + 1), centerY - height / 2, barWidth, height);
        }
        
        animationRef.current = requestAnimationFrame(drawIdleWave);
      };
      
      drawIdleWave();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isActive, isDarkMode]);
  
  return (
    <Box sx={{ 
      width: size,
      height: size * 0.5,
      borderRadius: 2,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size * 0.5}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </Box>
  );
};

export default WaveformAnimation;