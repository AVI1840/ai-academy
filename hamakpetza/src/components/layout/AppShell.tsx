'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
  currentSlug?: string | null;
}

export default function AppShell({ children, currentSlug = null }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentSlug={currentSlug}
      />

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-lg bg-bg border border-border
                   flex items-center justify-center text-muted hover:text-text hover:border-accent
                   transition-colors shadow-sm md:right-auto md:left-4"
        aria-label={sidebarOpen ? 'סגור תפריט' : 'פתח תפריט'}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'mr-72' : 'mr-0 md:mr-16'}`}
      >
        {children}
      </main>
    </div>
  );
}
