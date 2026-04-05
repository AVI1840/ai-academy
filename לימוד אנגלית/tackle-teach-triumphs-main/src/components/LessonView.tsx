import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
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

// Session limit: 7 minutes per lesson — healthy screen time
const SESSION_LIMIT_SECONDS = 7 * 60;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const LessonView = ({ lesson, user, onComplete, onBack }: Props) => {
  const [elapsed, setElapsed] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);

  const getTopicEmoji = () => {
    switch (lesson.topic_tag) {
      case 'football': return '⚽';
      case 'tanach': return '📜';
      case 'daily_life': return '🌟';
      default: return '📚';
    }
  };

  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        if (next >= SESSION_LIMIT_SECONDS) {
          clearInterval(t);
          setSessionEnded(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = SESSION_LIMIT_SECONDS - elapsed;
  const nearEnd = remaining <= 60;

  // Gentle session-end screen — not scary, just a natural stop
  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-8xl"
        >
          🌟
        </motion.div>
        <div>
          <h2 className="font-rubik font-black text-kid-xl text-foreground mb-2">
            כל הכבוד! סיימת 7 דקות של למידה!
          </h2>
          <p className="font-rubik text-muted-foreground text-kid">
            עכשיו זמן מנוחה — תחזור מחר ותמשיך 💪
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="pitch-gradient text-primary-foreground font-rubik font-bold rounded-3xl px-10 py-4 text-kid shadow-xl"
        >
          חזרה למפה 🗺️
        </motion.button>
      </div>
    );
  }

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

        {/* Elapsed time — informational, not pressure */}
        <div className={`flex items-center gap-1.5 font-rubik font-bold text-sm ${nearEnd ? 'text-secondary' : 'text-muted-foreground'}`}>
          <Clock size={15} />
          <span className="tabular-nums">{formatTime(elapsed)}</span>
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
