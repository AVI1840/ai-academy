import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Timer, Clock } from 'lucide-react';
import type { Lesson, User } from '@/lib/types';
import LetterLesson from './lessons/LetterLesson';
import WordLesson from './lessons/WordLesson';
import QuizLesson from './lessons/QuizLesson';
import ConversationLesson from './lessons/ConversationLesson';
import SpellingLesson from './lessons/SpellingLesson';
import ListeningLesson from './lessons/ListeningLesson';
import PictureMatchLesson from './lessons/PictureMatchLesson';
import SentenceBuilderLesson from './lessons/SentenceBuilderLesson';

interface Props {
  lesson: Lesson;
  user: User;
  onComplete: (score: number, learnedWords?: string[]) => void;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const LessonView = ({ lesson, user, onComplete, onBack }: Props) => {
  const hasCountdown = !!lesson.content.timer_seconds;
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(lesson.content.timer_seconds ?? 0);
  const [timeUp, setTimeUp] = useState(false);

  const getTopicEmoji = () => {
    switch (lesson.topic_tag) {
      case 'football': return '⚽';
      case 'tanach': return '📜';
      case 'daily_life': return '🌟';
      default: return '📚';
    }
  };

  // Elapsed stopwatch (always runs)
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Countdown (only if timer_seconds set)
  useEffect(() => {
    if (!hasCountdown) return;
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); setTimeUp(true); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [hasCountdown]);

  // Time's up overlay
  if (timeUp) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl mb-5">⏰</div>
        <h2 className="font-rubik font-black text-kid-xl text-foreground mb-2">הזמן נגמר!</h2>
        <p className="font-rubik text-muted-foreground mb-8">
          עשית {formatTime(elapsed)} — כל הכבוד על המאמץ!
        </p>
        <button
          onClick={onBack}
          className="pitch-gradient text-primary-foreground font-rubik font-bold rounded-2xl px-8 py-4 text-kid"
        >
          חזרה למפה 🗺️
        </button>
      </div>
    );
  }

  const timerColor = hasCountdown
    ? countdown < 30 ? 'text-destructive' : countdown < 60 ? 'text-secondary' : 'text-primary'
    : 'text-muted-foreground';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 flex items-center gap-3 border-b border-border"
      >
        <button onClick={onBack} className="tap-target p-2">
          <ArrowRight size={24} />
        </button>
        <div className="flex-1">
          <h2 className="font-rubik font-bold text-kid">{lesson.title_he}</h2>
          <p className="text-sm text-muted-foreground font-rubik">
            {getTopicEmoji()} {lesson.xp_reward} XP
          </p>
        </div>

        {/* Timer display */}
        <div className={`flex items-center gap-1.5 font-rubik font-bold text-kid ${timerColor}`}>
          {hasCountdown ? <Timer size={18} /> : <Clock size={18} />}
          <span className="tabular-nums">
            {hasCountdown ? formatTime(countdown) : formatTime(elapsed)}
          </span>
        </div>

        <span className="text-2xl">{user.avatar_emoji}</span>
      </motion.div>

      {/* Lesson content */}
      {lesson.type === 'letters' && lesson.content.items && (
        <LetterLesson items={lesson.content.items} onComplete={onComplete} />
      )}
      {lesson.type === 'words' && lesson.content.words && (
        <WordLesson words={lesson.content.words} onComplete={(score, words) => onComplete(score, words)} />
      )}
      {lesson.type === 'quiz' && lesson.content.questions && (
        <QuizLesson
          questions={lesson.content.questions}
          timerSeconds={lesson.content.timer_seconds}
          speedBonus={lesson.content.speed_bonus}
          onComplete={onComplete}
        />
      )}
      {lesson.type === 'conversation' && lesson.content.dialogue && (
        <ConversationLesson dialogue={lesson.content.dialogue} onComplete={onComplete} />
      )}
      {lesson.type === 'spelling' && lesson.content.spelling_items && (
        <SpellingLesson items={lesson.content.spelling_items} onComplete={onComplete} />
      )}
      {lesson.type === 'listening' && lesson.content.listening_items && (
        <ListeningLesson
          items={lesson.content.listening_items}
          timerSeconds={lesson.content.timer_seconds}
          onComplete={onComplete}
        />
      )}
      {lesson.type === 'picture_match' && lesson.content.picture_items && (
        <PictureMatchLesson items={lesson.content.picture_items} onComplete={onComplete} />
      )}
      {lesson.type === 'sentence_builder' && lesson.content.sentence_items && (
        <SentenceBuilderLesson items={lesson.content.sentence_items} onComplete={onComplete} />
      )}
    </div>
  );
};

export default LessonView;
