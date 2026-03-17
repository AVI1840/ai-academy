'use client';

import { useState, useEffect } from 'react';
import { fetchGlobalStats, getMyStats, formatLearningTime } from '@/lib/analytics';
import { COURSE_CATALOG } from '@/data/course-catalog';

interface GlobalStats { totalVisitors: number; totalLessonsCompleted: number; activeToday: number; }
interface LiveStatsProps { completedCount: number; }

export default function LiveStats({ completedCount }: LiveStatsProps) {
  const [global, setGlobal] = useState<GlobalStats | null>(null);
  const [myStats, setMyStats] = useState({ learningMinutes: 0, dailyStreak: 0 });

  useEffect(() => {
    const local = getMyStats();
    const stored = localStorage.getItem('hamakpetza_progress');
    const completedModules: number[] = stored ? ((JSON.parse(stored) as { completedModules?: number[] }).completedModules ?? []) : [];
    const minutes = completedModules.reduce((sum: number, num: number) => {
      const course = COURSE_CATALOG.find(c => c.courseNumber === num);
      return sum + (course ? (parseInt(course.duration, 10) || 35) : 35);
    }, 0);
    setMyStats({ learningMinutes: minutes, dailyStreak: local.dailyStreak });
    fetchGlobalStats().then(stats => { if (stats) setGlobal(stats); });
  }, [completedCount]);

  const stats = [
    { icon: '📚', value: completedCount, total: COURSE_CATALOG.length, label: 'יחידות הושלמו', color: 'text-accent' },
    { icon: '⏱️', value: formatLearningTime(myStats.learningMinutes), label: 'זמן למידה', color: 'text-secondary' },
    { icon: '🔥', value: myStats.dailyStreak, label: `יום${myStats.dailyStreak === 1 ? '' : ' רצוף'}`, color: 'text-orange-400' },
    ...(global ? [
      { icon: '👥', value: global.totalVisitors.toLocaleString('he-IL'), label: 'לומדים בקהילה', color: 'text-text' },
      { icon: '✅', value: global.totalLessonsCompleted.toLocaleString('he-IL'), label: 'יחידות נלמדו (כולל)', color: 'text-green-400' },
    ] : [
      { icon: '🏛️', value: '1,000+', label: 'מובילי AI', color: 'text-text' },
    ]),
  ];

  return (
    <section className="mb-12 glass-card rounded-2xl p-6 sm:p-8" aria-label="סטטיסטיקות למידה">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-secondary" />
          <h2 className="font-heading text-sm font-bold text-muted uppercase tracking-wider">הסטטיסטיקות שלי</h2>
        </div>
        {global && (
          <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-heading">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            בזמן אמת
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl p-4 text-center bg-surface/50 border border-border/50 transition-all hover:border-border hover:scale-[1.02]">
            <div className="text-2xl mb-2" aria-hidden="true">{stat.icon}</div>
            <p className={`font-heading font-black text-2xl leading-none ${stat.color}`}>
              {'total' in stat ? `${stat.value}/${stat.total}` : stat.value}
            </p>
            <p className="text-[11px] text-muted mt-1.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
