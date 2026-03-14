import Link from 'next/link';
import { DomainInfo, CourseFrontmatter } from '@/types';
import ProgressRing from './ProgressRing';

interface DomainCardProps {
  domain: DomainInfo;
  courses: CourseFrontmatter[];
  completedCount: number;
}

export default function DomainCard({ domain, courses, completedCount }: DomainCardProps) {
  const percentage = courses.length > 0 ? Math.round((completedCount / courses.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-bg p-5 hover:border-accent/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-2xl mb-1 block" role="img" aria-label={domain.nameHe}>{domain.icon}</span>
          <h3 className="font-heading font-bold text-text text-base">{domain.nameHe}</h3>
          <p className="text-xs text-muted mt-0.5">{completedCount}/{courses.length} יחידות</p>
        </div>
        <ProgressRing percentage={percentage} color={domain.color} size={56} />
      </div>
      <div className="space-y-1.5">
        {courses.map(course => (
          <Link
            key={course.slug}
            href={`/course/${course.slug}/`}
            className="flex items-center gap-2 text-sm text-text/70 hover:text-accent transition-colors"
          >
            <span className="w-4 text-center text-xs">
              {completedCount > 0 && domain.courses.indexOf(course.courseNumber) < completedCount ? '✓' : '○'}
            </span>
            <span className="truncate">{course.title.split('—')[0].trim()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
