'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DOMAINS, COURSE_CATALOG } from '@/data/course-catalog';
import { loadProgress } from '@/lib/progress';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSlug: string | null;
}

export default function Sidebar({ isOpen, onToggle, currentSlug }: SidebarProps) {
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  useEffect(() => {
    setCompletedModules(loadProgress().completedModules);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full z-40 bg-bg border-l border-border
          transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'w-72' : 'w-0 md:w-16'}
        `}
        role="navigation"
        aria-label="ניווט קורסים"
      >
        <div className={`${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity duration-200`}>
          {/* Logo / Header */}
          <div className="p-4 border-b border-border">
            {isOpen ? (
              <Link href="/" className="block">
                <span className="font-heading text-lg font-bold text-text">המקפצה</span>
                <span className="block text-xs text-muted mt-0.5">קורס AI למגזר הציבורי</span>
              </Link>
            ) : (
              <Link href="/" className="block text-center text-xl" aria-label="דף הבית">🚀</Link>
            )}
          </div>

          {/* Domain groups */}
          <nav className="py-2">
            {DOMAINS.map(domain => {
              const domainCourses = COURSE_CATALOG.filter(c => domain.courses.includes(c.courseNumber));
              return (
                <div key={domain.id} className="mb-1">
                  {/* Domain header */}
                  <div className={`flex items-center gap-2 px-4 py-2 text-muted ${!isOpen && 'justify-center'}`}>
                    <span className="text-base" role="img" aria-label={domain.nameHe}>{domain.icon}</span>
                    {isOpen && (
                      <span className="text-xs font-heading font-semibold uppercase tracking-wide">
                        {domain.nameHe}
                      </span>
                    )}
                  </div>

                  {/* Course links */}
                  {isOpen && domainCourses.map(course => {
                    const isActive = currentSlug === course.slug;
                    const isCompleted = completedModules.includes(course.courseNumber);
                    return (
                      <Link
                        key={course.slug}
                        href={`/course/${course.slug}/`}
                        className={`
                          flex items-center gap-2 px-6 py-2 text-sm transition-colors
                          ${isActive
                            ? 'bg-accent-light text-accent font-semibold border-l-2 border-accent'
                            : 'text-text/70 hover:bg-accent-light/50 hover:text-text'
                          }
                        `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="w-5 text-center flex-shrink-0">
                          {isCompleted ? '✓' : `${course.courseNumber}`}
                        </span>
                        <span className="truncate">{course.title.split('—')[0].trim()}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
