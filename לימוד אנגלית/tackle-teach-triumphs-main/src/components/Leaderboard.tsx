import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Heart, Target, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/lib/types';

interface Props {
  user: User;
  onBack: () => void;
}

interface Milestone {
  label: string;
  emoji: string;
  reached: boolean;
  value: number;
  target: number;
  motivation: string;
}

const Leaderboard = ({ user, onBack }: Props) => {
  const [wordsLearned, setWordsLearned] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [masteredWords, setMasteredWords] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from('word_memory').select('mastery_level').eq('user_id', user.id),
      supabase.from('progress').select('id').eq('user_id', user.id).eq('completed', true),
    ]).then(([wordsRes, progressRes]) => {
      if (wordsRes.data) {
        setWordsLearned(wordsRes.data.length);
        setMasteredWords(wordsRes.data.filter((w: any) => w.mastery_level >= 4).length);
      }
      if (progressRes.data) setLessonsCompleted(progressRes.data.length);
    });
  }, [user.id]);

  const milestones: Milestone[] = [
    { label: 'שיעור ראשון', emoji: '🌱', reached: lessonsCompleted >= 1, value: lessonsCompleted, target: 1, motivation: 'הצעד הראשון הוא הכי חשוב!' },
    { label: '5 מילים חדשות', emoji: '📝', reached: wordsLearned >= 5, value: wordsLearned, target: 5, motivation: 'כל מילה פותחת דלת חדשה!' },
    { label: '3 ימים רצופים', emoji: '🔥', reached: user.streak_days >= 3, value: user.streak_days, target: 3, motivation: 'עקביות היא המפתח!' },
    { label: '5 שיעורים', emoji: '⚽', reached: lessonsCompleted >= 5, value: lessonsCompleted, target: 5, motivation: 'אתה כבר מקצוען!' },
    { label: '15 מילים', emoji: '🌟', reached: wordsLearned >= 15, value: wordsLearned, target: 15, motivation: 'אוצר מילים מרשים!' },
    { label: 'שבוע רצוף', emoji: '💪', reached: user.streak_days >= 7, value: user.streak_days, target: 7, motivation: 'שבוע שלם! אתה מכונה!' },
    { label: '30 מילים', emoji: '🏆', reached: wordsLearned >= 30, value: wordsLearned, target: 30, motivation: 'אתה כבר מדבר אנגלית!' },
    { label: '10 שיעורים', emoji: '🎓', reached: lessonsCompleted >= 10, value: lessonsCompleted, target: 10, motivation: 'תלמיד מצטיין!' },
    { label: 'מילה מושלמת', emoji: '👑', reached: masteredWords >= 1, value: masteredWords, target: 1, motivation: 'שליטה מלאה!' },
    { label: '50 מילים', emoji: '🌍', reached: wordsLearned >= 50, value: wordsLearned, target: 50, motivation: 'אתה אזרח העולם!' },
  ];

  const nextMilestone = milestones.find(m => !m.reached);

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-6"
      >
        <button onClick={onBack} className="tap-target p-2">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-kid-xl font-rubik font-bold flex-1">המסע שלי 🗺️</h1>
      </motion.div>

      {/* Personal hero card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="celebration-gradient text-primary-foreground rounded-3xl p-6 mb-6 text-center"
      >
        <motion.div 
          className="text-6xl mb-2"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {user.avatar_emoji}
        </motion.div>
        <h2 className="font-rubik font-black text-kid-xl mb-1">{user.name}</h2>
        <p className="font-rubik text-sm opacity-90">
          שחקן אנגלית מתקדם 🌟
        </p>
      </motion.div>

      {/* Next goal */}
      {nextMilestone && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-card-warm rounded-2xl p-4 mb-5 flex items-center gap-3"
        >
          <Target size={20} className="text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-rubik font-bold text-sm text-foreground">היעד הבא: {nextMilestone.label} {nextMilestone.emoji}</p>
            <p className="font-rubik text-xs text-muted-foreground">{nextMilestone.motivation}</p>
            <div className="w-full bg-muted rounded-full h-2 mt-1.5">
              <motion.div
                className="gold-gradient h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((nextMilestone.value / nextMilestone.target) * 100, 100)}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Milestones */}
      <h3 className="font-rubik font-bold text-kid mb-3 flex items-center gap-2">
        <Heart size={18} className="text-destructive" />
        ההישגים שלי
      </h3>
      
      <div className="space-y-2.5 max-w-md mx-auto">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`rounded-2xl p-3.5 flex items-center gap-3 border transition-all ${
              m.reached 
                ? 'bg-success/5 border-success/30 shadow-sm' 
                : 'bg-card/50 border-border/20 opacity-60'
            }`}
          >
            <motion.span 
              className="text-2xl"
              animate={m.reached ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {m.emoji}
            </motion.span>
            <div className="flex-1">
              <div className="font-rubik font-semibold text-sm">{m.label}</div>
              {!m.reached && (
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <motion.div
                    className="gold-gradient h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                  />
                </div>
              )}
            </div>
            {m.reached && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-success">
                ✅
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-center text-sm text-muted-foreground font-rubik"
      >
        🌟 כל צעד קטן הוא התקדמות גדולה!
      </motion.div>
    </div>
  );
};

export default Leaderboard;
