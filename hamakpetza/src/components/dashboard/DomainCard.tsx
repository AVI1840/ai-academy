import Link from 'next/link';
import { DomainInfo, CourseFrontmatter } from '@/types';
import ProgressRing from './ProgressRing';

interface DomainCardProps {
  domain: DomainInfo;
  courses: CourseFrontmatter[];
  completedCount: number;
}

export default function DomainCard({ domain, courses, completedCount }: DomainCardProps) {
  const percentage = courses.length > 0
    ? Math.round((completedCount / courses.length) * 100)
    : 0;

  const isAllDone = completedCount === courses.length && courses.length > 0;

  // Find the next course to study
  const nextCourse = courses.find((_, i) => i >= completedCount) ?? courses[0];

  return (
    <div
      className="group relative rounded-2xl border border-border bg-bg overflow-hidden
                 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80"
    >
      {/* Colored top accent bar */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: domain.color }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-label={domain.nameHe}>
                {domain.icon}
              </span>
              {isAllDone && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 font-medium">
                  הושלם ✓
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-text text-base leading-tight">
              {domain.nameHe}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              {completedCount}/{courses.length} יחידות
            </p>
          </div>
          <ProgressRing
            percentage={percentage}
            color={domain.color}
            size={52}
            strokeWidth={5}
          />
        </div>

        {/* Course list */}
        <ul className="space-y-1.5" role="list">
          {courses.map((course, idx) => {
            const isDone = idx < completedCount;
            return (
              <li key={course.slug}>
                <Link
                  href={`/course/${course.slug}/`}
                  className="flex items-center gap-2 text-sm text-text/70 hover:text-accent transition-colors group/link min-h-[44px]"
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-colors
                      ${isDone
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-border text-muted group-hover/link:bg-accent-light group-hover/link:text-accent'
                      }`}
                    aria-hidden="true"
                  >
                    {isDone ? '✓' : '○'}
                  </span>
                  <span className="truncate leading-tight group-hover/link:text-accent transition-colors">
                    {course.title.split('—')[0].trim()}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Start / Continue link */}
        {courses.length > 0 && (
          <Link
            href={`/course/${nextCourse.slug}/`}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-colors min-h-[44px]"
            style={{ color: domain.color }}
            aria-label={`${isAllDone ? 'חזור ל' : completedCount > 0 ? 'המשך ל' : 'התחל '}${domain.nameHe}`}
          >
            <span>{isAllDone ? 'חזור לתחום' : completedCount > 0 ? 'המשך' : 'התחל'}</span>
            <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
