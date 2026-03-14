'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!src) return null;

  return (
    <div
      className="sticky top-0 z-20 bg-bg/95 backdrop-blur border-b border-border px-4 py-2
                 flex items-center gap-3 text-sm"
      role="region"
      aria-label={`נגן שמע: ${title}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center
                   hover:bg-accent/90 transition-colors flex-shrink-0"
        aria-label={playing ? 'השהה' : 'נגן'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <span className="text-muted text-xs flex-shrink-0 w-10 text-center">{fmt(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={seek}
        className="flex-1 h-1 accent-accent"
        aria-label="מיקום בשמע"
      />
      <span className="text-muted text-xs flex-shrink-0 w-10 text-center">{fmt(duration)}</span>
      <span className="text-text/60 text-xs truncate max-w-[120px] hidden md:block">{title}</span>
    </div>
  );
}
