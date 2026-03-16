'use client';

import { useState, useEffect } from 'react';
import { loadProgress, saveQuizAnswer } from '@/lib/progress';

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  id: string;
}

export default function QuizQuestion({ question, options, correctIndex, explanation, id }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    const saved = progress.quizAnswers[id];
    if (saved !== undefined) {
      setSelected(saved.selectedIndex);
      setRevealed(saved.revealed);
    }
  }, [id]);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
    saveQuizAnswer(id, index, false);
  };

  const handleReveal = () => {
    setRevealed(true);
    if (selected !== null) {
      saveQuizAnswer(id, selected, true);
    }
  };

  const getOptionStyle = (index: number): string => {
    const base = 'w-full text-right px-4 py-3 min-h-[44px] rounded-lg border text-sm transition-colors';

    if (revealed) {
      if (index === correctIndex) {
        return `${base} border-green-600 bg-green-900/20 text-green-400 font-medium`;
      }
      if (selected === index && index !== correctIndex) {
        return `${base} border-red-600 bg-red-900/20 text-red-400`;
      }
      return `${base} border-border bg-bg text-muted`;
    }

    if (selected === index) {
      return `${base} border-accent bg-accent-light text-text ring-1 ring-accent/30`;
    }

    return `${base} border-border bg-bg text-text/80 hover:border-accent/50 hover:bg-accent-light/30 cursor-pointer`;
  };

  const getOptionIcon = (index: number): string | null => {
    if (!revealed) return null;
    if (index === correctIndex) return '✓';
    if (selected === index && index !== correctIndex) return '✗';
    return null;
  };

  return (
    <div
      className="my-6 rounded-xl border border-secondary/20 bg-secondary-light/30 p-5"
      role="region"
      aria-label={`שאלת בדיקה: ${question}`}
    >
      <div className="mb-1 text-xs font-heading font-semibold text-secondary" aria-hidden="true">
        📝 שאלת בדיקה
      </div>
      <p className="font-heading font-semibold text-text mb-4">{question}</p>

      <div className="space-y-2 mb-4" role="radiogroup" aria-label="אפשרויות תשובה">
        {options.map((option, i) => {
          const icon = getOptionIcon(i);
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={getOptionStyle(i)}
              role="radio"
              aria-checked={selected === i}
              aria-label={`תשובה ${i + 1}: ${option}`}
              aria-disabled={revealed}
            >
              <span className="flex items-center gap-2 justify-end">
                <span>{option}</span>
                {icon && (
                  <span
                    className={`flex-shrink-0 text-base font-bold ${
                      icon === '✓' ? 'text-green-400' : 'text-red-400'
                    }`}
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={handleReveal}
          disabled={selected === null}
          className={`min-h-[44px] px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            selected !== null
              ? 'text-accent hover:text-accent/80 hover:bg-accent-light/50 cursor-pointer'
              : 'text-muted cursor-not-allowed'
          }`}
          aria-label="חשוף תשובה"
        >
          חשוף תשובה →
        </button>
      )}

      {revealed && (
        <div
          className="mt-3 p-4 rounded-lg bg-bg border border-border text-sm text-text/80 leading-relaxed"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2 justify-end">
            <div>
              <span className="font-semibold text-green-400">✓ תשובה נכונה: </span>
              {options[correctIndex]}
            </div>
          </div>
          <p className="mt-2 text-muted">{explanation}</p>
        </div>
      )}
    </div>
  );
}
