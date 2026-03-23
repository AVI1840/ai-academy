'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSE_CATALOG, DOMAINS } from '@/data/course-catalog';
import { loadProgress } from '@/lib/progress';
import { trackPageView, fetchGlobalStats } from '@/lib/analytics';
import { LearningPath, ProgressState } from '@/types';
import DomainCard from './DomainCard';
import PathSelector from './PathSelector';
import ProgressRing from './ProgressRing';
import LiveStats from './LiveStats';
import NationalContextSection from './NationalContextSection';
import MissionSection from './MissionSection';
import CapabilityMapSection from './CapabilityMapSection';
import UseCaseAreasSection from './UseCaseAreasSection';
import EcosystemSection from './EcosystemSection';
import SocialShare from '../course/SocialShare';
import ThemeToggle from '../layout/ThemeToggle';

const WHO_FOR = [
  { icon: '💡', label: 'מובילי חדשנות' },
  { icon: '🖥️', label: 'מנהלי דיגיטל ומערכות מידע' },
  { icon: '📋', label: 'צוותי מדיניות ואסטרטגיה' },
  { icon: '📊', label: 'אנליסטים ומובילי דאטה' },
  { icon: '🤝', label: 'צוותי שירות לאזרח' },
  { icon: '🏛️', label: 'יזמי GovTech' },
];

export default function Dashboard() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    trackPageView();
    fetchGlobalStats().then(s => { if (s) setVisitorCount(s.totalVisitors); });
  }, []);

  const completedModules = progress?.completedModules ?? [];
  const totalCourses = COURSE_CATALOG.length;
  const overallPct = Math.round((completedModules.length / totalCourses) * 100);
  const firstIncompleteCourse = COURSE_CATALOG.find(c => !completedModules.includes(c.courseNumber));
  const ctaSlug = firstIncompleteCourse?.slug ?? 'ai-literacy';

  return (
    <div className="min-h-screen bg-bg">

      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden">
        {/* Gradient mesh */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 70% -20%, rgba(217,119,87,.18) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(106,155,204,.12) 0%, transparent 50%), radial-gradient(ellipse 40% 30% at 100% 80%, rgba(217,119,87,.08) 0%, transparent 50%)',
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Hero image — right side (RTL start), large & visible */}
        <div className="absolute top-0 right-0 bottom-0 w-[48%] pointer-events-none overflow-hidden hidden lg:block" aria-hidden="true">
          <img
            src="/ai-academy/images/amb-hero.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.48, objectPosition: 'center center' }}
          />
          {/* Fade left toward text */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to left, transparent 20%, var(--color-bg) 80%)'
          }} />
          {/* Vignette top/bottom */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 18%, transparent 82%, var(--color-bg) 100%)'
          }} />
        </div>
        {/* Left accent — amber→navy fluid waves, warm+cool contrast */}
        <div className="absolute top-0 left-0 bottom-0 w-72 pointer-events-none overflow-hidden hidden xl:block" aria-hidden="true">
          <img
            src="/ai-academy/images/amb-waves.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.28, objectPosition: 'center' }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, transparent 0%, var(--color-bg) 85%)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 20%, transparent 80%, var(--color-bg) 100%)'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-20 pb-16">
          <div className="text-center animate-slide-up">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-accent text-xs font-heading font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              תשתית ראשונית לפלטפורמה לאומית · AI למגזר הציבורי
            </div>

            {/* Title */}
            <h1 className="font-heading font-black text-text leading-[0.9] tracking-tight mb-4" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
              המקפצה
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-muted font-heading font-medium mb-2 max-w-2xl mx-auto leading-snug">
              משדרגים את{' '}
              <span style={{
                background: 'linear-gradient(135deg, #d97753, #6a9bcc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                מערכת ההפעלה
              </span>
              {' '}של המגזר הציבורי
            </p>
            <p className="text-sm text-muted/60 max-w-xl mx-auto mb-10 leading-relaxed">
              {totalCourses} יחידות מעשיות שהופכות עובדי מדינה ממשתמשי AI — למובילי שינוי.
              חינם, ללא הרשמה.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                href={`/course/${ctaSlug}/`}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-white font-heading font-bold text-lg transition-all hover:shadow-[0_8px_30px_rgba(217,119,87,0.3)] hover:-translate-y-0.5 min-h-[44px]"
              >
                {completedModules.length > 0 ? 'המשך ללמוד' : 'התחל ללמוד'}
                <svg className="w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <ThemeToggle />
            </div>

            {/* Stats grid */}
            {(() => {
              const heroStats = [
                { value: String(totalCourses), label: 'יחידות למידה', icon: '📚' },
                { value: '6', label: 'שכבות יכולת', icon: '🧠' },
                {
                  value: visitorCount !== null ? visitorCount.toLocaleString('he-IL') : 'ממשלה',
                  label: visitorCount !== null ? 'לומדים בקהילה' : 'למובילי AI בממשלה',
                  icon: '🏛️',
                },
                { value: 'חינם', label: 'ופתוח לחלוטין', icon: '🔓' },
              ];
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
                  {heroStats.map((s, i) => (
                    <div key={s.label} className="glass-card rounded-2xl p-4 sm:p-5 text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <span className="text-2xl block mb-2" aria-hidden="true">{s.icon}</span>
                      <p className="font-heading font-black text-2xl sm:text-3xl text-accent leading-none">{s.value}</p>
                      <p className="text-xs text-muted mt-1.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
      </header>

      {/* ═══ MAIN ═══ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12">

        {/* ── MISSION ── */}
        <MissionSection />

        {/* ── NATIONAL CONTEXT ── */}
        <NationalContextSection />

        {/* ── WHO IT'S FOR ── */}
        <section className="mb-16 glass-card rounded-2xl p-6 sm:p-8" aria-label="למי זה מיועד">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-5 rounded-full bg-accent" />
            <span className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
              קהל היעד
            </span>
          </div>
          <h2 className="font-heading font-bold text-text text-xl mb-6">
            למי זה מיועד במגזר הציבורי
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {WHO_FOR.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/50 hover:border-accent/20 transition-all">
                <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>
                <span className="text-sm font-heading font-medium text-text/80 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CAPABILITY MAP ── */}
        <CapabilityMapSection />

        {/* ── USE CASES ── */}
        <UseCaseAreasSection />

        {/* ── PROGRESS (if started) ── */}
        {completedModules.length > 0 && (
          <section className="mb-10 glass-card rounded-2xl p-6 sm:p-8 animate-fade-in" aria-label="ההתקדמות שלי">
            <div className="flex flex-wrap items-center gap-6">
              <ProgressRing percentage={overallPct} size={80} strokeWidth={6} />
              <div className="flex-1 min-w-[160px]">
                <p className="font-heading font-bold text-text text-2xl mb-1">
                  {completedModules.length} מתוך {totalCourses} יחידות
                </p>
                <p className="text-sm text-muted">
                  {overallPct === 100 ? '🎉 השלמת את כל הקורס!' : `${overallPct}% הושלם — ממשיכים!`}
                </p>
                <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${overallPct}%` }} />
                </div>
              </div>
              <SocialShare
                title="המקפצה — אקדמיית AI ממשלתית"
                url="https://avi1840.github.io/ai-academy/"
                description={`${overallPct}% — השלמתי ${completedModules.length} יחידות מתוך ${totalCourses} בקורס המקפצה`}
                variant="compact"
              />
            </div>
          </section>
        )}

        {/* ── LIVE STATS ── */}
        <LiveStats completedCount={completedModules.length} />

        {/* ── LEARNING PATHS ── */}
        <section className="mb-14" aria-label="מסלולי למידה">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-bold text-text">מסלולי למידה</h2>
          </div>
          <PathSelector selectedPath={selectedPath} onSelect={setSelectedPath} />
        </section>

        {/* ── DOMAIN CARDS ── */}
        <section className="mb-14" aria-label="תחומי למידה">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-secondary" />
              <h2 className="font-heading text-2xl font-bold text-text">תחומי ידע</h2>
            </div>
            {selectedPath && (
              <button
                onClick={() => setSelectedPath(null)}
                className="text-xs text-accent hover:underline min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                הצג הכל
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOMAINS.map(domain => {
              const courses = COURSE_CATALOG.filter(c => domain.courses.includes(c.courseNumber));
              const filteredCourses = selectedPath ? courses.filter(c => c.path === selectedPath) : courses;
              const completedCount = courses.filter(c => completedModules.includes(c.courseNumber)).length;
              if (selectedPath && filteredCourses.length === 0) return null;
              return (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  courses={selectedPath ? filteredCourses : courses}
                  completedCount={completedCount}
                  completedModules={completedModules}
                />
              );
            })}
          </div>
        </section>

        {/* ── ALL COURSES ── */}
        <section className="mb-14" aria-label="כל היחידות">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-bold text-text">כל היחידות</h2>
          </div>
          <div className="space-y-2">
            {COURSE_CATALOG.map((course, i) => {
              const isCompleted = completedModules.includes(course.courseNumber);
              const isHighlighted = !selectedPath || course.path === selectedPath;
              const domainInfo = DOMAINS.find(d => d.id === course.domain);
              return (
                <Link
                  key={course.slug}
                  href={`/course/${course.slug}/`}
                  className={`group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${isHighlighted ? 'border-border bg-surface/50 hover:border-accent/30 hover:bg-surface hover:shadow-[var(--shadow-card)] hover:-translate-y-px cursor-pointer' : 'border-border/30 bg-bg/30 opacity-30 pointer-events-none'} ${isCompleted ? 'border-green-800/30' : ''}`}
                  tabIndex={isHighlighted ? 0 : -1}
                  aria-disabled={!isHighlighted}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-heading font-bold flex-shrink-0 transition-all ${isCompleted ? 'bg-green-900/30 text-green-400' : 'bg-accent-light text-accent group-hover:bg-accent group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(217,119,87,0.3)]'}`}>
                    {isCompleted ? '✓' : course.courseNumber}
                  </span>
                  {domainInfo && (
                    <span className="text-xl hidden sm:block flex-shrink-0" aria-hidden="true">
                      {domainInfo.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-text text-sm sm:text-base leading-snug">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted truncate mt-0.5 hidden sm:block">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted hidden md:block px-2 py-1 rounded-lg bg-surface">
                      {course.duration}
                    </span>
                    <svg className="w-4 h-4 text-muted/30 group-hover:text-accent transition-all group-hover:-translate-x-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── ECOSYSTEM ── */}
        <EcosystemSection />

        {/* ── FOOTER ── */}
        <footer className="text-center py-12 border-t border-border">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">🚀</span>
            <span className="font-heading text-lg font-bold text-text">המקפצה</span>
          </div>
          <p className="text-sm text-muted">
            נבנה ע״י <span className="font-semibold text-text">אביעד יצחקי</span>
          </p>
          <p className="text-xs text-muted/60 mt-1">
            מוביל AI ושותפויות · מינהלי גמלאות, ביטוח לאומי
          </p>
          <p className="text-xs text-muted/40 mt-1 italic">
            תשתית ראשונית לפלטפורמה לאומית · למגזר הציבורי בישראל
          </p>
          <div className="mt-5 flex justify-center">
            <SocialShare
              title="המקפצה — אקדמיית AI ממשלתית"
              url="https://avi1840.github.io/ai-academy/"
              description={`${totalCourses} יחידות למידה חינמיות ב-AI למובילי המגזר הציבורי בישראל 🏛️`}
            />
          </div>
        </footer>
      </main>
    </div>
  );
}
