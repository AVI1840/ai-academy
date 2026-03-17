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
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface" dir="rtl">
        <span className="text-sm font-heading text-muted">מצב תצוגה:</span>
        <button
          onClick={() => { if (theme !== 'dark') toggle(); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-heading transition-all ${
            theme === 'dark'
              ? 'bg-accent text-white'
              : 'bg-transparent text-muted hover:text-text'
          }`}
        >
          🌙 כהה
        </button>
        <button
          onClick={() => { if (theme !== 'light') toggle(); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-heading transition-all ${
            theme === 'light'
              ? 'bg-accent text-white'
              : 'bg-transparent text-muted hover:text-text'
          }`}
        >
          ☀️ בהיר
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      className="w-11 h-11 rounded-lg bg-surface border border-border flex items-center justify-center
                 text-muted hover:text-text hover:border-accent transition-colors shadow-sm"
      aria-label={theme === 'dark' ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
      title={theme === 'dark' ? 'מצב בהיר' : 'מצב כהה'}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
}
