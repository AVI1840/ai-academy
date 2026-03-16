'use client';

import React, { Component, useState, useEffect, type ReactNode } from 'react';
import Sidebar from './Sidebar';

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
      <div className="min-h-screen bg-bg">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(prev => !prev)}
          currentSlug={currentSlug}
        />

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="fixed top-4 right-4 z-50 w-11 h-11 rounded-lg bg-bg border border-border
                     flex items-center justify-center text-muted hover:text-text hover:border-accent
                     transition-colors shadow-sm md:right-auto md:left-4"
          aria-label={sidebarOpen ? 'סגור תפריט' : 'פתח תפריט'}
          aria-expanded={sidebarOpen}
          aria-controls="sidebar-nav"
        >
          <span aria-hidden="true">{sidebarOpen ? '✕' : '☰'}</span>
        </button>

        {/* Main content area — children apply reading-column (max-w-3xl) */}
        <main
          id="main-content"
          className={`transition-all duration-300 ${
            sidebarOpen && !isMobile ? 'mr-72' : 'mr-0 md:mr-16'
          }`}
        >
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
