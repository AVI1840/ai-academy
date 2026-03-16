'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setError(null);
    };
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      setError('לא ניתן לטעון את קובץ השמע');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || error) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {
        setError('לא ניתן להפעיל את השמע');
        setPlaying(false);
      });
      setPlaying(true);
    }
  }, [playing, error]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!src) return null;

  return (
    <div
      className="sticky top-0 z-20 bg-bg/95 backdrop-blur border-b border-border
                 px-4 py-2 flex items-center gap-3 text-sm"
      role="region"
      aria-label={`נגן שמע: ${title}`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={toggle}
        disabled={!!error}
        className="w-11 h-11 md:w-8 md:h-8 rounded-full bg-accent text-white
                   flex items-center justify-center hover:bg-accent/90
                   transition-colors flex-shrink-0 disabled:opacity-50
                   disabled:cursor-not-allowed
                   focus:outline-2 focus:outline-accent focus:outline-offset-2"
        aria-label={playing ? 'השהה' : 'נגן'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {error ? (
        <span className="text-red-600 text-xs font-heading flex-1 truncate" role="alert">
          {error}
        </span>
      ) : (
        <>
          <span className="text-muted text-xs flex-shrink-0 w-12 text-center tabular-nums">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={currentTime}
            onChange={seek}
            className="flex-1 h-1 accent-accent cursor-pointer"
            aria-label="מיקום בשמע"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} מתוך ${formatTime(duration)}`}
          />
          <span className="text-muted text-xs flex-shrink-0 w-12 text-center tabular-nums">
            {formatTime(duration)}
          </span>
        </>
      )}

      <span className="text-text/60 text-xs truncate max-w-[150px] hidden md:block font-heading">
        {title}
      </span>
    </div>
  );
}
