'use client';

import { useState, useEffect } from 'react';
import { fetchGlobalStats, getMyStats, formatLearningTime } from '@/lib/analytics';
import { COURSE_CATALOG } from '@/data/course-catalog';

interface GlobalStats {
  totalVisitors: number;
  totalLessonsCompleted: number;
  activeToday: number;
}

interface LiveStatsProps {
  completedCount: number;
}

export default function LiveStats({ completedCount }: LiveStatsProps) {
  const [global, setGlobal] = useState<GlobalStats | null>(null);
  const [myStats, setMyStats] = useState({ learningMinutes: 0, dailyStreak: 0 });

  useEffect(() => {
    const local = getMyStats();
    // Sync learning minutes from progress (course durations)
    const stored = localStorage.getItem('hamakpetza_progress');
    const completedModules: number[] = stored
      ? ((JSON.parse(stored) as { completedModules?: number[] }).completedModules ?? [])
      : [];
    const minutes = completedModules.reduce((sum: number, num: number) => {
      const course = COURSE_CATALOG.find(c => c.courseNumber === num);
      // duration format: "35 דקות קריאה" — parseInt stops at first non-numeric char
      const mins = course ? (parseInt(course.duration, 10) || 35) : 35;
      return sum + mins;
    }, 0);
    setMyStats({ learningMinutes: minutes, dailyStreak: local.dailyStreak });
    // Try to fetch global stats (Firebase)
    fetchGlobalStats().then(stats => {
      if (stats) setGlobal(stats);
    });
  }, [completedCount]);

  const stats = [
    {
      icon: '📚',
      value: completedCount,
      total: COURSE_CATALOG.length,
      label: 'יחידות הושלמו',
      color: 'text-accent',
      bg: 'bg-accent-light',
    },
    {
      icon: '⏱️',
      value: formatLearningTime(myStats.learningMinutes),
      label: 'זמן למידה',
      color: 'text-secondary',
      bg: 'bg-secondary-light',
    },
    {
      icon: '🔥',
      value: myStats.dailyStreak,
      label: `יום${myStats.dailyStreak === 1 ? '' : ' רצוף'}`,
      color: 'text-orange-400',
      bg: 'bg-orange-900/20',
    },
    ...(global
      ? [
          {
            icon: '👥',
            value: global.totalVisitors.toLocaleString('he-IL'),
            label: 'לומדים בקהילה',
            color: 'text-text',
            bg: 'bg-surface',
          },
          {
            icon: '✅',
            value: global.totalLessonsCompleted.toLocaleString('he-IL'),
            label: 'יחידות נלמדו (כולל)',
            color: 'text-green-400',
            bg: 'bg-green-900/20',
          },
        ]
      : [
          {
            icon: '🏛️',
            value: '1,000+',
            label: 'מובילי AI',
            color: 'text-text',
            bg: 'bg-surface',
          },
        ]),
  ];

  return (
    <section
      className="mb-10 p-5 sm:p-6 rounded-2xl border border-border bg-bg shadow-sm"
      aria-label="סטטיסטיקות למידה"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-sm font-semibold text-muted uppercase tracking-wide">
          הסטטיסטיקות שלי
        </h2>
        {global && (
          <span className="inline-flex items-center gap-1 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            עדכון בזמן אמת
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} rounded-xl p-3 sm:p-4 text-center transition-transform hover:scale-105`}
          >
            <div className="text-2xl mb-1" aria-hidden="true">{stat.icon}</div>
            <p className={`font-heading font-black text-xl sm:text-2xl leading-none ${stat.color}`}>
              {'total' in stat ? `${stat.value}/${stat.total}` : stat.value}
            </p>
            <p className="text-xs text-muted mt-1 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
      {global && (
        <p className="text-xs text-muted/50 mt-3 text-center">
          📡 נתונים בזמן אמת מהקהילה
        </p>
      )}
    </section>
  );
}
