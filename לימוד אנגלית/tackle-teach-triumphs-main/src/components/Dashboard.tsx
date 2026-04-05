import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame, BookOpen, Medal, LogOut, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getRandomWelcome, getDailyTip, getStreakMessage } from '@/lib/motivational';
import type { User } from '@/lib/types';

interface Props {
  user: User;
  onStartLesson: () => void;
  onAchievements: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
}

const funFacts = [
  '🌍 אנגלית היא השפה הנפוצה ביותר בעולם!',
  '⚽ כל שחקני הכדורגל הגדולים מדברים אנגלית',
  '🎮 רוב המשחקים בעולם הם באנגלית',
  '🎬 סרטי מארוול מדברים אנגלית!',
  '🏆 מסי, רונאלדו ומבאפה - כולם יודעים אנגלית',
  '📱 כל האפליקציות הכי מגניבות באנגלית',
  '🎵 השירים הכי שווים בעולם הם באנגלית',
];

const Dashboard = ({ user, onStartLesson, onAchievements, onLeaderboard, onLogout }: Props) => {
  const [welcomeMsg] = useState(() => getRandomWelcome(user.name));
  const [dailyTip] = useState(() => getDailyTip());
  const [funFact] = useState(() => funFacts[Math.floor(Math.random() * funFacts.length)]);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalLessons, setTotalLessons] = useState(8);
  const streakMsg = getStreakMessage(user.streak_days);

  useEffect(() => {
    Promise.all([
      supabase.from('word_memory').select('id').eq('user_id', user.id),
      supabase.from('progress').select('id').eq('user_id', user.id).eq('completed', true),
      supabase.from('lessons').select('id'),
    ]).then(([wordsRes, progressRes, lessonsRes]) => {
      if (wordsRes.data) setWordsLearned(wordsRes.data.length);
      if (progressRes.data) setLessonsCompleted(progressRes.data.length);
      if (lessonsRes.data) setTotalLessons(lessonsRes.data.length);
    });
  }, [user.id]);

  const progressPercent = totalLessons > 0 ? Math.min((lessonsCompleted / totalLessons) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-4"
      >
        <button onClick={onLogout} className="tap-target p-2 text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={22} />
        </button>
        <div className="text-center flex-1">
          <motion.div 
            className="text-6xl mb-1"
            animate={{ scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {user.avatar_emoji}
          </motion.div>
          <h1 className="text-kid-xl font-rubik font-bold">!{user.name} אהלן</h1>
        </div>
        <div className="w-[48px]" />
      </motion.div>

      {/* Welcome message */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card-warm rounded-2xl p-4 mb-4 text-center"
      >
        <p className="font-rubik text-kid text-foreground/80">{welcomeMsg}</p>
      </motion.div>

      {/* Streak banner */}
      {user.streak_days > 0 && streakMsg && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="celebration-gradient text-primary-foreground rounded-2xl p-3 mb-4 text-center font-rubik font-bold text-kid"
        >
          🔥 {streakMsg}
        </motion.div>
      )}

      {/* Personal Progress - My Growth */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5 mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Heart size={18} className="text-destructive" />
          <p className="font-rubik font-bold text-kid">ההתקדמות שלי</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <motion.div 
              className="text-3xl mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📚
            </motion.div>
            <div className="text-kid-lg font-rubik font-bold text-primary">{lessonsCompleted}</div>
            <div className="text-xs font-rubik text-muted-foreground">שיעורים</div>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-3xl mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              🔤
            </motion.div>
            <div className="text-kid-lg font-rubik font-bold text-secondary">{wordsLearned}</div>
            <div className="text-xs font-rubik text-muted-foreground">מילים למדתי</div>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-3xl mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              🔥
            </motion.div>
            <div className="text-kid-lg font-rubik font-bold text-destructive">{user.streak_days}</div>
            <div className="text-xs font-rubik text-muted-foreground">ימים רצופים</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-5 overflow-hidden relative">
          <motion.div
            className="gold-gradient h-5 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          >
            <motion.div 
              className="absolute inset-0 bg-primary-foreground/20 rounded-full"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-rubik font-bold text-foreground/70">
              {lessonsCompleted}/{totalLessons} שיעורים ⭐
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fun fact - builds motivation */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-sky/10 rounded-2xl p-3 mb-4 text-center border border-sky/20"
      >
        <p className="font-rubik text-sm text-foreground/80 font-medium">{funFact}</p>
      </motion.div>

      {/* Golden boots display */}
      {user.golden_boots > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-card-warm rounded-2xl p-3 mb-4 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">👟</span>
          <span className="font-rubik font-bold text-kid text-gold-shimmer">{user.golden_boots} נעלי זהב</span>
          <span className="text-2xl">✨</span>
        </motion.div>
      )}

      {/* Daily tip */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-muted/50 rounded-2xl p-3 mb-5 text-center"
      >
        <p className="font-rubik text-sm text-muted-foreground">{dailyTip}</p>
      </motion.div>

      {/* Main CTA */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.45, type: 'spring' }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStartLesson}
        className="w-full pitch-gradient text-primary-foreground rounded-3xl p-6 mb-5 tap-target font-rubik font-bold text-kid-xl shadow-xl pulse-glow"
      >
        <div className="flex items-center justify-center gap-3">
          <BookOpen size={28} />
          <span>!בואו נתאמן</span>
          <motion.span 
            className="text-3xl"
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⚽
          </motion.span>
        </div>
      </motion.button>

      {/* Bottom nav */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={onAchievements}
          className="fun-card rounded-2xl p-4 tap-target flex items-center justify-center gap-2 font-rubik font-semibold text-kid"
        >
          <Medal size={22} className="text-secondary" />
          <span>הישגים שלי</span>
        </button>
        <button
          onClick={onLeaderboard}
          className="fun-card rounded-2xl p-4 tap-target flex items-center justify-center gap-2 font-rubik font-semibold text-kid"
        >
          <TrendingUp size={22} className="text-primary" />
          <span>המסע שלי</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
