'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { COURSE_CATALOG } from '@/data/course-catalog';
import { getFirebaseDbUrl } from '@/lib/analytics';

interface AdminStats {
  totalVisitors: number;
  totalLessonsCompleted: number;
  dailyActive: Record<string, number>;
  courseStats: Record<string, { completions?: number }>;
}

async function fetchAdminStats(dbUrl: string): Promise<AdminStats> {
  const [globalRes, dailyRes, courseRes] = await Promise.all([
    fetch(`${dbUrl}/globalStats.json`),
    fetch(`${dbUrl}/dailyActive.json`),
    fetch(`${dbUrl}/courseStats.json`),
  ]);
  const global = globalRes.ok ? await globalRes.json() : {};
  const daily = dailyRes.ok ? await dailyRes.json() : {};
  const courses = courseRes.ok ? await courseRes.json() : {};
  return {
    totalVisitors: global?.totalVisitors ?? 0,
    totalLessonsCompleted: global?.totalLessonsCompleted ?? 0,
    dailyActive: daily ?? {},
    courseStats: courses ?? {},
  };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dbUrl = getFirebaseDbUrl();

  useEffect(() => {
    if (!dbUrl) { setLoading(false); return; }
    fetchAdminStats(dbUrl)
      .then(s => { setStats(s); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [dbUrl]);

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    return d.toISOString().slice(0, 10);
  }).reverse();

  const maxDaily = stats
    ? Math.max(1, ...last14Days.map(d => stats.dailyActive[d] ?? 0))
    : 1;

  const sortedCourses = stats
    ? COURSE_CATALOG
        .map(c => ({ course: c, count: stats.courseStats[String(c.courseNumber)]?.completions ?? 0 }))
        .sort((a, b) => b.count - a.count)
    : [];

  const maxCompletions = sortedCourses.length > 0 ? Math.max(1, sortedCourses[0].count) : 1;

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-text">לוח בקרה 📊</h1>
            <p className="text-muted text-sm mt-1">נתוני שימוש בפלטפורמה — המקפצה</p>
          </div>
          <Link href="/" className="text-sm text-accent hover:underline font-heading min-h-[44px] flex items-center">
            ← חזרה לבית
          </Link>
        </div>

        {/* No Firebase configured */}
        {!dbUrl && (
          <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
            <span className="text-5xl block mb-5">🔧</span>
            <h2 className="font-heading text-2xl font-bold mb-3 text-text">Firebase לא מוגדר</h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              כדי לאסוף נתוני שימוש אמיתיים, צור פרויקט Firebase Realtime Database חינמי וחבר אותו.
            </p>
            <ol className="text-right space-y-3 text-sm max-w-lg mx-auto bg-surface/50 rounded-xl p-6 border border-border">
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">1.</span>
                <span>גש ל-<a href="https://console.firebase.google.com" className="text-accent underline" target="_blank" rel="noopener noreferrer">console.firebase.google.com</a> וצור פרויקט חדש</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">2.</span>
                <span>בתפריט שמאל: Build → Realtime Database → Create database → Start in test mode</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">3.</span>
                <span>העתק את כתובת ה-URL (נראה כך: <code className="bg-surface px-1.5 py-0.5 rounded text-xs">https://YOUR-PROJECT-default-rtdb.firebaseio.com</code>)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">4.</span>
                <span>צור קובץ <code className="bg-surface px-1.5 py-0.5 rounded text-xs">hamakpetza/.env.local</code> עם השורה:<br />
                  <code className="bg-surface px-1.5 py-0.5 rounded text-xs block mt-1">NEXT_PUBLIC_FIREBASE_DB_URL=https://YOUR-PROJECT-default-rtdb.firebaseio.com</code>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">5.</span>
                <span>גם ב-GitHub → Settings → Secrets and variables → Actions → New secret עם שם <code className="bg-surface px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_FIREBASE_DB_URL</code></span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold flex-shrink-0">6.</span>
                <span>Push → הפלטפורמה תתחיל לאסוף נתונים אוטומטית</span>
              </li>
            </ol>
          </div>
        )}

        {/* Loading */}
        {dbUrl && loading && (
          <div className="text-center text-muted py-20 font-heading">טוען נתונים מ-Firebase...</div>
        )}

        {/* Error */}
        {dbUrl && !loading && error && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-3">⚠️</span>
            <p className="text-muted">לא הצלחנו לטעון נתונים. בדוק שה-URL של Firebase נכון ושהחוקים מאפשרים קריאה.</p>
          </div>
        )}

        {/* Stats */}
        {dbUrl && !loading && !error && stats && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <StatCard icon="👥" value={stats.totalVisitors.toLocaleString('he-IL')} label="מובילים ייחודיים" color="text-accent" />
              <StatCard icon="✅" value={stats.totalLessonsCompleted.toLocaleString('he-IL')} label="שיעורים שהושלמו" color="text-green-400" />
              <StatCard
                icon="📅"
                value={(stats.dailyActive[last14Days[last14Days.length - 1]] ?? 0).toLocaleString('he-IL')}
                label="כניסות היום"
                color="text-secondary"
              />
            </div>

            {/* Daily activity chart */}
            <section className="glass-card rounded-2xl p-6 mb-8">
              <h2 className="font-heading font-bold text-lg mb-5 text-text">פעילות יומית — 14 ימים אחרונים</h2>
              <div className="flex items-end gap-1 h-24">
                {last14Days.map(date => {
                  const count = stats.dailyActive[date] ?? 0;
                  const heightPct = Math.max(4, Math.round((count / maxDaily) * 100));
                  const isToday = date === last14Days[last14Days.length - 1];
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative" title={`${date}: ${count}`}>
                      <span className="absolute -top-5 text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity font-heading font-bold">{count}</span>
                      <div
                        className={`w-full rounded-t-sm transition-all ${isToday ? 'bg-accent' : 'bg-accent/40 group-hover:bg-accent/70'}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-muted/60 font-mono">
                <span>{last14Days[0].slice(5)}</span>
                <span>{last14Days[last14Days.length - 1].slice(5)} (היום)</span>
              </div>
            </section>

            {/* Per-course completions */}
            <section className="glass-card rounded-2xl p-6">
              <h2 className="font-heading font-bold text-lg mb-5 text-text">השלמות לפי קורס</h2>
              {sortedCourses.every(s => s.count === 0) ? (
                <p className="text-muted text-sm text-center py-4">עדיין אין נתוני השלמה — הם יצטברו כשלומדים יסיימו קורסים</p>
              ) : (
                <div className="space-y-3">
                  {sortedCourses.map(({ course, count }) => (
                    <div key={course.slug} className="flex items-center gap-3">
                      <span className="w-6 text-xs text-muted text-center flex-shrink-0 font-heading">{course.courseNumber}</span>
                      <span className="text-sm truncate flex-1 min-w-0 text-text/80">{course.title.split('—')[0].trim()}</span>
                      <div className="w-28 sm:w-40 h-2 bg-border rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((count / maxCompletions) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-accent w-8 text-center flex-shrink-0 font-heading">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <p className="text-center text-xs text-muted/40 mt-10 font-heading">
          המקפצה · נתונים מ-Firebase Realtime Database · עדכון בכל כניסה
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 text-center">
      <span className="text-3xl block mb-2" aria-hidden="true">{icon}</span>
      <p className={`font-heading font-black text-3xl leading-none ${color}`}>{value}</p>
      <p className="text-xs text-muted mt-1.5">{label}</p>
    </div>
  );
}
