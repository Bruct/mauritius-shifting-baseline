'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export function AudioPlayer({ src, className }: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<unknown>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let ws: unknown;

    async function initWavesurfer() {
      if (!containerRef.current) return;
      const WaveSurfer = (await import('wavesurfer.js')).default;
      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#1E8FA0',
        progressColor: '#0A2342',
        cursorColor: '#3BBFBF',
        barWidth: 2,
        barRadius: 3,
        height: 48,
        normalize: true,
        url: src,
      });

      (ws as any).on('ready', (dur: number) => {
        setDuration(dur);
        setReady(true);
      });
      (ws as any).on('timeupdate', (time: number) => setCurrentTime(time));
      (ws as any).on('finish', () => setPlaying(false));

      wavesurferRef.current = ws;
    }

    initWavesurfer();

    return () => {
      (ws as any)?.destroy();
    };
  }, [src]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    (wavesurferRef.current as any).playPause();
    setPlaying(!playing);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 p-3 bg-ocean-50 rounded-xl border border-ocean-100 ${className}`}>
      <button
        onClick={togglePlay}
        disabled={!ready}
        className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-ocean-500 hover:bg-ocean-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div ref={containerRef} className="waveform-container" />
        {!ready && (
          <div className="h-12 skeleton rounded-lg" />
        )}
      </div>

      <div className="flex-shrink-0 flex items-center gap-1 text-xs text-ocean-500 font-mono">
        <Volume2 className="h-3 w-3" />
        <span>{formatTime(currentTime)}</span>
        <span className="text-ocean-300">/</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
