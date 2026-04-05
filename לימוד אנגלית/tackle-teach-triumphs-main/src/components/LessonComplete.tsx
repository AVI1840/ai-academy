import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getCompletionMessage } from '@/lib/motivational';
import type { Lesson } from '@/lib/types';

interface Props {
  lesson: Lesson;
  score: number;
  newAchievements?: { emoji: string; title: string }[];
  onContinue: () => void;
}

const confettiEmojis = ['🟡', '💚', '⭐', '💛', '🌟', '✨', '🎉', '🏆', '⚽', '👑', '🎊', '💪'];

const personalMessages: Record<string, string> = {
  high: 'אתה מתקדם מדהים! כל שיעור אתה יודע יותר אנגלית! 🌍',
  medium: 'אתה כבר יודע הרבה מילים חדשות! תמשיך ככה! 💪',
  low: 'כל אימון עושה אותך חזק יותר! אתה על הדרך! 🌟',
};

const LessonComplete = ({ lesson, score, newAchievements = [], onContinue }: Props) => {
  const stars = score >= 100 ? 3 : score >= 80 ? 2 : 1;
  const message = getCompletionMessage(score);
  const personalMsg = score >= 90 ? personalMessages.high : score >= 70 ? personalMessages.medium : personalMessages.low;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti */}
      {confettiEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${5 + i * 8}%` }}
          initial={{ y: -100, opacity: 0, rotate: 0 }}
          animate={{ 
            y: ['0vh', '100vh'],
            opacity: [1, 0],
            rotate: [0, 360 + i * 45],
            x: [0, (i % 2 ? 40 : -40)],
          }}
          transition={{ 
            duration: 3 + i * 0.2,
            delay: 0.3 + i * 0.1,
            ease: 'easeIn',
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-center relative z-10 max-w-sm"
      >
        {/* Trophy */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="text-8xl mb-4"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            🏆
          </motion.span>
        </motion.div>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-5">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: i <= stars ? 1 : 0.4, rotate: 0, opacity: i <= stars ? 1 : 0.2 }}
              transition={{ delay: 0.6 + i * 0.2, type: 'spring', stiffness: 200 }}
            >
              <Star
                size={44}
                className={i <= stars ? 'text-secondary fill-secondary drop-shadow-lg' : 'text-muted'}
              />
            </motion.div>
          ))}
        </div>

        {/* Message */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-kid-xl font-rubik font-black mb-2 leading-relaxed"
        >
          {message}
        </motion.h1>

        {/* Personal growth message */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-sm font-rubik text-muted-foreground mb-4"
        >
          {personalMsg}
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="glass-card-warm rounded-3xl p-5 mb-6 inline-block"
        >
          <div className="text-kid-2xl font-rubik font-bold text-gold-shimmer">{score}%</div>
          <div className="text-xs font-rubik text-muted-foreground mt-1">ציון</div>
        </motion.div>

        {/* XP and Boots */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex gap-6 justify-center mb-6"
        >
          <motion.div className="text-center glass-card rounded-2xl px-5 py-3" whileHover={{ scale: 1.05 }}>
            <div className="text-kid-lg font-rubik font-bold text-primary">+{lesson.xp_reward}</div>
            <div className="text-xs text-muted-foreground font-rubik">⭐ XP</div>
          </motion.div>
          <motion.div className="text-center glass-card rounded-2xl px-5 py-3" whileHover={{ scale: 1.05 }}>
            <div className="text-kid-lg font-rubik font-bold text-secondary">+{lesson.boots_reward}</div>
            <div className="text-xs text-muted-foreground font-rubik">👟 נעלי זהב</div>
          </motion.div>
        </motion.div>

        {/* New Achievements */}
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.7, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <p className="text-xs font-rubik text-muted-foreground mb-2 text-center">🎊 הישג חדש!</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {newAchievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.7 + i * 0.2, type: 'spring' }}
                  className="glass-card-warm rounded-2xl px-4 py-3 flex items-center gap-2"
                >
                  <span className="text-2xl">{ach.emoji}</span>
                  <span className="text-xs font-rubik font-bold text-foreground">{ach.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="pitch-gradient text-primary-foreground rounded-3xl px-10 py-4 tap-target font-rubik font-bold text-kid-lg shadow-xl pulse-glow"
        >
          !המשך ⚽
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LessonComplete;
