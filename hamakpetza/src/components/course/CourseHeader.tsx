import Link from 'next/link';
import { CourseFrontmatter } from '@/types';
import { COURSE_CATALOG, DOMAINS } from '@/data/course-catalog';
import SocialShare from './SocialShare';

interface CourseHeaderProps {
  frontmatter: CourseFrontmatter;
}

export default function CourseHeader({ frontmatter }: CourseHeaderProps) {
  const domain = DOMAINS.find(d => d.id === frontmatter.domain);
  const totalCourses = COURSE_CATALOG.length;
  const courseUrl = `https://avi1840.github.io/ai-academy/course/${frontmatter.slug}/`;

  return (
    <header className="mb-10 pb-8 border-b border-border">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-4" aria-label="נתיב ניווט">
        <Link href="/" className="hover:text-accent transition-colors">
          המקפצה
        </Link>
        <svg className="w-3 h-3 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {domain && (
          <>
            <span>{domain.icon} {domain.nameHe}</span>
            <svg className="w-3 h-3 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
        <span className="text-text/60 truncate">{frontmatter.title.split('—')[0].trim()}</span>
      </nav>

      {/* Meta badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-accent-light text-accent">
          יחידה {frontmatter.courseNumber} מתוך {totalCourses}
        </span>
        <span className="text-xs text-muted">{frontmatter.duration}</span>
        <span className="text-xs text-muted hidden sm:inline">·</span>
        <span className="px-2 py-0.5 rounded text-xs bg-surface text-muted">
          {frontmatter.path === 'foundation' ? '🏗️ בסיס' : frontmatter.path === 'applied' ? '🛠️ יישומי' : '🚀 מתקדם'}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text leading-tight mb-3">
        {frontmatter.title}
      </h1>

      {/* Description */}
      <p className="text-lg text-muted leading-relaxed mb-5">
        {frontmatter.description}
      </p>

      {/* Tags + Share row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-lg text-xs bg-secondary-light text-secondary font-medium">
            <span aria-hidden="true">👥</span> {frontmatter.audience}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs bg-accent-light text-accent font-medium">
            <span aria-hidden="true">✏️</span> {frontmatter.exerciseCount} תרגילים
          </span>
        </div>

        {/* Social share — compact icon-only */}
        <SocialShare
          title={frontmatter.title}
          url={courseUrl}
          description={`למדתי "${frontmatter.title}" בהמקפצה — אקדמיית AI ממשלתית 🚀`}
          variant="compact"
        />
      </div>
    </header>
  );
}
