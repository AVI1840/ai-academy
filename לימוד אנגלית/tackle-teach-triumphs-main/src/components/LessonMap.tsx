import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle, Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Lesson, Progress, User } from '@/lib/types';

interface Props {
  user: User;
  onSelectLesson: (lesson: Lesson) => void;
  onBack: () => void;
}

const roundThemes = [
  { emoji: '🌱', label: 'התחלה',   bg: 'from-primary/10 to-pitch-light/10' },
  { emoji: '⚡', label: 'מתגברים', bg: 'from-secondary/10 to-gold-light/10' },
  { emoji: '🌊', label: 'על גל',   bg: 'from-sky/10 to-sky-light/10' },
  { emoji: '🔥', label: 'בוערים',  bg: 'from-destructive/10 to-warm-light/10' },
  { emoji: '💪', label: 'חזקים',   bg: 'from-primary/10 to-success/10' },
  { emoji: '🌟', label: 'זוהרים',  bg: 'from-secondary/10 to-celebration-light/10' },
  { emoji: '🏆', label: 'אלופים',  bg: 'from-gold/10 to-gold-light/10' },
  { emoji: '👑', label: 'מלכים',   bg: 'from-primary/10 to-gold/10' },
];

const TYPE_INFO: Record<string, { emoji: string; label: string }> = {
  letters:         { emoji: '🔤', label: 'אותיות' },
  words:           { emoji: '📝', label: 'מילים' },
  quiz:            { emoji: '🧠', label: 'חידון' },
  conversation:    { emoji: '💬', label: 'שיחה' },
  spelling:        { emoji: '✍️', label: 'כתיב' },
  sentence_builder:{ emoji: '🔧', label: 'משפטים' },
  listening:       { emoji: '👂', label: 'האזנה' },
  picture_match:   { emoji: '🖼️', label: 'התאמה' },
};

const TOPIC_EMOJI: Record<string, string> = {
  football:   '⚽',
  tanach:     '📜',
  daily_life: '🌟',
};

const LessonMap = ({ user, onSelectLesson, onBack }: Props) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('lessons').select('*').order('season').order('round').order('order_in_round'),
      supabase.from('progress').select('*').eq('user_id', user.id),
    ]).then(([lessonsRes, progressRes]) => {
      if (lessonsRes.data) setLessons(lessonsRes.data as unknown as Lesson[]);
      if (progressRes.data) setProgress(progressRes.data as unknown as Progress[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user.id]);

  const isCompleted = (lessonId: string) =>
    progress.some(p => p.lesson_id === lessonId && p.completed);
  const getProgress = (lessonId: string) =>
    progress.find(p => p.lesson_id === lessonId);

  const isRoundUnlocked = (_roundLessons: Lesson[], _allRoundKeys: string[], _currentKey: string) => true;

  // Group lessons by round
  const rounds = lessons.reduce((acc, lesson) => {
    const key = `${lesson.season}-${lesson.round}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const roundKeys = Object.keys(rounds);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div className="text-5xl" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⚽</motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-16">
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-6"
      >
        <button onClick={onBack} className="tap-target p-2">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-kid-xl font-rubik font-bold flex-1">מגרש האימונים 🏟️</h1>
        <span className="text-xs font-rubik text-muted-foreground bg-muted rounded-full px-3 py-1">
          {progress.filter(p => p.completed).length} / {lessons.length}
        </span>
      </motion.div>

      {roundKeys.map((key, ri) => {
        const roundLessons = rounds[key];
        const [, round] = key.split('-');
        const completedInRound = roundLessons.filter(l => isCompleted(l.id)).length;
        const theme = roundThemes[(parseInt(round) - 1) % roundThemes.length];
        const allDone = completedInRound === roundLessons.length;
        const roundUnlocked = isRoundUnlocked(roundLessons, roundKeys, key);

        return (
          <motion.div
            key={key}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: ri * 0.08 }}
            className={`mb-6 ${!roundUnlocked ? 'opacity-50' : ''}`}
          >
            {/* Round header */}
            <div className={`rounded-2xl p-3 mb-3 bg-gradient-to-r ${theme.bg} flex items-center justify-between`}>
              <h2 className="text-kid font-rubik font-bold text-foreground flex items-center gap-2">
                {theme.emoji} סיבוב {round} — {theme.label}
              </h2>
              {allDone ? (
                <motion.span
                  className="text-xs font-rubik text-success font-bold bg-success/10 rounded-full px-3 py-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✅ הושלם!
                </motion.span>
              ) : (
                <span className="text-xs font-rubik text-muted-foreground bg-muted rounded-full px-3 py-1">
                  {completedInRound}/{roundLessons.length}
                </span>
              )}
            </div>

            {/* Lessons in round */}
            <div className="space-y-2.5">
              {roundLessons.map((lesson, li) => {
                const completed = isCompleted(lesson.id);
                const lessonProgress = getProgress(lesson.id);
                const typeInfo = TYPE_INFO[lesson.type] ?? { emoji: '📚', label: 'שיעור' };

                return (
                  <motion.button
                    key={lesson.id}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: ri * 0.08 + li * 0.05 }}
                    whileHover={roundUnlocked ? { scale: 1.02, x: -4 } : {}}
                    whileTap={roundUnlocked ? { scale: 0.98 } : {}}
                    onClick={() => roundUnlocked && onSelectLesson(lesson)}
                    disabled={!roundUnlocked}
                    className={`w-full rounded-2xl p-4 tap-target flex items-center gap-4 transition-all border text-right ${
                      !roundUnlocked
                        ? 'bg-muted/20 border-border/10 cursor-not-allowed'
                        : completed
                        ? 'bg-success/5 border-success/30 shadow-md hover:shadow-lg hover:bg-success/10'
                        : 'glass-card border-border/40 hover:shadow-xl hover:border-primary/30'
                    }`}
                  >
                    {/* Type icon */}
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        completed ? 'bg-success/15' : 'bg-muted/50'
                      }`}
                      animate={roundUnlocked && !completed ? { scale: [1, 1.06, 1] } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <span className="text-2xl">{typeInfo.emoji}</span>
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 text-right min-w-0">
                      <div className="font-rubik font-bold text-kid leading-tight">{lesson.title_he}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-rubik mt-1 flex-wrap">
                        <span>{typeInfo.label}</span>
                        <span>•</span>
                        <span>{TOPIC_EMOJI[lesson.topic_tag] ?? '📚'}</span>
                        <span>⭐ {lesson.xp_reward} XP</span>
                      </div>
                      {completed && lessonProgress && (
                        <div className="text-xs text-success font-rubik font-semibold mt-1">
                          ✨ {lessonProgress.score}% — שחק שוב?
                        </div>
                      )}
                    </div>

                    {/* Status icon */}
                    {!roundUnlocked ? (
                      <Lock className="text-muted-foreground shrink-0" size={18} />
                    ) : completed ? (
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <CheckCircle className="text-success" size={22} />
                        <motion.div
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <RefreshCw className="text-muted-foreground" size={14} />
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        animate={{ x: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="shrink-0"
                      >
                        <Play className="text-primary" size={24} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LessonMap;
