/**
 * Analytics module — tracks user events locally + syncs to Firebase when configured.
 *
 * HOW TO ENABLE FIREBASE:
 * 1. Create a Firebase project: https://console.firebase.google.com
 * 2. Enable Realtime Database (choose "start in test mode" for development)
 * 3. Add to .env.local:
 *    NEXT_PUBLIC_FIREBASE_DB_URL=https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com
 * 4. In Firebase Console → Realtime Database → Rules, set:
 *    { "rules": { ".read": false, ".write": true } }  ← for launch, tighten later
 *
 * WITHOUT FIREBASE: All tracking is local (localStorage) — still shows the user their own stats.
 */

const STORAGE_KEY = 'hamakpetza_analytics';
const USER_ID_KEY = 'hamakpetza_uid';

export interface AnalyticsData {
  userId: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  lessonsCompleted: number[];
  lessonCompletionDates: Record<number, string>; // courseNumber → ISO date
  learningMinutes: number;
  dailyStreak: number;
  lastStreakDate: string | null;
}

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let uid = localStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}

function loadAnalytics(): AnalyticsData {
  if (typeof window === 'undefined') {
    return defaultAnalytics('ssr');
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AnalyticsData;
  } catch {
    // corrupted data — start fresh
  }
  return defaultAnalytics(getOrCreateUserId());
}

function defaultAnalytics(userId: string): AnalyticsData {
  const now = new Date().toISOString();
  return {
    userId,
    firstVisit: now,
    lastVisit: now,
    totalVisits: 0,
    lessonsCompleted: [],
    lessonCompletionDates: {},
    learningMinutes: 0,
    dailyStreak: 0,
    lastStreakDate: null,
  };
}

function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked
  }
}

/** Calculate streak: +1 if last streak date was yesterday, reset if older, keep if today */
function updateStreak(data: AnalyticsData): AnalyticsData {
  const today = new Date().toISOString().slice(0, 10);
  if (data.lastStreakDate === today) return data; // already counted today
  if (!data.lastStreakDate) {
    return { ...data, dailyStreak: 1, lastStreakDate: today };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.lastStreakDate === yesterday) {
    return { ...data, dailyStreak: data.dailyStreak + 1, lastStreakDate: today };
  }
  // streak broken
  return { ...data, dailyStreak: 1, lastStreakDate: today };
}

// ─── Firebase REST helpers ──────────────────────────────────────────────────

const firebaseUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_FIREBASE_DB_URL;
  return url ?? null;
};

async function firebaseIncrement(path: string, amount = 1): Promise<void> {
  const base = firebaseUrl();
  if (!base) return; // Firebase not configured — silent
  try {
    // Read → increment → write (simple, not transactional, fine for counters with low concurrency)
    const res = await fetch(`${base}/${path}.json`);
    const current: number = res.ok ? ((await res.json()) as number | null) ?? 0 : 0;
    await fetch(`${base}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(current + amount),
    });
  } catch {
    // Network error — analytics are non-critical, swallow
  }
}

async function firebaseSet(path: string, value: unknown): Promise<void> {
  const base = firebaseUrl();
  if (!base) return;
  try {
    await fetch(`${base}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    });
  } catch {
    // non-critical
  }
}

export async function fetchGlobalStats(): Promise<{
  totalVisitors: number;
  totalLessonsCompleted: number;
  activeToday: number;
} | null> {
  const base = firebaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/globalStats.json`);
    if (!res.ok) return null;
    const data = await res.json() as {
      totalVisitors?: number;
      totalLessonsCompleted?: number;
      activeToday?: number;
    } | null;
    return {
      totalVisitors: data?.totalVisitors ?? 0,
      totalLessonsCompleted: data?.totalLessonsCompleted ?? 0,
      activeToday: data?.activeToday ?? 0,
    };
  } catch {
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Call once on app load */
export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  let data = loadAnalytics();
  data = updateStreak(data);
  data.totalVisits += 1;
  data.lastVisit = new Date().toISOString();
  if (!data.userId) data.userId = getOrCreateUserId();
  saveAnalytics(data);

  // Fire-and-forget to Firebase
  const today = new Date().toISOString().slice(0, 10);
  // Count unique visitors only once per browser
  const alreadyCounted = localStorage.getItem('hamakpetza_counted');
  if (!alreadyCounted) {
    localStorage.setItem('hamakpetza_counted', '1');
    void firebaseIncrement('globalStats/totalVisitors', 1);
  }
  void firebaseSet(`visitors/${data.userId}/lastSeen`, today);
  void firebaseSet(`visitors/${data.userId}/streak`, data.dailyStreak);
  void firebaseIncrement(`dailyActive/${today}`, 1);
}

/** Call when a lesson is marked complete */
export function trackLessonComplete(courseNumber: number, durationMinutes: number): void {
  if (typeof window === 'undefined') return;
  let data = loadAnalytics();
  if (!data.lessonsCompleted.includes(courseNumber)) {
    data.lessonsCompleted.push(courseNumber);
    data.lessonCompletionDates[courseNumber] = new Date().toISOString();
    data.learningMinutes += durationMinutes;
    saveAnalytics(data);
    // Push to Firebase
    void firebaseIncrement('globalStats/totalLessonsCompleted');
    void firebaseSet(`visitors/${data.userId}/lessonsCompleted`, data.lessonsCompleted.length);
    void firebaseIncrement(`courseStats/${courseNumber}/completions`);
  }
}

/** Get local analytics for display */
export function getMyStats(): AnalyticsData {
  return loadAnalytics();
}

/** Returns the configured Firebase DB URL (or null if not set) */
export function getFirebaseDbUrl(): string | null {
  return process.env.NEXT_PUBLIC_FIREBASE_DB_URL ?? null;
}

/** Total learning time in hours/minutes label */
export function formatLearningTime(minutes: number): string {
  if (minutes < 60) return `${minutes} דקות`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} שעות ו-${mins} דקות` : `${hours} שעות`;
}
