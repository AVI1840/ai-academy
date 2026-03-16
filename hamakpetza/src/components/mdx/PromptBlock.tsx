'use client';

import { useState, useCallback, useRef, useId } from 'react';

interface PromptBlockProps {
  children: string;
  title?: string;
}

export default function PromptBlock({ children, title }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const uniqueId = useId();

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        selectFallback();
      }
    } catch {
      selectFallback();
    }
  }, [children]);

  const selectFallback = useCallback(() => {
    const el = preRef.current;
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, []);

  return (
    <div className="relative my-6 rounded-xl border border-accent/20 bg-accent-light/50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-heading font-semibold text-accent">
          {title || 'פרומפט'}
        </span>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-md text-xs font-medium
                     bg-bg border border-border text-muted hover:text-accent hover:border-accent
                     transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={copied ? 'הפרומפט הועתק' : 'העתק פרומפט ללוח'}
        >
          {copied ? '✓ הועתק' : 'העתק'}
        </button>
      </div>
      <pre
        ref={preRef}
        id={uniqueId}
        className="font-mono text-sm leading-relaxed text-text
                   whitespace-pre overflow-x-auto
                   sm:whitespace-pre-wrap sm:break-words
                   max-w-full"
        dir="auto"
      >
        {children}
      </pre>
    </div>
  );
}
