import Link from 'next/link';
import { CourseFrontmatter } from '@/types';

interface CourseNavProps {
  prevCourse: CourseFrontmatter | null;
  nextCourse: CourseFrontmatter | null;
}

export default function CourseNav({ prevCourse, nextCourse }: CourseNavProps) {
  return (
    <nav className="flex justify-between items-center mt-12 pt-8 border-t border-border" aria-label="ניווט בין קורסים">
      {prevCourse ? (
        <Link
          href={`/course/${prevCourse.slug}/`}
          className="flex flex-col items-start gap-1 text-sm text-muted hover:text-accent transition-colors group min-h-[44px] justify-center"
          aria-label={`הקורס הקודם: ${prevCourse.title}`}
        >
          <span className="text-xs text-muted/60" aria-hidden="true">← הקורס הקודם</span>
          <span className="font-heading font-medium group-hover:text-accent">
            {prevCourse.title.split('—')[0].trim()}
          </span>
        </Link>
      ) : <div />}

      {nextCourse ? (
        <Link
          href={`/course/${nextCourse.slug}/`}
          className="flex flex-col items-end gap-1 text-sm text-muted hover:text-accent transition-colors group min-h-[44px] justify-center"
          aria-label={`הקורס הבא: ${nextCourse.title}`}
        >
          <span className="text-xs text-muted/60" aria-hidden="true">הקורס הבא →</span>
          <span className="font-heading font-medium group-hover:text-accent">
            {nextCourse.title.split('—')[0].trim()}
          </span>
        </Link>
      ) : <div />}
    </nav>
  );
}
