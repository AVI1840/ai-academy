import { ProgressState } from '@/types';
import { COURSE_CATALOG } from '@/data/course-catalog';

const STORAGE_KEY = 'hamakpetza_progress';

function defaultProgress(): ProgressState {
  return {
    version: 1,
    completedModules: [],
    quizAnswers: {},
    lastVisited: null,
    updatedAt: new Date().toISOString(),
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) return parsed as ProgressState;
    return defaultProgress();
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — silently fail
  }
}

export function markModuleComplete(courseNumber: number): ProgressState {
  const state = loadProgress();
  if (!state.completedModules.includes(courseNumber)) {
    state.completedModules.push(courseNumber);
  }
  saveProgress(state);
  return state;
}

export function markModuleIncomplete(courseNumber: number): ProgressState {
  const state = loadProgress();
  state.completedModules = state.completedModules.filter(n => n !== courseNumber);
  saveProgress(state);
  return state;
}

export function saveQuizAnswer(
  quizId: string,
  selectedIndex: number,
  revealed: boolean
): ProgressState {
  const state = loadProgress();
  state.quizAnswers[quizId] = { selectedIndex, revealed };
  saveProgress(state);
  return state;
}

export function setLastVisited(slug: string): void {
  const state = loadProgress();
  state.lastVisited = slug;
  saveProgress(state);
}

export function getCompletionPercentage(): number {
  const state = loadProgress();
  return Math.round((state.completedModules.length / COURSE_CATALOG.length) * 100);
}

export function getDomainProgress(courseNumbers: number[]): { completed: number; total: number } {
  const state = loadProgress();
  const completed = courseNumbers.filter(n => state.completedModules.includes(n)).length;
  return { completed, total: courseNumbers.length };
}
