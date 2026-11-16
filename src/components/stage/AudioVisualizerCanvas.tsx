import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';

interface AudioVisualizerCanvasProps {
  mode?: 'compact' | 'studio';
  className?: string;
}

export const AudioVisualizerCanvas: React.FC<AudioVisualizerCanvasProps> = ({ 
  mode = 'studio',
  className = ''
}) => {
  const { analyserNode, isMicOn } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peakLevelsRef = useRef<number[]>(new Array(32).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const isCompact = mode === 'compact';
    const numBars = isCompact ? 24 : 32;

    const freqData = new Uint8Array(analyserNode ? analyserNode.frequencyBinCount : 128);
    const timeData = new Uint8Array(analyserNode ? analyserNode.fftSize : 256);

    const render = () => {
      animId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      let rms = 0;

      if (isMicOn && analyserNode) {
        analyserNode.getByteFrequencyData(freqData);
        analyserNode.getByteTimeDomainData(timeData);

        // Calculate RMS Level
        let sumSquares = 0;
        for (let i = 0; i < timeData.length; i++) {
          const norm = (timeData[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        rms = Math.sqrt(sumSquares / timeData.length);
      } else {
        // Fluid idle wave simulation
        const t = performance.now() * 0.003;
        for (let i = 0; i < numBars; i++) {
          const wave = Math.sin(t + i * 0.25) * 0.3 + 0.3;
          freqData[i] = Math.floor(wave * 140);
        }
        rms = 0.04 + Math.sin(t) * 0.02;
      }

      // Calculate dBFS (-60 dB to 0 dB)
      const db = rms > 0.001 ? Math.max(-60, 20 * Math.log10(rms)) : -60;
      const isClipping = db > -0.5;

      if (isCompact) {
        // --- COMPACT MODE (VoicePod) ---
        const barWidth = width / numBars;
        for (let i = 0; i < numBars; i++) {
          const val = freqData[i] || 0;
          const barHeight = Math.max(2, (val / 255) * (height - 2));

          ctx.fillStyle = isMicOn ? '#FFFFFF' : '#404040';
          ctx.fillRect(
            i * barWidth + 1,
            height - barHeight,
            Math.max(1, barWidth - 1.5),
            barHeight
          );
        }
      } else {
        // --- STUDIO MODE (Modal & Stage) ---
        const spectrumHeight = height - 26; // Reserve bottom 26px for VU meter
        const barWidth = width / numBars;

        // 1. Draw 32 Frequency Bars
        for (let i = 0; i < numBars; i++) {
          const val = freqData[i] || 0;
          const barHeight = (val / 255) * spectrumHeight;

          // Peak decay
          if (barHeight > peakLevelsRef.current[i]) {
            peakLevelsRef.current[i] = barHeight;
          } else {
            peakLevelsRef.current[i] = Math.max(0, peakLevelsRef.current[i] - 0.8);
          }

          // Main Bar (Monochrome Gradient: dark base to bright top)
          const grad = ctx.createLinearGradient(0, spectrumHeight, 0, spectrumHeight - barHeight);
          grad.addColorStop(0, '#262626');
          grad.addColorStop(1, '#FFFFFF');

          ctx.fillStyle = isMicOn ? grad : '#222222';
          ctx.fillRect(
            i * barWidth + 1,
            spectrumHeight - barHeight,
            Math.max(1, barWidth - 2),
            barHeight
          );

          // Peak hold line
          ctx.fillStyle = isMicOn ? '#FFFFFF' : '#555555';
          ctx.fillRect(
            i * barWidth + 1,
            spectrumHeight - peakLevelsRef.current[i],
            Math.max(1, barWidth - 2),
            1
          );
        }

        // 2. Horizontal Divider Line
        ctx.fillStyle = '#262626';
        ctx.fillRect(0, spectrumHeight + 2, width, 1);

        // 3. True RMS dB VU Level Meter
        const vuY = spectrumHeight + 7;
        const vuHeight = 12;
        const normalizedDb = Math.max(0, Math.min(1, (db + 60) / 60)); // 0.0 at -60dB, 1.0 at 0dB
        const meterWidth = width - 110;

        // Background Track
        ctx.fillStyle = '#141414';
        ctx.fillRect(0, vuY, meterWidth, vuHeight);

        // Active Level Bar
        ctx.fillStyle = isClipping ? '#FFFFFF' : '#A3A3A3';
        ctx.fillRect(0, vuY, meterWidth * normalizedDb, vuHeight);

        // Peak Target Marks (-12 dB and -3 dB)
        ctx.fillStyle = '#404040';
        ctx.fillRect(meterWidth * (48 / 60), vuY, 1, vuHeight); // -12 dB
        ctx.fillRect(meterWidth * (57 / 60), vuY, 1, vuHeight); // -3 dB

        // Digital dB Readout Text
        ctx.fillStyle = isClipping ? '#FFFFFF' : '#A3A3A3';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(
          `${db > -60 ? db.toFixed(1) : '-INF'} dBFS`,
          width - 15,
          vuY + 10
        );

        // Clip Warning Pill
        if (isClipping) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(width - 10, vuY + 2, 8, 8);
        } else {
          ctx.fillStyle = '#262626';
          ctx.fillRect(width - 10, vuY + 2, 8, 8);
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [analyserNode, isMicOn, mode]);

  return (
    <div className={`relative bg-[#000000] border border-[#262626] overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={mode === 'compact' ? 220 : 480}
        height={mode === 'compact' ? 24 : 110}
        className="w-full h-full block"
      />
    </div>
  );
};
