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
    if (saved) {
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

  return (
    <div className="my-6 rounded-xl border border-secondary/20 bg-secondary-light/30 p-5">
      <div className="mb-1 text-xs font-heading font-semibold text-secondary">📝 שאלת בדיקה</div>
      <p className="font-heading font-semibold text-text mb-4">{question}</p>

      <div className="space-y-2 mb-4">
        {options.map((option, i) => {
          let style = 'border-border bg-bg text-text/80 hover:border-secondary/50';
          if (selected === i && !revealed) {
            style = 'border-secondary bg-secondary-light text-text';
          }
          if (revealed && i === correctIndex) {
            style = 'border-green-500 bg-green-50 text-green-800';
          }
          if (revealed && selected === i && i !== correctIndex) {
            style = 'border-red-400 bg-red-50 text-red-700';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className={`w-full text-right px-4 py-3 rounded-lg border text-sm transition-colors ${style}`}
              aria-label={`תשובה ${i + 1}: ${option}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={handleReveal}
          className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
        >
          חשוף תשובה →
        </button>
      )}

      {revealed && (
        <div className="mt-3 p-4 rounded-lg bg-bg border border-border text-sm text-text/80 leading-relaxed">
          <span className="font-semibold text-green-700">✓ תשובה נכונה: </span>
          {options[correctIndex]}
          <p className="mt-2 text-muted">{explanation}</p>
        </div>
      )}
    </div>
  );
}
