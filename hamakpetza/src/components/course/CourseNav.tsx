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
          className="group flex flex-col items-end gap-1 px-6 py-4 rounded-2xl
            bg-accent text-white font-heading font-bold
            hover:shadow-[0_8px_30px_rgba(217,119,87,0.3)] hover:-translate-y-0.5
            transition-all min-h-[44px] max-w-xs"
          aria-label={`הקורס הבא: ${nextCourse.title}`}
        >
          <span className="text-xs font-normal opacity-80 flex items-center gap-1">
            הקורס הבא
            <svg className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <span className="text-sm leading-snug">
            {nextCourse.title.split('—')[0].trim()}
          </span>
        </Link>
      ) : <div />}
    </nav>
  );
}
