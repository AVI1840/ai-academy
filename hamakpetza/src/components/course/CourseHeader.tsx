import Link from 'next/link';
import { CourseFrontmatter } from '@/types';
import { COURSE_CATALOG, DOMAINS } from '@/data/course-catalog';
import SocialShare from './SocialShare';

interface CourseHeaderProps { frontmatter: CourseFrontmatter; }

export default function CourseHeader({ frontmatter }: CourseHeaderProps) {
  const domain = DOMAINS.find(d => d.id === frontmatter.domain);
  const totalCourses = COURSE_CATALOG.length;
  const courseUrl = `https://avi1840.github.io/ai-academy/course/${frontmatter.slug}/`;

  return (
    <header className="mb-12 pb-10 border-b border-border relative">
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-6 relative" aria-label="path">
        <Link href="/" className="hover:text-accent transition-colors font-heading">המקפצה</Link>
        <span className="opacity-40">/</span>
        {domain && (<><span className="font-heading">{domain.icon} {domain.nameHe}</span><span className="opacity-40">/</span></>)}
        <span className="text-text/50 truncate">{frontmatter.title}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="px-3 py-1.5 rounded-full text-xs font-heading font-bold bg-accent/10 text-accent border border-accent/20">יחידה {frontmatter.courseNumber} מתוך {totalCourses}</span>
        <span className="px-3 py-1.5 rounded-full text-xs font-heading bg-surface border border-border text-muted">{frontmatter.duration}</span>
        <span className="px-3 py-1.5 rounded-full text-xs font-heading bg-surface border border-border text-muted">{frontmatter.path === 'foundation' ? 'בסיס' : frontmatter.path === 'applied' ? 'יישומי' : 'מתקדם'}</span>
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-text leading-tight mb-4">{frontmatter.title}</h1>
      <p className="text-lg text-muted leading-relaxed mb-6 max-w-2xl">{frontmatter.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs bg-secondary/10 text-secondary font-heading font-medium border border-secondary/20">{frontmatter.audience}</span>
          <span className="px-3 py-1.5 rounded-xl text-xs bg-accent/10 text-accent font-heading font-medium border border-accent/20">{frontmatter.exerciseCount} תרגילים</span>
        </div>
        <SocialShare title={frontmatter.title} url={courseUrl} description={`למדתי "${frontmatter.title}" בהמקפצה`} variant="compact" />
      </div>
    </header>
  );
}