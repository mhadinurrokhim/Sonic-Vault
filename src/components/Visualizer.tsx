'use client';

import { useEffect, useRef } from 'react';

interface VisualizerProps {
  getAnalyserData: () => Uint8Array;
  isPlaying: boolean;
}

export function Visualizer({ getAnalyserData, isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const data = getAnalyserData();
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (!isPlaying || data.length === 0) {
        // Draw idle bars
        const barCount = 32;
        const barWidth = width / barCount - 2;
        for (let i = 0; i < barCount; i++) {
          const barHeight = 4;
          const x = i * (barWidth + 2);
          const y = height - barHeight;
          
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#C9A227');
          gradient.addColorStop(0.5, '#FF6B35');
          gradient.addColorStop(1, '#E63946');
          
          ctx.fillStyle = 'rgba(201, 162, 39, 0.3)';
          ctx.fillRect(x, y, barWidth, barHeight);
        }
        
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const barCount = Math.min(data.length, 32);
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const value = data[i];
        const barHeight = Math.max(4, (value / 255) * height * 0.9);
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#C9A227');
        gradient.addColorStop(0.5, '#FF6B35');
        gradient.addColorStop(1, '#E63946');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Add glow effect
        ctx.shadowColor = '#C9A227';
        ctx.shadowBlur = 10;
      }

      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getAnalyserData, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      className="visualizer-canvas"
      width={400}
      height={120}
    />
  );
}
