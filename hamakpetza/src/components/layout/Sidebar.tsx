'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { DOMAINS, COURSE_CATALOG } from '@/data/course-catalog';
import { loadProgress } from '@/lib/progress';
import type { DomainInfo, CourseFrontmatter } from '@/types';

interface SidebarProps { isOpen: boolean; onToggle: () => void; currentSlug: string | null; }

export default function Sidebar({ isOpen, onToggle, currentSlug }: SidebarProps) {
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCompletedModules(loadProgress().completedModules);
    const handleStorage = () => setCompletedModules(loadProgress().completedModules);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleNavigate = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && isOpen) onToggle();
  }, [isOpen, onToggle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!navRef.current) return;
    const items = Array.from(navRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    const idx = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[idx < items.length - 1 ? idx + 1 : 0]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[idx > 0 ? idx - 1 : items.length - 1]?.focus(); }
    else if (e.key === 'Escape') onToggle();
  }, [onToggle]);

  const totalCompleted = completedModules.length;
  const totalCourses = COURSE_CATALOG.length;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={onToggle} aria-hidden="true" />}
      <nav aria-label="ניווט קורסים" id="sidebar-nav" ref={navRef} onKeyDown={handleKeyDown}
        className={`fixed top-0 right-0 h-full z-40 bg-surface/95 backdrop-blur-xl border-l border-border overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-0'}`}>
        <div className={`h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header */}
          <div className="p-5 border-b border-border flex-shrink-0">
            <Link href="/" onClick={handleNavigate} className="block">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🚀</span>
                <div>
                  <span className="font-heading text-lg font-bold text-text block leading-tight">המקפצה</span>
                  <span className="text-[10px] text-muted">אקדמיית AI למגזר הציבורי</span>
                </div>
              </div>
            </Link>
            {totalCompleted > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${Math.round((totalCompleted / totalCourses) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-muted font-heading">{totalCompleted}/{totalCourses}</span>
              </div>
            )}
          </div>

          {/* Course list */}
          <div className="flex-1 py-3 overflow-y-auto">
            {DOMAINS.map(domain => (
              <DomainGroup key={domain.id} domain={domain} isOpen={isOpen} currentSlug={currentSlug} completedModules={completedModules} onNavigate={handleNavigate} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

function DomainGroup({ domain, isOpen, currentSlug, completedModules, onNavigate }: { domain: DomainInfo; isOpen: boolean; currentSlug: string | null; completedModules: number[]; onNavigate: () => void }) {
  const domainCourses = COURSE_CATALOG.filter(c => domain.courses.includes(c.courseNumber));
  return (
    <div className="mb-1" role="group" aria-label={domain.nameHe}>
      <div className="flex items-center gap-2 px-5 py-2 text-muted">
        <span className="text-sm flex-shrink-0">{domain.icon}</span>
        {isOpen && <span className="text-[11px] font-heading font-bold tracking-wide uppercase" style={{ color: domain.color }}>{domain.nameHe}</span>}
      </div>
      {isOpen && domainCourses.map(course => (
        <CourseLink key={course.slug} course={course} isActive={currentSlug === course.slug} isCompleted={completedModules.includes(course.courseNumber)} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function CourseLink({ course, isActive, isCompleted, onNavigate }: { course: CourseFrontmatter; isActive: boolean; isCompleted: boolean; onNavigate: () => void }) {
  const displayTitle = course.title.includes('—') ? course.title.split('—')[0].trim() : course.title;
  return (
    <Link href={`/course/${course.slug}/`} onClick={onNavigate}
      className={`flex items-center gap-2.5 px-6 py-2 text-sm transition-all duration-150 min-h-[40px] ${isActive ? 'bg-accent/10 text-accent font-semibold border-is-2 border-accent' : 'text-text/60 hover:bg-accent-light/40 hover:text-text'}`}
      aria-current={isActive ? 'page' : undefined}>
      <span className="w-5 text-center flex-shrink-0">
        {isCompleted ? <span className="text-green-400 text-xs">✓</span> : <span className="text-muted/50 text-[11px]">{course.courseNumber}</span>}
      </span>
      <span className="truncate text-[13px]">{displayTitle}</span>
    </Link>
  );
}
