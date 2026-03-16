'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSE_CATALOG, DOMAINS, PATHS } from '@/data/course-catalog';
import { loadProgress } from '@/lib/progress';
import { trackPageView } from '@/lib/analytics';
import { LearningPath, ProgressState } from '@/types';
import DomainCard from './DomainCard';
import PathSelector from './PathSelector';
import ProgressRing from './ProgressRing';
import LiveStats from './LiveStats';
import SocialShare from '../course/SocialShare';

// ─── Hero SVG ────────────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      className="w-full h-full"
      aria-hidden="true"
      fill="none"
    >
      {/* soft glow rings around center */}
      <circle cx="160" cy="140" r="110" fill="#d97757" opacity="0.05" />
      <circle cx="160" cy="140" r="80" fill="#d97757" opacity="0.07" />

      {/* connection lines */}
      <line x1="160" y1="140" x2="75"  y2="72"  stroke="#d97757" strokeWidth="1.5" opacity="0.35" />
      <line x1="160" y1="140" x2="248" y2="72"  stroke="#d97757" strokeWidth="1.5" opacity="0.35" />
      <line x1="160" y1="140" x2="55"  y2="185" stroke="#6a9bcc" strokeWidth="1.5" opacity="0.35" />
      <line x1="160" y1="140" x2="265" y2="185" stroke="#6a9bcc" strokeWidth="1.5" opacity="0.35" />
      <line x1="160" y1="140" x2="160" y2="44"  stroke="#d97757" strokeWidth="2"   opacity="0.4"  />
      <line x1="160" y1="140" x2="95"  y2="215" stroke="#6a9bcc" strokeWidth="1"   opacity="0.25" />
      <line x1="160" y1="140" x2="225" y2="215" stroke="#6a9bcc" strokeWidth="1"   opacity="0.25" />
      {/* cross connections */}
      <line x1="75"  y1="72"  x2="248" y2="72"  stroke="#6a9bcc" strokeWidth="1"   opacity="0.18" />
      <line x1="55"  y1="185" x2="265" y2="185" stroke="#d97757" strokeWidth="1"   opacity="0.18" />

      {/* satellite nodes */}
      <circle cx="75"  cy="72"  r="16" fill="#6a9bcc" opacity="0.75" />
      <circle cx="248" cy="72"  r="13" fill="#6a9bcc" opacity="0.65" />
      <circle cx="55"  cy="185" r="11" fill="#d97757" opacity="0.55" />
      <circle cx="265" cy="185" r="13" fill="#d97757" opacity="0.55" />
      <circle cx="160" cy="44"  r="9"  fill="#d97757" opacity="0.65" />
      <circle cx="95"  cy="215" r="7"  fill="#6a9bcc" opacity="0.45" />
      <circle cx="225" cy="215" r="7"  fill="#6a9bcc" opacity="0.45" />

      {/* micro dots */}
      <circle cx="38"  cy="115" r="4" fill="#d97757" opacity="0.35" />
      <circle cx="285" cy="125" r="4" fill="#6a9bcc" opacity="0.35" />
      <circle cx="130" cy="255" r="4" fill="#d97757" opacity="0.3"  />
      <circle cx="195" cy="258" r="3" fill="#6a9bcc" opacity="0.3"  />

      {/* node labels */}
      <text x="75"  y="77"  textAnchor="middle" fontSize="9.5" fill="white" fontFamily="Heebo,sans-serif" fontWeight="600">ענן</text>
      <text x="248" y="77"  textAnchor="middle" fontSize="9"   fill="white" fontFamily="Heebo,sans-serif" fontWeight="600">אתיקה</text>
      <text x="55"  y="190" textAnchor="middle" fontSize="9"   fill="white" fontFamily="Heebo,sans-serif" fontWeight="600">שירות</text>
      <text x="265" y="190" textAnchor="middle" fontSize="9"   fill="white" fontFamily="Heebo,sans-serif" fontWeight="600">RAG</text>

      {/* central node */}
      <circle cx="160" cy="140" r="42" fill="#d97757" />
      <circle cx="160" cy="140" r="50" fill="none" stroke="#d97757" strokeWidth="2.5" opacity="0.25" />
      <circle cx="160" cy="140" r="60" fill="none" stroke="#d97757" strokeWidth="1.5" opacity="0.12" />
      <text x="160" y="150" textAnchor="middle" fontSize="28" aria-hidden="true">🚀</text>
    </svg>
  );
}

// ─── Hero stats strip ────────────────────────────────────────────────────────
const HERO_STATS = [
  { value: String(COURSE_CATALOG.length), label: 'יחידות למידה' },
  { value: '6',      label: 'תחומי ידע' },
  { value: '1,000+', label: 'מובילי AI' },
  { value: 'חינם',   label: 'לחלוטין' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    trackPageView();
  }, []);

  const completedModules = progress?.completedModules ?? [];
  const totalCourses     = COURSE_CATALOG.length;
  const overallPct       = Math.round((completedModules.length / totalCourses) * 100);

  const firstIncompleteCourse = COURSE_CATALOG.find(
    c => !completedModules.includes(c.courseNumber),
  );
  const ctaSlug = firstIncompleteCourse?.slug ?? 'ai-literacy';

  return (
    <div className="min-h-screen bg-bg">

      {/* ══════════════════════════════ HERO ═════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-border">
        {/* gradient backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(217,119,87,.12) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 60% 50% at 90% 100%, rgba(106,155,204,.10) 0%, transparent 55%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          {/* two-col layout — text + illustration */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-14">

            {/* Illustration */}
            <div
              className="w-52 h-44 md:w-72 md:h-60 flex-shrink-0 animate-fade-in"
              aria-hidden="true"
            >
              <HeroIllustration />
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-right animate-slide-up">
              {/* badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-5">
                🏛️ אקדמיית AI למגזר הציבורי
              </div>

              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-black text-text mb-3 leading-none tracking-tight">
                המקפצה
              </h1>
              <p className="text-lg md:text-xl text-muted font-medium mb-2 leading-snug">
                מערכת ההפעלה של מנהיגות AI בממשלת ישראל
              </p>
              <p className="text-sm text-muted/70 max-w-md mb-7 leading-relaxed mx-auto md:mx-0">
                {totalCourses} יחידות מעשיות — מאוריינות בסיסית ועד RAG, ענן וניהול ידע.
                הקורס שיקפיץ כל מוביל AI בממשלה.
              </p>

              {/* CTA */}
              <Link
                href={`/course/${ctaSlug}/`}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent text-white font-heading font-bold text-base transition-all hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[44px]"
                aria-label={completedModules.length > 0 ? 'המשך ללמוד' : 'התחל ללמוד'}
              >
                {completedModules.length > 0 ? 'המשך ללמוד' : 'התחל ללמוד'}
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border/60">
            {HERO_STATS.map(s => (
              <div key={s.label} className="text-center md:text-right">
                <p className="font-heading font-black text-2xl sm:text-3xl text-accent leading-none">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════ MAIN ════════════════════════════════ */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Overall progress (only when started) ── */}
        {completedModules.length > 0 && (
          <section
            className="mb-8 p-5 sm:p-6 rounded-2xl border border-border bg-bg shadow-sm"
            aria-label="ההתקדמות שלי"
          >
            <div className="flex flex-wrap items-center gap-5">
              <ProgressRing percentage={overallPct} size={76} strokeWidth={6} />
              <div className="flex-1 min-w-[140px]">
                <p className="font-heading font-bold text-text text-xl">
                  {completedModules.length} מתוך {totalCourses} יחידות
                </p>
                <p className="text-sm text-muted">
                  {overallPct === 100
                    ? '🎉 השלמת את כל הקורס! כל הכבוד!'
                    : `${overallPct}% הושלם — ממשיכים!`}
                </p>
              </div>
              <SocialShare
                title="המקפצה — אקדמיית AI ממשלתית"
                url="https://avi1840.github.io/ai-academy/"
                description={`${overallPct}% ✨ — השלמתי ${completedModules.length} יחידות מתוך ${totalCourses} בקורס המקפצה`}
                variant="compact"
              />
            </div>
          </section>
        )}

        {/* ── Live Stats ── */}
        <LiveStats completedCount={completedModules.length} />

        {/* ── Learning Paths ── */}
        <section className="mb-12" aria-label="מסלולי למידה">
          <h2 className="font-heading text-xl font-bold text-text mb-4">מסלולי למידה</h2>
          <PathSelector selectedPath={selectedPath} onSelect={setSelectedPath} />
        </section>

        {/* ── Domain Cards ── */}
        <section className="mb-12" aria-label="תחומי למידה">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-xl font-bold text-text">
              תחומי ידע
            </h2>
            {selectedPath && (
              <button
                onClick={() => setSelectedPath(null)}
                className="text-xs text-accent hover:underline min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="הצג את כל התחומים"
              >
                הצג הכל
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOMAINS.map(domain => {
              const courses = COURSE_CATALOG.filter(c => domain.courses.includes(c.courseNumber));
              const filteredCourses = selectedPath
                ? courses.filter(c => c.path === selectedPath)
                : courses;
              const completedCount = courses.filter(c =>
                completedModules.includes(c.courseNumber),
              ).length;
              if (selectedPath && filteredCourses.length === 0) return null;
              return (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  courses={selectedPath ? filteredCourses : courses}
                  completedCount={completedCount}
                />
              );
            })}
          </div>
        </section>

        {/* ── All Courses List ── */}
        <section className="mb-12" aria-label="כל היחידות">
          <h2 className="font-heading text-xl font-bold text-text mb-5">כל היחידות</h2>
          <div className="space-y-2">
            {COURSE_CATALOG.map(course => {
              const isCompleted  = completedModules.includes(course.courseNumber);
              const isHighlighted = !selectedPath || course.path === selectedPath;
              const domainInfo   = DOMAINS.find(d => d.id === course.domain);

              return (
                <Link
                  key={course.slug}
                  href={`/course/${course.slug}/`}
                  className={`group flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-200
                    ${isHighlighted
                      ? 'border-border bg-bg hover:border-accent/40 hover:shadow-sm hover:-translate-y-px cursor-pointer'
                      : 'border-border/40 bg-bg/40 opacity-40 pointer-events-none'
                    }
                    ${isCompleted ? 'bg-green-900/20 border-green-800/40' : ''}
                  `}
                  tabIndex={isHighlighted ? 0 : -1}
                  aria-disabled={!isHighlighted}
                >
                  {/* number badge */}
                  <span
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-heading font-bold flex-shrink-0 transition-colors
                      ${isCompleted
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-accent-light text-accent group-hover:bg-accent group-hover:text-white'
                      }
                    `}
                  >
                    {isCompleted ? '✓' : course.courseNumber}
                  </span>

                  {/* domain icon */}
                  {domainInfo && (
                    <span className="text-lg hidden sm:block flex-shrink-0" aria-hidden="true">
                      {domainInfo.icon}
                    </span>
                  )}

                  {/* text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-text text-sm leading-snug">{course.title}</p>
                    <p className="text-xs text-muted truncate mt-0.5 hidden sm:block">{course.description}</p>
                  </div>

                  {/* meta */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted hidden md:block">{course.duration}</span>
                    <svg
                      className="w-4 h-4 text-muted/40 group-hover:text-accent transition-colors rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted">
            נבנה ע״י{' '}
            <span className="font-semibold text-text">אביעד יצחקי</span>
          </p>
          <p className="text-xs text-muted/60 mt-1">מוביל AI ושותפויות, מינהלי גמלאות ביטוח לאומי</p>
          <div className="mt-4 flex justify-center">
            <SocialShare
              title="המקפצה — אקדמיית AI ממשלתית"
              url="https://avi1840.github.io/ai-academy/"
              description="15 יחידות למידה חינמיות ב-AI למובילי המגזר הציבורי בישראל 🏛️"
            />
          </div>
        </footer>
      </main>
    </div>
  );
}
