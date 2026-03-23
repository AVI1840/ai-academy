'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hamakpetza_theme';

export default function ThemeToggle({ variant = 'icon' }: { variant?: 'icon' | 'full' }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  if (variant === 'full') {
    return (
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm" dir="rtl">
        <button
          onClick={() => { if (theme !== 'dark') toggle(); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-white/10 text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
              : 'text-muted hover:text-text'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
          כהה
        </button>
        <button
          onClick={() => { if (theme !== 'light') toggle(); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading transition-all duration-300 ${
            theme === 'light'
              ? 'bg-white/10 text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
              : 'text-muted hover:text-text'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          בהיר
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10
                 flex items-center justify-center text-muted hover:text-text hover:bg-white/10
                 transition-all duration-300 hover:rotate-12 hover:scale-110 shadow-sm"
      aria-label={theme === 'dark' ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
      title={theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
    >
      {theme === 'dark' ? (
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  );
}
