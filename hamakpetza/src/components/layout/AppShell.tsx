'use client';

import React, { Component, useState, useEffect, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

// --- Error Boundary ---

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-bg flex items-center justify-center p-8"
          dir="rtl"
          role="alert"
        >
          <div className="max-w-md text-center">
            <h1 className="font-heading text-2xl font-bold text-text mb-4">
              משהו השתבש
            </h1>
            <p className="text-muted mb-6 font-body">
              אירעה שגיאה בלתי צפויה. נסו לרענן את הדף.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-accent text-white rounded-lg font-heading
                         font-semibold hover:bg-accent/90 transition-colors
                         min-w-[44px] min-h-[44px]"
            >
              רענון הדף
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- AppShell ---

interface AppShellProps {
  children: React.ReactNode;
  currentSlug?: string | null;
}

export default function AppShell({ children, currentSlug = null }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On first mount, default to open on desktop, closed on mobile
      setSidebarOpen(!mobile);
    };
    check();

    let wasMobile = window.innerWidth < 768;
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Reset sidebar state when crossing the 768px breakpoint
      if (wasMobile !== mobile) {
        setSidebarOpen(!mobile);
        wasMobile = mobile;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg relative">

        {/* Ambient Glow — blurred colour-mesh behind everything */}
        <div className="ambient-glow" aria-hidden="true">
          <div className="amb amb-1" />
          <div className="amb amb-2" />
          <div className="amb amb-3" />
          <div className="amb amb-4" />
          <div className="amb amb-5" />
          <div className="amb amb-6" />
          <div className="amb amb-7" />
          <div className="amb amb-8" />
          <div className="amb amb-9" />
          <div className="amb amb-10" />
          <div className="amb amb-11" />
          <div className="amb amb-12" />
        </div>

        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(prev => !prev)}
          currentSlug={currentSlug}
        />

        {/* Toggle buttons — shift left when sidebar is open on desktop */}
        <div className={`fixed top-4 z-50 flex items-center gap-2 transition-all duration-500 ${
          sidebarOpen && !isMobile ? 'right-[19rem]' : 'right-4'
        }`}>
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10
                       flex items-center justify-center text-muted hover:text-text hover:bg-white/10
                       transition-all duration-300 shadow-sm"
            aria-label={sidebarOpen ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-nav"
          >
            <span aria-hidden="true" className="text-sm">{sidebarOpen ? '✕' : '☰'}</span>
          </button>
          <ThemeToggle />
        </div>

        {/* Main content area */}
        <main
          id="main-content"
          className={`relative z-10 transition-all duration-500 min-h-screen ${
            sidebarOpen && !isMobile ? 'mr-72' : 'mr-0'
          }`}
        >
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
