import { useState, useCallback, useEffect } from 'react';
import { useActiveUser } from '@/hooks/useActiveUser';
import { supabase } from '@/integrations/supabase/client';
import { getNextReviewDate } from '@/lib/spaced-repetition';
import type { Lesson, WordMemory } from '@/lib/types';
import PlayerSelect from '@/components/PlayerSelect';
import Dashboard from '@/components/Dashboard';
import LessonMap from '@/components/LessonMap';
import LessonView from '@/components/LessonView';
import LessonComplete from '@/components/LessonComplete';
import Achievements from '@/components/Achievements';
import Leaderboard from '@/components/Leaderboard';
import WordReview from '@/components/WordReview';

type Screen = 'select' | 'dashboard' | 'map' | 'lesson' | 'complete' | 'achievements' | 'leaderboard' | 'review';

function getWordMeta(lesson: Lesson, englishWord: string): { hebrew: string; emoji: string } {
  const c = lesson.content;
  const key = englishWord.toLowerCase();
  const find = (arr: { english?: string; word?: string; text?: string; hebrew: string; emoji: string }[]) =>
    arr?.find(item => ((item.english ?? item.word ?? item.text) ?? '').toLowerCase() === key);
  const item = find(c.words ?? []) ?? find(c.spelling_items ?? []) ?? find(c.picture_items ?? []) ?? find(c.listening_items ?? []);
  return { hebrew: item?.hebrew ?? '', emoji: item?.emoji ?? '' };
}

const Index = () => {
  const { user, loading, selectUser, logout, updateUser, refreshUser } = useActiveUser();
  const [screen, setScreen] = useState<Screen>('select');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [reviewWords, setReviewWords] = useState<WordMemory[]>([]);
  const [newAchievements, setNewAchievements] = useState<{ emoji: string; title: string }[]>([]);

  useEffect(() => {
    if (user && screen === 'select') {
      setScreen('dashboard');
    }
  }, [user]);

  const handleSelectUser = async (userId: string) => {
    await selectUser(userId);
    setScreen('dashboard');
  };

  const handleStartLesson = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: dueWords } = await supabase
        .from('word_memory')
        .select('*')
        .eq('user_id', user.id)
        .lte('next_review_date', today)
        .lt('mastery_level', 5)
        .limit(5);

      // Also fetch extra words to use as distractors in the quiz
      const { data: allWords } = await supabase
        .from('word_memory')
        .select('*')
        .eq('user_id', user.id)
        .limit(40);

      if (dueWords && dueWords.length > 0) {
        const due = dueWords as unknown as WordMemory[];
        const all = (allWords ?? []) as unknown as WordMemory[];
        const extras = all.filter(w => !due.some(d => d.id === w.id));
        // Attach distractors list to each review word
        const withDistractors = due.map(w => ({ ...w, _pool: extras }));
        setReviewWords(withDistractors as unknown as WordMemory[]);
        setScreen('review');
      } else {
        setScreen('map');
      }
    } catch {
      setScreen('map');
    }
  }, [user]);

  const handleReviewComplete = useCallback(async (results: { word: string; correct: boolean }[]) => {
    if (!user) return;
    
    for (const result of results) {
      const { data: existing } = await supabase
        .from('word_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('word', result.word)
        .single();
      
      if (existing) {
        const newMastery = result.correct
          ? Math.min((existing as any).mastery_level + 1, 5)
          : Math.max((existing as any).mastery_level - 1, 0);
        
        await supabase
          .from('word_memory')
          .update({
            mastery_level: newMastery,
            next_review_date: getNextReviewDate(newMastery),
          })
          .eq('id', existing.id);
      }
    }
    
    setScreen('map');
  }, [user]);

  const handleLessonComplete = useCallback(async (score: number, learnedWords?: string[]) => {
    if (!user || !currentLesson) return;

    setLastScore(score);

    try {

    // Save progress
    const { data: existing } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', currentLesson.id)
      .single();

    if (existing) {
      await supabase
        .from('progress')
        .update({
          score,
          completed: true,
          attempts: (existing as any).attempts + 1,
          completed_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('progress').insert({
        user_id: user.id,
        lesson_id: currentLesson.id,
        score,
        completed: true,
        attempts: 1,
        completed_at: new Date().toISOString(),
      });
    }

    // Update user points
    const newPoints = user.total_points + currentLesson.xp_reward;
    const newBoots = user.golden_boots + currentLesson.boots_reward;
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = user.last_activity_date;
    let newStreak = user.streak_days;
    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActivity === yesterday.toISOString().split('T')[0]) {
        newStreak += 1;
      } else if (!lastActivity) {
        newStreak = 1;
      } else {
        newStreak = 1;
      }
    }

    await supabase
      .from('users')
      .update({
        total_points: newPoints,
        golden_boots: newBoots,
        streak_days: newStreak,
        last_activity_date: today,
      })
      .eq('id', user.id);

    updateUser({
      total_points: newPoints,
      golden_boots: newBoots,
      streak_days: newStreak,
      last_activity_date: today,
    });

    // Save learned words for spaced repetition
    if (learnedWords) {
      for (const word of learnedWords) {
        const { data: existingWord } = await supabase
          .from('word_memory')
          .select('id')
          .eq('user_id', user.id)
          .eq('word', word)
          .single();
        
        if (!existingWord) {
          const { hebrew, emoji } = getWordMeta(currentLesson, word);
          await supabase.from('word_memory').insert({
            user_id: user.id,
            word,
            hebrew,
            emoji,
            mastery_level: 1,
            next_review_date: getNextReviewDate(1),
          });
        }
      }
    }

    // Handle lesson flags — only flag if score is below 70 (needs help)
    if (score < 70) {
      await supabase.from('lesson_flags').upsert({
        user_id: user.id,
        lesson_id: currentLesson.id,
        needs_review: true,
      });
    } else {
      // Clear review flag if they improved
      await supabase
        .from('lesson_flags')
        .update({ needs_review: false })
        .eq('user_id', user.id)
        .eq('lesson_id', currentLesson.id);
    }

    // Update leaderboard_weekly
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const { data: existingWeek } = await supabase
      .from('leaderboard_weekly')
      .select('id, points')
      .eq('user_id', user.id)
      .eq('week_start', weekStartStr)
      .single();
    if (existingWeek) {
      await supabase
        .from('leaderboard_weekly')
        .update({ points: (existingWeek as any).points + currentLesson.xp_reward })
        .eq('id', (existingWeek as any).id);
    } else {
      await supabase.from('leaderboard_weekly').insert({
        user_id: user.id,
        week_start: weekStartStr,
        points: currentLesson.xp_reward,
      });
    }

    // Check achievements
    const { data: progressCount } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('completed', true);

    const completedCount = progressCount?.length ?? 0;
    const achievementKeys: string[] = [];

    if (completedCount === 1) achievementKeys.push('first_goal');
    if (completedCount === 3) achievementKeys.push('hat_trick');
    if (completedCount === 5) achievementKeys.push('five_star');
    if (completedCount === 10) achievementKeys.push('ten_lessons');
    if (completedCount >= 32) achievementKeys.push('champion');
    if (score === 100) achievementKeys.push('perfect_round');
    if (newStreak >= 3) achievementKeys.push('streak_3');
    if (newStreak >= 7) achievementKeys.push('streak_7');

    const unlocked: { emoji: string; title: string }[] = [];
    for (const key of achievementKeys) {
      const { data: ach } = await supabase
        .from('achievements')
        .select('id, icon_emoji, title_he')
        .eq('key', key)
        .single();
      if (ach) {
        const { error: upsertErr } = await supabase.from('user_achievements').upsert({
          user_id: user.id,
          achievement_id: (ach as any).id,
        });
        if (!upsertErr) {
          unlocked.push({ emoji: (ach as any).icon_emoji, title: (ach as any).title_he });
        }
      }
    }
    if (unlocked.length > 0) setNewAchievements(unlocked);

      setScreen('complete');
    } catch {
      // Even if saving fails, show the completion screen
      setScreen('complete');
    }
  }, [user, currentLesson, updateUser]);

  const handleLogout = () => {
    logout();
    setScreen('select');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-4xl animate-bounce">⚽</div>
      </div>
    );
  }

  switch (screen) {
    case 'select':
      return <PlayerSelect onSelect={handleSelectUser} />;
    case 'dashboard':
      return user ? (
        <Dashboard
          user={user}
          onStartLesson={handleStartLesson}
          onAchievements={() => setScreen('achievements')}
          onLeaderboard={() => setScreen('leaderboard')}
          onLogout={handleLogout}
        />
      ) : null;
    case 'review':
      return <WordReview words={reviewWords} onComplete={handleReviewComplete} />;
    case 'map':
      return user ? (
        <LessonMap
          user={user}
          onSelectLesson={(lesson) => { setCurrentLesson(lesson); setScreen('lesson'); }}
          onBack={() => setScreen('dashboard')}
        />
      ) : null;
    case 'lesson':
      return user && currentLesson ? (
        <LessonView
          lesson={currentLesson}
          user={user}
          onComplete={handleLessonComplete}
          onBack={() => setScreen('map')}
        />
      ) : null;
    case 'complete':
      return currentLesson ? (
        <LessonComplete
          lesson={currentLesson}
          score={lastScore}
          newAchievements={newAchievements}
          onContinue={() => { setNewAchievements([]); refreshUser(); setScreen('dashboard'); }}
        />
      ) : null;
    case 'achievements':
      return user ? <Achievements user={user} onBack={() => setScreen('dashboard')} /> : null;
    case 'leaderboard':
      return user ? <Leaderboard user={user} onBack={() => setScreen('dashboard')} /> : null;
    default:
      return null;
  }
};

export default Index;
