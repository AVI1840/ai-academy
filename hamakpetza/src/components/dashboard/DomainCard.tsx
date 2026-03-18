import Link from 'next/link';
import { DomainInfo, CourseFrontmatter } from '@/types';
import ProgressRing from './ProgressRing';

interface DomainCardProps {
  domain: DomainInfo;
  courses: CourseFrontmatter[];
  completedCount: number;
  completedModules?: number[];
}

export default function DomainCard({ domain, courses, completedCount, completedModules = [] }: DomainCardProps) {
  const percentage = courses.length > 0 ? Math.round((completedCount / courses.length) * 100) : 0;
  const isAllDone = completedCount === courses.length && courses.length > 0;
  const nextCourse = courses.find(c => !completedModules.includes(c.courseNumber)) ?? courses[0];

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card glow-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] h-full flex flex-col">
      {/* Colored gradient top */}
      <div className="h-1.5 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${domain.color}, ${domain.color}88)` }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-3xl" role="img" aria-label={domain.nameHe}>{domain.icon}</span>
              {isAllDone && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 font-heading font-semibold">הושלם ✓</span>
              )}
            </div>
            <h3 className="font-heading font-bold text-text text-lg leading-tight">{domain.nameHe}</h3>
            <p className="text-xs text-muted mt-1">{completedCount}/{courses.length} יחידות</p>
          </div>
          <ProgressRing percentage={percentage} color={domain.color} size={56} strokeWidth={5} />
        </div>

        {/* Course list */}
        <ul className="space-y-1 flex-1" role="list">
          {courses.map((course, idx) => {
            const isDone = completedModules.includes(course.courseNumber);
            return (
              <li key={course.slug}>
                <Link href={`/course/${course.slug}/`}
                  className="flex items-center gap-2.5 text-sm text-text/70 hover:text-accent transition-all group/link min-h-[40px] px-2 -mx-2 rounded-lg hover:bg-accent-light/30">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${isDone ? 'bg-green-900/30 text-green-400' : 'border border-border text-muted group-hover/link:border-accent group-hover/link:text-accent'}`}>
                    {isDone ? '✓' : ''}
                  </span>
                  <span className="truncate leading-tight group-hover/link:text-accent transition-colors">{course.title.split('—')[0].trim()}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        {courses.length > 0 && (
          <Link href={`/course/${nextCourse.slug}/`}
            className="mt-5 flex items-center justify-center gap-2 text-sm font-heading font-bold py-2.5 rounded-xl transition-all min-h-[44px] hover:shadow-md"
            style={{ color: 'white', backgroundColor: domain.color }}>
            <span>{isAllDone ? 'חזור לתחום' : completedCount > 0 ? 'המשך' : 'התחל ללמוד'}</span>
            <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </Link>
        )}
      </div>
    </div>
  );
}
