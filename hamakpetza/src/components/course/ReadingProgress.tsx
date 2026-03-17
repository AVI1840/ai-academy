'use client';

import { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const handler = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight;
      setPct(d <= 0 ? 100 : (window.scrollY / d) * 100);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler(); // set initial value
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-border pointer-events-none"
    >
      <div
        className="h-full bg-accent transition-[width] duration-150 will-change-transform"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
