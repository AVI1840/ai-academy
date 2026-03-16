import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from './QuizQuestion';

const STORAGE_KEY = 'hamakpetza_progress';

const defaultProps = {
  question: 'מהו מודל שפה גדול?',
  options: ['מנוע חיפוש', 'רשת נוירונים', 'מסד נתונים', 'מערכת הפעלה'],
  correctIndex: 1,
  explanation: 'מודל שפה גדול הוא רשת נוירונים שאומנה על טקסט רב.',
  id: 'quiz-test-1',
};

describe('QuizQuestion', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the question text', () => {
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.getByText(defaultProps.question)).toBeTruthy();
  });

  it('renders all answer options', () => {
    render(<QuizQuestion {...defaultProps} />);
    defaultProps.options.forEach((option) => {
      expect(screen.getByText(option)).toBeTruthy();
    });
  });

  it('renders the reveal button', () => {
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.getByText('חשוף תשובה →')).toBeTruthy();
  });

  it('does not show explanation before reveal', () => {
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.queryByText(defaultProps.explanation)).toBeNull();
  });

  it('highlights selected option with accent styling', () => {
    render(<QuizQuestion {...defaultProps} />);
    const option = screen.getByRole('radio', { name: /תשובה 1/ });
    fireEvent.click(option);
    expect(option.className).toContain('border-accent');
  });

  it('shows correct indication (green) on reveal for correct answer', () => {
    render(<QuizQuestion {...defaultProps} />);
    // Select the correct answer
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 2/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    const correctOption = screen.getByRole('radio', { name: /תשובה 2/ });
    expect(correctOption.className).toContain('border-green-600');
  });

  it('shows incorrect indication (red) on reveal for wrong answer', () => {
    render(<QuizQuestion {...defaultProps} />);
    // Select a wrong answer
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 1/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    const wrongOption = screen.getByRole('radio', { name: /תשובה 1/ });
    expect(wrongOption.className).toContain('border-red-600');
  });

  it('shows explanation after reveal', () => {
    render(<QuizQuestion {...defaultProps} />);
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 2/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    expect(screen.getByText(defaultProps.explanation)).toBeTruthy();
  });

  it('hides reveal button after reveal', () => {
    render(<QuizQuestion {...defaultProps} />);
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 2/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    expect(screen.queryByText('חשוף תשובה →')).toBeNull();
  });

  it('disables option buttons after reveal', () => {
    render(<QuizQuestion {...defaultProps} />);
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 2/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    const option = screen.getByRole('radio', { name: /תשובה 1/ }) as HTMLButtonElement;
    expect(option.disabled).toBe(true);
  });

  it('saves answer to localStorage on selection', () => {
    render(<QuizQuestion {...defaultProps} />);
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 3/ }));

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.quizAnswers[defaultProps.id]).toEqual({
      selectedIndex: 2,
      revealed: false,
    });
  });

  it('saves revealed state to localStorage on reveal', () => {
    render(<QuizQuestion {...defaultProps} />);
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 2/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw!);
    expect(parsed.quizAnswers[defaultProps.id]).toEqual({
      selectedIndex: 1,
      revealed: true,
    });
  });

  it('restores saved state from localStorage', () => {
    // Pre-populate localStorage with a saved answer
    const saved = {
      version: 1,
      completedModules: [],
      quizAnswers: {
        [defaultProps.id]: { selectedIndex: 1, revealed: true },
      },
      lastVisited: null,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    render(<QuizQuestion {...defaultProps} />);

    // Should show explanation (revealed state restored)
    expect(screen.getByText(defaultProps.explanation)).toBeTruthy();
    // Correct answer should have green styling
    const correctOption = screen.getByRole('radio', { name: /תשובה 2/ });
    expect(correctOption.className).toContain('border-green-600');
  });

  it('has ARIA radiogroup role on options container', () => {
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.getByRole('radiogroup')).toBeTruthy();
  });

  it('has ARIA region role with question label', () => {
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.getByRole('region', { name: /שאלת בדיקה/ })).toBeTruthy();
  });

  it('options have aria-checked reflecting selection', () => {
    render(<QuizQuestion {...defaultProps} />);
    const option = screen.getByRole('radio', { name: /תשובה 1/ });
    expect(option.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(option);
    expect(option.getAttribute('aria-checked')).toBe('true');
  });

  it('shows correct answer text in explanation panel', () => {
    render(<QuizQuestion {...defaultProps} />);
    fireEvent.click(screen.getByRole('radio', { name: /תשובה 2/ }));
    fireEvent.click(screen.getByText('חשוף תשובה →'));

    expect(screen.getByText('✓ תשובה נכונה:')).toBeTruthy();
  });
});
