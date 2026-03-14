'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSE_CATALOG, DOMAINS } from '@/data/course-catalog';
import { loadProgress } from '@/lib/progress';
import { LearningPath, ProgressState } from '@/types';
import DomainCard from './DomainCard';
import PathSelector from './PathSelector';
import ProgressRing from './ProgressRing';
import WhatsAppShare from '../course/WhatsAppShare';

export default function Dashboard() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const completedModules = progress?.completedModules ?? [];
  const overallPct = Math.round((completedModules.length / 12) * 100);

  return (
    <div className="reading-column py-12">
      {/* Hero */}
      <header className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-black text-text mb-3">
          המקפצה
        </h1>
        <p className="text-lg text-muted mb-2">קורס AI למובילי המגזר הציבורי</p>
        <p className="text-sm text-muted/70 max-w-lg mx-auto leading-relaxed">
          12 יחידות למידה מעשיות בבינה מלאכותית — מבסיס ועד מתקדם.
          הקורס שיקפיץ את כל מובילי ה-AI בממשלה קדימה.
        </p>
      </header>

      {/* Overall progress */}
      <div className="flex items-center justify-center gap-6 mb-10 p-6 rounded-2xl border border-border bg-bg">
        <ProgressRing percentage={overallPct} size={80} strokeWidth={6} />
        <div>
          <p className="font-heading font-bold text-text text-lg">
            {completedModules.length} מתוך 12 יחידות
          </p>
          <p className="text-sm text-muted">
            {overallPct === 0 ? 'בואו נתחיל!' : overallPct === 100 ? '🎉 סיימת את כל הקורס!' : 'ממשיכים קדימה'}
          </p>
        </div>
        <WhatsAppShare
          title={`${overallPct}% התקדמות בקורס המקפצה`}
          url="https://avi1840.github.io/ai-academy/"
          type="progress"
        />
      </div>

      {/* Learning paths */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-text mb-4">מסלולי למידה</h2>
        <PathSelector selectedPath={selectedPath} onSelect={setSelectedPath} />
      </section>

      {/* Domain cards */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-text mb-6">תחומי למידה</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map(domain => {
            const courses = COURSE_CATALOG.filter(c => domain.courses.includes(c.courseNumber));
            const filteredCourses = selectedPath
              ? courses.filter(c => c.path === selectedPath)
              : courses;
            const completedCount = courses.filter(c => completedModules.includes(c.courseNumber)).length;

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

      {/* All courses list */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-text mb-6">כל היחידות</h2>
        <div className="space-y-3">
          {COURSE_CATALOG.map(course => {
            const isCompleted = completedModules.includes(course.courseNumber);
            const isHighlighted = !selectedPath || course.path === selectedPath;
            return (
              <Link
                key={course.slug}
                href={`/course/${course.slug}/`}
                className={`
                  block p-4 rounded-xl border transition-all
                  ${isHighlighted
                    ? 'border-border bg-bg hover:border-accent/40 hover:shadow-sm'
                    : 'border-border/50 bg-bg/50 opacity-40'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-heading font-bold flex-shrink-0
                    ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-accent-light text-accent'}
                  `}>
                    {isCompleted ? '✓' : course.courseNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-text text-sm truncate">{course.title}</h3>
                    <p className="text-xs text-muted truncate">{course.description}</p>
                  </div>
                  <span className="text-xs text-muted flex-shrink-0">{course.duration}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Author credit */}
      <footer className="text-center py-8 border-t border-border">
        <p className="text-sm text-muted">
          נבנה ע״י <span className="font-semibold text-text">אביעד יצחקי</span>
        </p>
        <p className="text-xs text-muted/70 mt-1">מוביל AI ושותפויות, מינהלי גמלאות ביטוח לאומי</p>
      </footer>
    </div>
  );
}
