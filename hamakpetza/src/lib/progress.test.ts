import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadProgress,
  saveProgress,
  markModuleComplete,
  markModuleIncomplete,
  saveQuizAnswer,
  setLastVisited,
  getCompletionPercentage,
  getDomainProgress,
} from './progress';
import type { ProgressState } from '@/types';

const STORAGE_KEY = 'hamakpetza_progress';

describe('progress API', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadProgress', () => {
    it('returns default state when localStorage is empty', () => {
      const state = loadProgress();
      expect(state.version).toBe(1);
      expect(state.completedModules).toEqual([]);
      expect(state.quizAnswers).toEqual({});
      expect(state.lastVisited).toBeNull();
      expect(state.updatedAt).toBeTruthy();
    });

    it('returns saved state from localStorage', () => {
      const saved: ProgressState = {
        version: 1,
        completedModules: [1, 3],
        quizAnswers: { 'q1': { selectedIndex: 2, revealed: true } },
        lastVisited: 'ai-literacy',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadProgress();
      expect(state.completedModules).toEqual([1, 3]);
      expect(state.quizAnswers['q1']).toEqual({ selectedIndex: 2, revealed: true });
      expect(state.lastVisited).toBe('ai-literacy');
    });

    it('resets to default on corrupt JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');
      const state = loadProgress();
      expect(state.version).toBe(1);
      expect(state.completedModules).toEqual([]);
    });

    it('resets to default on version mismatch', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, completedModules: [1] }));
      const state = loadProgress();
      expect(state.completedModules).toEqual([]);
    });

    it('resets to default when stored value is null-ish', () => {
      localStorage.setItem(STORAGE_KEY, 'null');
      const state = loadProgress();
      expect(state.version).toBe(1);
      expect(state.completedModules).toEqual([]);
    });
  });

  describe('saveProgress', () => {
    it('writes state to localStorage', () => {
      const state: ProgressState = {
        version: 1,
        completedModules: [2, 5],
        quizAnswers: {},
        lastVisited: null,
        updatedAt: '',
      };
      saveProgress(state);

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.completedModules).toEqual([2, 5]);
      expect(parsed.updatedAt).toBeTruthy();
    });

    it('updates the updatedAt timestamp', () => {
      const state: ProgressState = {
        version: 1,
        completedModules: [],
        quizAnswers: {},
        lastVisited: null,
        updatedAt: '2020-01-01T00:00:00.000Z',
      };
      saveProgress(state);

      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw!);
      expect(parsed.updatedAt).not.toBe('2020-01-01T00:00:00.000Z');
    });
  });

  describe('markModuleComplete', () => {
    it('adds course number to completedModules', () => {
      const state = markModuleComplete(3);
      expect(state.completedModules).toContain(3);
    });

    it('does not duplicate already-completed modules', () => {
      markModuleComplete(5);
      const state = markModuleComplete(5);
      expect(state.completedModules.filter(n => n === 5)).toHaveLength(1);
    });

    it('persists to localStorage', () => {
      markModuleComplete(7);
      const loaded = loadProgress();
      expect(loaded.completedModules).toContain(7);
    });
  });

  describe('markModuleIncomplete', () => {
    it('removes course number from completedModules', () => {
      markModuleComplete(4);
      const state = markModuleIncomplete(4);
      expect(state.completedModules).not.toContain(4);
    });
  });

  describe('saveQuizAnswer', () => {
    it('saves quiz answer state', () => {
      const state = saveQuizAnswer('quiz-1', 2, true);
      expect(state.quizAnswers['quiz-1']).toEqual({ selectedIndex: 2, revealed: true });
    });

    it('persists quiz answer to localStorage', () => {
      saveQuizAnswer('quiz-2', 0, false);
      const loaded = loadProgress();
      expect(loaded.quizAnswers['quiz-2']).toEqual({ selectedIndex: 0, revealed: false });
    });

    it('overwrites previous answer for same quiz', () => {
      saveQuizAnswer('quiz-3', 1, false);
      const state = saveQuizAnswer('quiz-3', 2, true);
      expect(state.quizAnswers['quiz-3']).toEqual({ selectedIndex: 2, revealed: true });
    });
  });

  describe('setLastVisited', () => {
    it('saves last visited slug', () => {
      setLastVisited('prompt-engineering');
      const loaded = loadProgress();
      expect(loaded.lastVisited).toBe('prompt-engineering');
    });
  });

  describe('getCompletionPercentage', () => {
    it('returns 0 when no modules completed', () => {
      expect(getCompletionPercentage()).toBe(0);
    });

    it('calculates correct percentage', () => {
      markModuleComplete(1);
      markModuleComplete(2);
      markModuleComplete(3);
      // 3/16 * 100 = 18.75 → 19
      expect(getCompletionPercentage()).toBe(19);
    });

    it('returns 100 when all 16 modules completed', () => {
      for (let i = 1; i <= 16; i++) markModuleComplete(i);
      expect(getCompletionPercentage()).toBe(100);
    });
  });

  describe('getDomainProgress', () => {
    it('returns correct completed count for a domain', () => {
      markModuleComplete(1);
      markModuleComplete(2);
      const result = getDomainProgress([1, 2]);
      expect(result).toEqual({ completed: 2, total: 2 });
    });

    it('returns 0 completed when none match', () => {
      markModuleComplete(1);
      const result = getDomainProgress([5, 6]);
      expect(result).toEqual({ completed: 0, total: 2 });
    });
  });

  describe('no PII stored (Req 12.2)', () => {
    it('stored data contains only course numbers, quiz IDs, and timestamps', () => {
      markModuleComplete(1);
      saveQuizAnswer('q1', 0, true);
      setLastVisited('ai-literacy');

      const raw = localStorage.getItem(STORAGE_KEY)!;
      // No email patterns
      expect(raw).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      // No Israeli ID patterns (9 consecutive digits)
      expect(raw).not.toMatch(/\b\d{9}\b/);
      // No phone patterns
      expect(raw).not.toMatch(/0[2-9]\d{7,8}/);
    });
  });
});
