import { Word, AnswerQuality, UserProgress, DailyStats } from './types';
import { seedWords } from './seedData';

const STORAGE_KEY = 'englishos_progress';

export function loadProgress(): UserProgress {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed: UserProgress = JSON.parse(stored);
      // Merge any new words added to seedData that the user doesn't have yet
      const existingIds = new Set(parsed.words.map(w => w.id));
      const newWords = seedWords.filter(w => !existingIds.has(w.id));
      if (newWords.length > 0) {
        parsed.words = [...parsed.words, ...newWords];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // corrupted, reset
    }
  }
  return {
    words: [...seedWords],
    streak: 0,
    lastStudyDate: null,
    dailyStats: [],
    phraseLastShown: null,
  };
}

export function getMilestone(mastered: number): { label: string; emoji: string } | null {
  if (mastered >= 200) return { label: '200 מילים!', emoji: '🏆' };
  if (mastered >= 100) return { label: '100 מילים!', emoji: '💎' };
  if (mastered >= 50) return { label: '50 מילים!', emoji: '⭐' };
  if (mastered >= 25) return { label: '25 מילים!', emoji: '🔥' };
  if (mastered >= 10) return { label: '10 מילים!', emoji: '🎯' };
  if (mastered >= 1) return { label: 'מילה ראשונה!', emoji: '🌱' };
  return null;
}

export function isStreakAtRisk(lastStudyDate: string | null): boolean {
  if (!lastStudyDate) return false;
  const today = getToday();
  if (lastStudyDate === today) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return lastStudyDate === yesterday.toISOString().split('T')[0];
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = getToday();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (progress.lastStudyDate === today) return progress;
  if (progress.lastStudyDate === yesterdayStr) {
    return { ...progress, streak: progress.streak + 1, lastStudyDate: today };
  }
  return { ...progress, streak: 1, lastStudyDate: today };
}

export function getDailySession(words: Word[]): Word[] {
  const today = getToday();
  
  // Due review words
  const dueReview = words.filter(
    w => (w.state === 'review' || w.state === 'mastered' || w.state === 'learning') && w.nextReview <= today
  );
  
  // New words
  const newWords = words.filter(w => w.state === 'new');
  
  const reviewCount = Math.min(dueReview.length, 10);
  const newCount = Math.min(newWords.length, 5, 15 - reviewCount);
  
  return [
    ...dueReview.slice(0, reviewCount),
    ...newWords.slice(0, newCount),
  ];
}

export function getSessionEstimate(sessionWords: Word[]): number {
  // ~30 seconds per word
  return Math.max(1, Math.round((sessionWords.length * 30) / 60));
}

export function processAnswer(word: Word, quality: AnswerQuality): Word {
  const today = getToday();
  const updated = { ...word };

  switch (quality) {
    case 'didnt_know':
      updated.timesCorrect = 0;
      updated.interval = 0;
      updated.state = 'learning';
      updated.nextReview = today; // review again today
      break;

    case 'got_it':
      updated.timesCorrect = word.timesCorrect + 1;
      if (updated.timesCorrect >= 5) {
        updated.state = 'mastered';
        updated.interval = 30;
      } else if (updated.timesCorrect >= 2) {
        updated.state = 'review';
        updated.interval = 7;
      } else {
        updated.state = 'learning';
        updated.interval = 1;
      }
      break;

    case 'easy':
      updated.timesCorrect = word.timesCorrect + 2;
      if (updated.timesCorrect >= 5) {
        updated.state = 'mastered';
        updated.interval = 30;
      } else {
        updated.state = 'review';
        updated.interval = 7;
      }
      break;
  }

  const next = new Date();
  next.setDate(next.getDate() + updated.interval);
  updated.nextReview = next.toISOString().split('T')[0];

  return updated;
}

export function updateWordInProgress(progress: UserProgress, updatedWord: Word): UserProgress {
  return {
    ...progress,
    words: progress.words.map(w => w.id === updatedWord.id ? updatedWord : w),
  };
}

export function addDailyStat(progress: UserProgress, wordsStudied: number, correctAnswers: number): UserProgress {
  const today = getToday();
  const existing = progress.dailyStats.find(s => s.date === today);
  
  let stats: DailyStats[];
  if (existing) {
    stats = progress.dailyStats.map(s => 
      s.date === today 
        ? { ...s, wordsStudied: s.wordsStudied + wordsStudied, correctAnswers: s.correctAnswers + correctAnswers }
        : s
    );
  } else {
    stats = [...progress.dailyStats, { date: today, wordsStudied, correctAnswers }];
  }
  
  // Keep only last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  
  return { ...progress, dailyStats: stats.filter(s => s.date >= cutoffStr) };
}

export function getMasteredCount(words: Word[]): number {
  return words.filter(w => w.state === 'mastered').length;
}

export function getWordsDueTomorrow(words: Word[]): number {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  return words.filter(w => w.nextReview === tomorrowStr && w.state !== 'new').length;
}

export function shouldShowPhraseMode(phraseLastShown: string | null): boolean {
  if (!phraseLastShown) return true;
  const last = new Date(phraseLastShown);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 3; // roughly twice per week
}

export function getWeeklyStats(stats: DailyStats[]): { day: string; words: number }[] {
  const result: { day: string; words: number }[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const stat = stats.find(s => s.date === dateStr);
    result.push({
      day: days[d.getDay()],
      words: stat?.wordsStudied ?? 0,
    });
  }
  
  return result;
}
