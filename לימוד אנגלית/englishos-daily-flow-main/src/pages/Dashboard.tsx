import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProgress, getMasteredCount, getWordsDueTomorrow, getWeeklyStats } from '@/lib/srsEngine';
import { UserProgress } from '@/lib/types';
import { BookOpen, Target, ArrowLeft, Calendar } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) return null;

  const mastered = getMasteredCount(progress.words);
  const totalGoal = 1000;
  const progressPercent = Math.min((mastered / totalGoal) * 100, 100);
  const dueTomorrow = getWordsDueTomorrow(progress.words);
  const weeklyData = getWeeklyStats(progress.dailyStats);
  const maxWords = Math.max(...weeklyData.map(d => d.words), 1);

  const learning = progress.words.filter(w => w.state === 'learning').length;
  const review = progress.words.filter(w => w.state === 'review').length;
  const newCount = progress.words.filter(w => w.state === 'new').length;

  return (
    <div className="min-h-screen bg-background flex flex-col px-5 pt-safe-top pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 pb-6">
        <button onClick={() => navigate('/')} className="text-muted-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Streak */}
      <div className="bg-card rounded-2xl p-5 mb-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-2xl font-bold text-foreground">{progress.streak}</p>
            <p className="text-sm text-muted-foreground">day streak</p>
          </div>
        </div>
      </div>

      {/* Progress Toward 1000 */}
      <div className="bg-card rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Word Mastery</span>
          </div>
          <span className="text-sm font-mono text-muted-foreground">{mastered}/{totalGoal}</span>
        </div>
        <div className="w-full h-3 bg-progress-track rounded-full overflow-hidden">
          <div 
            className="h-full bg-progress-fill rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Word States */}
      <div className="grid grid-cols-3 gap-3 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-xl font-bold text-foreground">{newCount}</p>
          <p className="text-xs text-muted-foreground">New</p>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-xl font-bold text-foreground">{learning}</p>
          <p className="text-xs text-muted-foreground">Learning</p>
        </div>
        <div className="bg-card rounded-2xl p-4 text-center">
          <p className="text-xl font-bold text-primary">{mastered}</p>
          <p className="text-xs text-muted-foreground">Mastered</p>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-card rounded-2xl p-5 mb-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">This Week</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-progress-fill rounded-t-md transition-all duration-500"
                style={{ 
                  height: `${d.words > 0 ? Math.max((d.words / maxWords) * 100, 10) : 4}%`,
                  opacity: d.words > 0 ? 1 : 0.2,
                }}
              />
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Due Tomorrow */}
      <div className="bg-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Due tomorrow</span>
          <span className="text-lg font-semibold text-foreground">{dueTomorrow} words</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-center gap-8 mt-8">
        <button 
          onClick={() => navigate('/')}
          className="text-muted-foreground text-xs font-medium flex flex-col items-center gap-1"
        >
          <BookOpen className="w-5 h-5" />
          Home
        </button>
        <button className="text-primary text-xs font-medium flex flex-col items-center gap-1">
          <Target className="w-5 h-5" />
          Stats
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
