export type WordState = 'new' | 'learning' | 'review' | 'mastered';
export type Category = 'core_academic' | 'ai_tech' | 'government_policy' | 'meeting_communication' | 'everyday';

export interface Word {
  id: string;
  english: string;
  hebrew: string;
  category: Category;
  interval: number; // days
  nextReview: string; // ISO date
  timesCorrect: number;
  state: WordState;
  example?: string;
}

export type AnswerQuality = 'didnt_know' | 'got_it' | 'easy';

export interface DailyStats {
  date: string;
  wordsStudied: number;
  correctAnswers: number;
}

export interface UserProgress {
  words: Word[];
  streak: number;
  lastStudyDate: string | null;
  dailyStats: DailyStats[];
  phraseLastShown: string | null; // ISO date
}
