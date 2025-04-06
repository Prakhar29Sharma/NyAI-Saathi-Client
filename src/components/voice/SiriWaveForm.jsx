import React, { useEffect, useRef } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const SiriWaveform = ({ isActive, isDarkMode, size = 200, isAndroid = false }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioLevelsRef = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Enhanced Audio setup with higher sensitivity
  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (!audioContextRef.current) {
          try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          } catch (err) {
            console.error("Failed to create audio context:", err);
            return;
          }
        }
        
        try {
          analyserRef.current = audioContextRef.current.createAnalyser();
          // Much smaller FFT size for Android to improve performance and responsiveness
          analyserRef.current.fftSize = isAndroid ? 32 : (isMobile ? 64 : 128); 
          // Lower smoothing for improved responsiveness, especially on Android
          analyserRef.current.smoothingTimeConstant = isAndroid ? 0.3 : (isMobile ? 0.4 : 0.5);
        } catch (err) {
          console.error("Failed to create analyser:", err);
          return;
        }
        
        if (isActive) {
          try {
            // Reuse the existing global stream if available for Android
            // This helps maintain permissions and reduce permission prompts
            if (window.activeStream) {
              micStreamRef.current = window.activeStream;
              const source = audioContextRef.current.createMediaStreamSource(micStreamRef.current);
              source.connect(analyserRef.current);
              return;
            }
            
            // Fallback to getting a new stream
            // More aggressive settings for Android to help with voice detection
            const constraints = { 
              audio: { 
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                // Higher sample rate on Android to improve quality
                sampleRate: isAndroid ? 48000 : 44100,
                // Mono is more reliable on Android
                channelCount: isAndroid ? 1 : 2
              } 
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            micStreamRef.current = stream;
            // Store in global for reuse and to maintain permission
            window.activeStream = stream;
            
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
          } catch (err) {
            console.error('Failed to get audio stream:', err);
          }
        }
      } catch (error) {
        console.error('Audio setup failed:', error);
      }
    };
    
    if (isActive) {
      setupAudio();
      // Use fewer samples in the history buffer for Android to be more responsive to current input
      audioLevelsRef.current = Array(isAndroid ? 3 : (isMobile ? 6 : 10)).fill(0);
    }
    
    // Don't stop tracks here - they're maintained globally now
    return () => {
      if (analyserRef.current && micStreamRef.current) {
        // Just disconnect the analyser, don't stop the tracks
        try {
          const source = audioContextRef.current.createMediaStreamSource(micStreamRef.current);
          source.disconnect();
        } catch (err) {
          console.error("Error disconnecting audio source:", err);
        }
      }
    };
  }, [isActive, isMobile, isAndroid]);
  
  // Enhanced animation with increased sensitivity
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Animation properties - more extreme adjustments for Android
    const waveCount = isAndroid ? 2 : (isMobile ? 3 : 5); // Even fewer waves for Android
    const maxAmplitude = height / (isAndroid ? 3 : (isMobile ? 4 : 3)); // Larger amplitude on Android
    const frequency = isAndroid ? 1.6 : (isMobile ? 1.8 : 2.2); // Lower frequency for Android
    
    // Enhanced color palette
    const waveColors = isDarkMode 
      ? [
          'rgba(52, 152, 255, 0.8)', // More opaque for Android
          'rgba(38, 128, 235, 0.7)',
          'rgba(72, 158, 245, 0.6)',
          'rgba(85, 182, 255, 0.5)',
          'rgba(105, 195, 255, 0.4)'
        ]
      : [
          'rgba(0, 122, 255, 0.8)', // More opaque for Android
          'rgba(10, 132, 255, 0.7)',
          'rgba(50, 153, 230, 0.6)',
          'rgba(60, 173, 240, 0.5)',
          'rgba(80, 183, 245, 0.4)'
        ];
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // If active and we have analyzer, use real audio data with enhanced sensitivity
      if (isActive && analyserRef.current) {
        try {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          // Use both time domain and frequency data for better sensitivity
          analyserRef.current.getByteTimeDomainData(dataArray);
          const freqArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(freqArray);
          
          // Calculate audio energy with enhanced sensitivity
          let sum = 0;
          let count = 0;
          
          // For Android, focus on a narrower band of frequencies
          // Human voice is typically 85-255 Hz, so we focus there
          const startBin = Math.floor(bufferLength * (isAndroid ? 0.1 : (isMobile ? 0.05 : 0.1)));
          const endBin = Math.floor(bufferLength * (isAndroid ? 0.8 : (isMobile ? 0.95 : 0.9)));
          
          for (let i = startBin; i < endBin; i++) {
            // Convert to -128 to 127 range and get absolute deviation from center
            const value = Math.abs(dataArray[i] - 128);
            
            // Also add frequency data for better sensitivity
            const freqValue = freqArray[i] / 255;
            
            // Combined value with different weights for different devices
            // On Android, we give even higher weight to frequency data which is often more reliable
            const combinedValue = isAndroid ?
              (value / 128) * 0.6 + freqValue * 0.4 :
              isMobile ?
                (value / 128) * 0.8 + freqValue * 0.2 :
                (value / 128) * 0.7 + freqValue * 0.3;
            
            sum += combinedValue;
            count++;
          }
          
          // Calculate current frame energy (now on 0-1 scale)
          const instantEnergy = sum / count;
          
          // For Android, we apply a minimum threshold to reduce noise
          const adjustedEnergy = isAndroid ? 
            (instantEnergy < 0.05 ? 0 : instantEnergy) : instantEnergy;
          
          // Add to history and maintain fixed length
          audioLevelsRef.current.push(adjustedEnergy);
          while (audioLevelsRef.current.length > (isAndroid ? 3 : (isMobile ? 6 : 10))) {
            audioLevelsRef.current.shift();
          }
          
          // Calculate energy with heightened response curve for low sounds
          const avgEnergy = audioLevelsRef.current.reduce((a, b) => a + b, 0) / 
                          audioLevelsRef.current.length;
          
          // Apply special curve for Android to amplify even small sounds
          const energyFactor = isAndroid ? 
            Math.pow(avgEnergy * 8 + 0.4, 0.5) :  // Even more aggressive for Android
            isMobile ? 
              Math.pow(avgEnergy * 6 + 0.3, 0.6) :  // Aggressive for mobile
              Math.pow(avgEnergy * 4 + 0.2, 0.7);   // Original desktop curve
          
          // Draw each wave with enhanced energy factor
          for (let w = 0; w < waveCount; w++) {
            drawSiriWave(w, energyFactor);
          }
        } catch (err) {
          console.error("Error analyzing audio:", err);
          // Fall back to idle animation if there's an error
          const time = Date.now() * 0.001;
          const idleFactor = (Math.sin(time) * 0.15) + 0.25;
          
          for (let w = 0; w < waveCount; w++) {
            drawSiriWave(w, idleFactor);
          }
        }
      } else {
        // Idle animation with subtle movement
        const time = Date.now() * 0.001;
        const idleFactor = (Math.sin(time) * 0.15) + 0.25; // Gentle pulsing
        
        // Draw each wave
        for (let w = 0; w < waveCount; w++) {
          drawSiriWave(w, idleFactor);
        }
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Wave drawing function with improved error handling
    const drawSiriWave = (waveIndex, energyFactor) => {
      try {
        const time = Date.now() * 0.001;
        const wavePosition = waveIndex / waveCount;
        
        // Each wave gets different amplitude characteristics
        const amplitude = maxAmplitude * energyFactor * (1 - wavePosition * 0.15);
        // Variable phase offset for more natural look
        const offset = waveIndex * (Math.PI / 4) + (time * 0.1);
        
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        // Draw smooth curve with enhanced complexity
        for (let x = 0; x < width; x++) {
          // Create more complex wave pattern with multiple harmonics
          const xRatio = x / width;
          
          // Primary wave
          let y = Math.sin(x * 0.01 * frequency + time * 2 + offset) * amplitude;
          
          // Add harmonics for richer movement - simpler for Android
          if (!isAndroid) {
            y += Math.sin(x * 0.02 * frequency + time * 1.5) * (amplitude * 0.15);
            y += Math.sin(x * 0.005 * frequency + time + offset * 2) * (amplitude * 0.3);
          }
          
          // Add slight non-linear distortion based on energy for more dynamic look
          const distortion = 1 + energyFactor * 0.3;
          y *= (1 + Math.sin(xRatio * Math.PI) * 0.2) * distortion;
          
          ctx.lineTo(x, centerY + y);
        }
        
        // Complete the bottom part to create a closed shape
        ctx.lineTo(width, centerY);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Enhanced gradient with more vibrant coloration
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        const color = waveColors[waveIndex % waveColors.length];
        
        // Add subtle color variation based on energy
        let enhancedColor = color;
        
        if (energyFactor > 0.3) {
          // Extract color components safely
          const matches = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          if (matches && matches.length === 5) {
            const r = parseInt(matches[1], 10);
            const g = parseInt(matches[2], 10);
            const b = parseInt(matches[3], 10);
            const a = parseFloat(matches[4]);
            
            // Add intensity to color based on energy - more vibrant on Android
            const boost = Math.floor(energyFactor * (isAndroid ? 35 : (isMobile ? 25 : 15))); 
            const newR = Math.min(255, r + boost);
            const newG = Math.min(255, g + boost);
            
            enhancedColor = `rgba(${newR}, ${newG}, ${b}, ${a})`;
          }
        }
        
        gradient.addColorStop(0, enhancedColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      } catch (err) {
        console.error("Error drawing wave:", err);
      }
    };
    
    // Start animation
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, size, isDarkMode, isMobile, isAndroid]);
  
  return (
    <Box
      sx={{
        width: size,
        height: size / 2,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size / 2}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default SiriWaveform;