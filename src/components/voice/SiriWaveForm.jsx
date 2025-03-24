import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const SiriWaveform = ({ isActive, isDarkMode, size = 200 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioLevelsRef = useRef([]);
  
  // Enhanced Audio setup with higher sensitivity
  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        analyserRef.current = audioContextRef.current.createAnalyser();
        // Smaller FFT size for faster response
        analyserRef.current.fftSize = 128; 
        // Lower smoothing for more responsive movement
        analyserRef.current.smoothingTimeConstant = 0.5; // Even less smoothing for better responsiveness
        
        if (isActive) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: { 
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: false // Disable auto gain for better sensitivity
            } 
          });
          
          micStreamRef.current = stream;
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
        }
      } catch (error) {
        console.error('Audio setup failed:', error);
      }
    };
    
    if (isActive) {
      setupAudio();
      // Initialize audio levels array
      audioLevelsRef.current = Array(10).fill(0);
    }
    
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);
  
  // Enhanced animation with increased sensitivity
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    // Animation properties - increased wave count for more detail
    const waveCount = 5; // More waves for richer visualization
    const maxAmplitude = height / 3; // Larger max amplitude
    const frequency = 2.2; // Slightly higher frequency for more movement
    
    // Enhanced color palette
    const waveColors = isDarkMode 
      ? [
          'rgba(52, 152, 255, 0.7)', 
          'rgba(38, 128, 235, 0.6)', 
          'rgba(72, 158, 245, 0.5)',
          'rgba(85, 182, 255, 0.4)',
          'rgba(105, 195, 255, 0.3)'
        ]
      : [
          'rgba(0, 122, 255, 0.7)', 
          'rgba(10, 132, 255, 0.6)', 
          'rgba(50, 153, 230, 0.5)',
          'rgba(60, 173, 240, 0.4)',
          'rgba(80, 183, 245, 0.3)'
        ];
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // If active and we have analyzer, use real audio data with enhanced sensitivity
      if (isActive && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Use both time domain and frequency data for better sensitivity
        analyserRef.current.getByteTimeDomainData(dataArray);
        const freqArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(freqArray);
        
        // Calculate audio energy with enhanced sensitivity
        let sum = 0;
        let count = 0;
        
        // Focus more on the mid-range frequencies where voice is prominent
        // Skip the first few bins (often contain noise)
        const startBin = Math.floor(bufferLength * 0.1);
        const endBin = Math.floor(bufferLength * 0.9);
        
        for (let i = startBin; i < endBin; i++) {
          // Convert to -128 to 127 range and get absolute deviation from center
          const value = Math.abs(dataArray[i] - 128);
          
          // Also add frequency data for better sensitivity
          const freqValue = freqArray[i] / 255;
          
          // Combined value with higher weight for time domain data
          const combinedValue = (value / 128) * 0.7 + freqValue * 0.3;
          
          sum += combinedValue;
          count++;
        }
        
        // Calculate current frame energy (now on 0-1 scale)
        const instantEnergy = sum / count;
        
        // Add to history and maintain fixed length
        audioLevelsRef.current.push(instantEnergy);
        if (audioLevelsRef.current.length > 10) {
          audioLevelsRef.current.shift();
        }
        
        // Calculate energy with heightened response curve for low sounds
        const avgEnergy = audioLevelsRef.current.reduce((a, b) => a + b, 0) / 
                         audioLevelsRef.current.length;
        
        // Apply non-linear mapping to increase sensitivity to quiet sounds
        // Even more aggressive curve to boost lower levels
        const energyFactor = Math.pow(avgEnergy * 4 + 0.2, 0.7); 
        
        // Draw each wave with enhanced energy factor
        for (let w = 0; w < waveCount; w++) {
          drawSiriWave(w, energyFactor);
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
    
    // Enhanced wave drawing with more dynamic movement
    const drawSiriWave = (waveIndex, energyFactor) => {
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
        
        // Add harmonics for richer movement
        y += Math.sin(x * 0.02 * frequency + time * 1.5) * (amplitude * 0.15);
        y += Math.sin(x * 0.005 * frequency + time + offset * 2) * (amplitude * 0.3);
        
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
      
      // Add subtle color variation based on energy - FIX FOR THE ERROR
      let enhancedColor = color;
      
      if (energyFactor > 0.3) {
        // Extract color components safely
        const matches = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (matches && matches.length === 5) {
          const r = parseInt(matches[1], 10);
          const g = parseInt(matches[2], 10);
          const b = parseInt(matches[3], 10);
          const a = parseFloat(matches[4]);
          
          // Add intensity to color based on energy
          const boost = Math.floor(energyFactor * 15); 
          const newR = Math.min(255, r + boost);
          const newG = Math.min(255, g + boost);
          
          enhancedColor = `rgba(${newR}, ${newG}, ${b}, ${a})`;
        }
      }
      
      gradient.addColorStop(0, enhancedColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    };
    
    // Start animation
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, size, isDarkMode]);
  
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