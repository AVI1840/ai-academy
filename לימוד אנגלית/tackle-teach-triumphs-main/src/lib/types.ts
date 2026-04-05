export interface User {
  id: string;
  name: string;
  avatar_emoji: string;
  total_points: number;
  golden_boots: number;
  current_season: number;
  current_round: number;
  streak_days: number;
  last_activity_date: string | null;
}

export interface Lesson {
  id: string;
  season: number;
  round: number;
  order_in_round: number;
  type: 'letters' | 'words' | 'quiz' | 'conversation' | 'spelling' | 'sentence_builder' | 'listening' | 'picture_match';
  topic_tag: string;
  title_he: string;
  content: LessonContent;
  xp_reward: number;
  boots_reward: number;
}

export interface LetterItem {
  letter: string;
  word: string;
  emoji: string;
  pronunciation: string;
}

export interface WordItem {
  english: string;
  hebrew: string;
  emoji: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  emoji: string;
  explanation_he?: string;
}

export interface DialogueLine {
  speaker: 'coach' | 'child';
  text?: string;
  hebrew: string;
  emoji?: string;
  options?: string[];
  correct?: number;
}

export interface SpellingItem {
  word: string;
  hebrew: string;
  hint: string;
  emoji: string;
}

export interface SentenceBuilderItem {
  sentence: string;
  hebrew: string;
  words: string[];
  emoji: string;
}

export interface ListeningItem {
  text: string;
  hebrew: string;
  options: string[];
  correct: number;
  emoji: string;
}

export interface PictureMatchItem {
  word: string;
  hebrew: string;
  emoji: string;
}

export interface LessonContent {
  items?: LetterItem[];
  words?: WordItem[];
  questions?: QuizQuestion[];
  dialogue?: DialogueLine[];
  spelling_items?: SpellingItem[];
  sentence_items?: SentenceBuilderItem[];
  listening_items?: ListeningItem[];
  picture_items?: PictureMatchItem[];
  activity?: string;
  timer_seconds?: number;
  speed_bonus?: boolean;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  completed: boolean;
  attempts: number;
  completed_at: string | null;
}

export interface Achievement {
  id: string;
  key: string;
  title_he: string;
  description_he: string;
  icon_emoji: string;
  condition_type: string;
  condition_value: number;
}

export interface WordMemory {
  id: string;
  user_id: string;
  word: string;
  hebrew: string;
  emoji: string;
  mastery_level: number;
  next_review_date: string;
}
