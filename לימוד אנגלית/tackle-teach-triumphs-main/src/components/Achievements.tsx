import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Achievement, User } from '@/lib/types';

interface Props {
  user: User;
  onBack: () => void;
}

const Achievements = ({ user, onBack }: Props) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('achievements').select('*'),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
    ]).then(([achRes, earnedRes]) => {
      if (achRes.data) setAchievements(achRes.data as unknown as Achievement[]);
      if (earnedRes.data) setEarned(earnedRes.data.map(e => e.achievement_id));
    });
  }, [user.id]);

  const earnedCount = achievements.filter(a => earned.includes(a.id)).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-4"
      >
        <button onClick={onBack} className="tap-target p-2">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-kid-xl font-rubik font-bold flex-1">הישגים שלי 🏅</h1>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-5"
      >
        <span className="text-sm font-rubik text-muted-foreground bg-muted/50 rounded-full px-4 py-2">
          {earnedCount}/{achievements.length} הישגים הושגו ⭐
        </span>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {achievements.map((ach, i) => {
          const isEarned = earned.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              className={`fun-card rounded-3xl p-4 text-center ${
                isEarned ? 'border-2 border-secondary' : 'opacity-40'
              }`}
            >
              <motion.span 
                className="text-4xl block mb-2"
                animate={isEarned ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {ach.icon_emoji}
              </motion.span>
              <div className="font-rubik font-bold text-sm">{ach.title_he}</div>
              <div className="font-rubik text-xs text-muted-foreground mt-1">{ach.description_he}</div>
              {isEarned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2 text-xs text-success font-rubik font-bold"
                >
                  ✅ הושג!
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-muted-foreground font-rubik"
      >
        💪 כל שיעור מקרב אותך להישג הבא!
      </motion.div>
    </div>
  );
};

export default Achievements;
