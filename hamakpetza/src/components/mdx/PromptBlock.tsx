'use client';

import { useState, useCallback } from 'react';

interface PromptBlockProps {
  children: string;
  title?: string;
}

export default function PromptBlock({ children, title }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      const el = document.getElementById('prompt-text');
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [children]);

  return (
    <div className="relative my-6 rounded-xl border border-accent/20 bg-accent-light/30 p-5">
      {title && (
        <div className="mb-3 text-xs font-heading font-semibold text-accent">
          💬 {title}
        </div>
      )}
      {!title && (
        <div className="mb-3 text-xs font-heading font-semibold text-accent">
          💬 פרומפט
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-3 left-3 px-3 py-1.5 rounded-md text-xs font-medium
                   bg-bg border border-border text-muted hover:text-accent hover:border-accent
                   transition-colors"
        aria-label="העתק פרומפט"
      >
        {copied ? '✓ הועתק' : 'העתק'}
      </button>
      <pre
        id="prompt-text"
        className="font-mono text-sm leading-relaxed text-text whitespace-pre-wrap break-words
                   overflow-x-auto max-w-full"
        dir="rtl"
      >
        {children}
      </pre>
    </div>
  );
}
