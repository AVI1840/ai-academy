import { useState, useEffect } from 'react';
import {
  loadProgress, saveProgress, getDailySession, getSessionEstimate,
  updateStreak, getMasteredCount, shouldShowPhraseMode, getMilestone, isStreakAtRisk
} from '@/lib/srsEngine';
import { Word, UserProgress } from '@/lib/types';
import { Flame, BookOpen, Target, ChevronRight, Trophy, Zap, AlertTriangle, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MILESTONES = [1, 10, 25, 50, 100, 200];

const getMasteryBadges = (mastered: number) => {
  return MILESTONES.map(m => ({
    count: m,
    unlocked: mastered >= m,
    emoji: m >= 200 ? '🏆' : m >= 100 ? '💎' : m >= 50 ? '⭐' : m >= 25 ? '🔥' : m >= 10 ? '🎯' : '🌱',
  }));
};

const motivationalMessages = [
  'כל מילה שאתה לומד פותחת דלת.',
  '5 דקות ביום = 200 מילים בשנה.',
  'אנגלית חזקה = קריירה חזקה.',
  'ממשל דיגיטלי מתחיל בשפה.',
  'מנהיגות מתחילה בתקשורת ברורה.',
];

const HomeScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [showMilestone, setShowMilestone] = useState<{ label: string; emoji: string } | null>(null);
  const [msgIndex] = useState(() => Math.floor(Math.random() * motivationalMessages.length));

  useEffect(() => {
    const p = loadProgress();
    const updated = updateStreak(p);
    if (updated.streak !== p.streak) saveProgress(updated);
    setProgress(updated);
    setSessionWords(getDailySession(updated.words));

    // Check if just hit a milestone (compare before/after)
    const mastered = getMasteredCount(updated.words);
    const milestone = getMilestone(mastered);
    if (milestone && mastered > 0) {
      const prev = mastered - 1;
      const prevMilestone = getMilestone(prev);
      if (!prevMilestone || prevMilestone.label !== milestone.label) {
        // Only show on milestone boundary
        if (MILESTONES.includes(mastered)) setShowMilestone(milestone);
      }
    }
  }, []);

  if (!progress) return null;

  const newCount = sessionWords.filter(w => w.state === 'new').length;
  const reviewCount = sessionWords.length - newCount;
  const estimate = getSessionEstimate(sessionWords);
  const mastered = getMasteredCount(progress.words);
  const totalGoal = 200;
  const progressPercent = Math.min((mastered / totalGoal) * 100, 100);
  const streakAtRisk = isStreakAtRisk(progress.lastStudyDate);
  const badges = getMasteryBadges(mastered);
  const milestone = getMilestone(mastered);

  const handleStart = () => {
    const showPhrases = shouldShowPhraseMode(progress.phraseLastShown);
    if (showPhrases && sessionWords.length === 0) {
      navigate('/phrases');
    } else {
      navigate('/session');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-safe-top pb-8">
      {/* Milestone celebration overlay */}
      {showMilestone && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowMilestone(null)}
        >
          <div className="bg-card rounded-3xl p-10 text-center mx-6 animate-bounce-once">
            <div className="text-7xl mb-4">{showMilestone.emoji}</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">כל הכבוד!</h2>
            <p className="text-lg text-muted-foreground mb-1">שלטת ב-{showMilestone.label}</p>
            <p className="text-sm text-muted-foreground mb-6">המשך כך — הדרך ל-200 מילים נפתחת!</p>
            <button
              onClick={() => setShowMilestone(null)}
              className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-2xl"
            >
              ממשיך! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-12 pb-4 animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">EnglishOS</h1>
        <p className="text-xs text-muted-foreground mt-0.5 italic">{motivationalMessages[msgIndex]}</p>
      </div>

      {/* Streak + Risk Alert */}
      <div className={`rounded-2xl p-5 mb-4 animate-fade-in ${streakAtRisk ? 'bg-orange-500/15 border border-orange-500/40' : 'bg-card'}`}
        style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3">
          {streakAtRisk
            ? <AlertTriangle className="w-8 h-8 text-orange-500 shrink-0" />
            : <div className={`text-3xl ${progress.streak > 0 ? 'animate-streak-bounce' : ''}`}>🔥</div>
          }
          <div className="flex-1">
            <p className="text-2xl font-bold text-foreground">{progress.streak}</p>
            <p className="text-sm text-muted-foreground">
              {streakAtRisk ? '⚠️ הרצף שלך בסכנה — למד היום!' : 'day streak'}
            </p>
          </div>
          {progress.streak >= 7 && (
            <div className="text-right">
              <p className="text-2xl">🏅</p>
              <p className="text-xs text-muted-foreground">{progress.streak} ימים!</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress toward 200 words */}
      <div className="bg-card rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">שליטה במילים</span>
          </div>
          <span className="text-sm text-muted-foreground">{mastered} / {totalGoal}</span>
        </div>
        <div className="w-full h-2.5 bg-progress-track rounded-full overflow-hidden">
          <div
            className="h-full bg-progress-fill rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {milestone && (
          <p className="text-xs text-primary mt-2 font-medium">{milestone.emoji} הגעת ל-{milestone.label}</p>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="bg-card rounded-2xl p-4 mb-4 animate-fade-in" style={{ animationDelay: '0.18s' }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">הישגים</span>
        </div>
        <div className="flex gap-2 justify-between">
          {badges.map(b => (
            <div
              key={b.count}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all ${
                b.unlocked ? 'bg-primary/10' : 'opacity-30'
              }`}
            >
              <span className="text-xl">{b.emoji}</span>
              <span className={`text-xs font-medium ${b.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                {b.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Session */}
      <div className="bg-card rounded-2xl p-5 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Session היום</span>
        </div>
        {sessionWords.length > 0 ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {newCount > 0 ? `${newCount} חדשות` : ''}{newCount > 0 && reviewCount > 0 ? ' + ' : ''}{reviewCount > 0 ? `${reviewCount} חזרה` : ''}
              </p>
              <p className="text-sm text-muted-foreground">~{estimate} דקות</p>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 rounded-xl px-3 py-1">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">{sessionWords.length} מילים</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-2xl mb-1">🎉</p>
            <p className="text-muted-foreground text-sm font-medium">סיימת להיום!</p>
            <p className="text-xs text-muted-foreground mt-1">חזור מחר להמשיך הרצף</p>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Start Buttons */}
      <div className="flex gap-3 animate-slide-up">
        <button
          onClick={handleStart}
          disabled={sessionWords.length === 0 && !shouldShowPhraseMode(progress.phraseLastShown)}
          className="flex-1 bg-primary text-primary-foreground font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 animate-pulse-glow"
        >
          {sessionWords.length > 0
            ? streakAtRisk ? '🔥 שמור הרצף!' : 'Flashcards'
            : 'ביטויים'}
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/quiz')}
          disabled={sessionWords.length === 0}
          className="flex-1 bg-card border border-primary/30 text-primary font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
        >
          <Brain className="w-5 h-5" />
          Quiz
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-center gap-8 mt-6">
        <button className="text-primary text-xs font-medium flex flex-col items-center gap-1">
          <BookOpen className="w-5 h-5" />
          בית
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-muted-foreground text-xs font-medium flex flex-col items-center gap-1"
        >
          <Target className="w-5 h-5" />
          סטטיסטיקות
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
