'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { DOMAINS, COURSE_CATALOG } from '@/data/course-catalog';
import { loadProgress } from '@/lib/progress';
import type { DomainInfo, CourseFrontmatter } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSlug: string | null;
}

export default function Sidebar({ isOpen, onToggle, currentSlug }: SidebarProps) {
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCompletedModules(loadProgress().completedModules);
    const handleStorage = () => setCompletedModules(loadProgress().completedModules);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Close sidebar on mobile when navigating to a new page
  const handleNavigate = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && isOpen) {
      onToggle();
    }
  }, [isOpen, onToggle]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!navRef.current) return;
      const focusable = navRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      const items = Array.from(focusable);
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[currentIndex < items.length - 1 ? currentIndex + 1 : 0]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[currentIndex > 0 ? currentIndex - 1 : items.length - 1]?.focus();
      } else if (e.key === 'Escape') {
        onToggle();
      }
    },
    [onToggle]
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="ניווט קורסים"
        id="sidebar-nav"
        className={`
          fixed top-0 right-0 h-full z-40
          bg-bg border-l border-border
          overflow-y-auto overflow-x-hidden
          transition-[width] duration-300 ease-in-out
          ${isOpen ? 'w-72' : 'w-0 md:w-16'}
        `}
        onKeyDown={handleKeyDown}
        ref={navRef}
      >
        <div
          className={`
            h-full flex flex-col
            transition-opacity duration-200
            ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}
          `}
        >
          <div className="p-4 border-b border-border flex-shrink-0">
            {isOpen ? (
              <Link
                href="/"
                onClick={handleNavigate}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                <span className="font-heading text-lg font-bold text-text">המקפצה</span>
                <span className="block text-xs text-muted mt-0.5">קורס AI למגזר הציבורי</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="block text-center text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                aria-label="דף הבית — המקפצה"
              >
                🚀
              </Link>
            )}
          </div>

          <div className="flex-1 py-2 overflow-y-auto">
            {DOMAINS.map((domain) => (
              <DomainGroup
                key={domain.id}
                domain={domain}
                isOpen={isOpen}
                currentSlug={currentSlug}
                completedModules={completedModules}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

interface DomainGroupProps {
  domain: DomainInfo;
  isOpen: boolean;
  currentSlug: string | null;
  completedModules: number[];
  onNavigate: () => void;
}

function DomainGroup({ domain, isOpen, currentSlug, completedModules, onNavigate }: DomainGroupProps) {
  const domainCourses = COURSE_CATALOG.filter((c) => domain.courses.includes(c.courseNumber));

  return (
    <div className="mb-1" role="group" aria-label={domain.nameHe}>
      <div className={`flex items-center gap-2 px-4 py-2 text-muted ${!isOpen ? 'justify-center' : ''}`}>
        <span className="text-base flex-shrink-0" role="img" aria-label={domain.nameHe}>
          {domain.icon}
        </span>
        {isOpen && (
          <span className="text-xs font-heading font-semibold tracking-wide" style={{ color: domain.color }}>
            {domain.nameHe}
          </span>
        )}
      </div>
      {isOpen && domainCourses.map((course) => (
        <CourseLink
          key={course.slug}
          course={course}
          isActive={currentSlug === course.slug}
          isCompleted={completedModules.includes(course.courseNumber)}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

interface CourseLinkProps {
  course: CourseFrontmatter;
  isActive: boolean;
  isCompleted: boolean;
  onNavigate: () => void;
}

function CourseLink({ course, isActive, isCompleted, onNavigate }: CourseLinkProps) {
  const displayTitle = course.title.includes('—')
    ? course.title.split('—')[0].trim()
    : course.title;

  return (
    <Link
      href={`/course/${course.slug}/`}
      onClick={onNavigate}
      className={`
        flex items-center gap-2 px-6 py-2 text-sm
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset
        min-h-[44px]
        ${isActive
          ? 'bg-accent-light text-accent font-semibold border-is-2 border-accent'
          : 'text-text/70 hover:bg-accent-light/50 hover:text-text'
        }
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`${course.title}${isCompleted ? ' — הושלם' : ''}`}
    >
      <span className="w-5 text-center flex-shrink-0">
        {isCompleted
          ? <span className="text-green-600" aria-hidden="true">✓</span>
          : <span className="text-muted text-xs">{course.courseNumber}</span>
        }
      </span>
      <span className="truncate">{displayTitle}</span>
    </Link>
  );
}
