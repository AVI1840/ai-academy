import Link from 'next/link';
import { CourseFrontmatter } from '@/types';
import { COURSE_CATALOG, DOMAINS } from '@/data/course-catalog';
import SocialShare from './SocialShare';

const DOMAIN_HERO_IMAGES: Record<string, string> = {
  'foundation':           '/ai-academy/images/amb-hourglass.png',
  'ai-engineering':       '/ai-academy/images/amb-neural.png',
  'ai-assisted-dev':      '/ai-academy/images/amb-cubes.png',
  'building-ai-products': '/ai-academy/images/amb-gem.png',
  'ai-for-gov':           '/ai-academy/images/amb-compass.png',
  'ai-product-leadership':'/ai-academy/images/amb-hero.png',
};

interface CourseHeaderProps { frontmatter: CourseFrontmatter; }

export default function CourseHeader({ frontmatter }: CourseHeaderProps) {
  const domain = DOMAINS.find(d => d.id === frontmatter.domain);
  const heroImg = DOMAIN_HERO_IMAGES[frontmatter.domain] ?? '/ai-academy/images/amb9.jpg';
  const totalCourses = COURSE_CATALOG.length;
  const courseUrl = `https://avi1840.github.io/ai-academy/course/${frontmatter.slug}/`;

  return (
    <header className="mb-12 pb-10 border-b border-border relative overflow-hidden">
      {domain && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 80% -20%, ${domain.color}22 0%, transparent 60%)`,
          }}
        />
      )}
      {/* Decorative course image — left panel */}
      <div className="absolute top-0 left-0 bottom-0 w-72 pointer-events-none overflow-hidden hidden lg:block" aria-hidden="true">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.42, objectPosition: 'center top' }}
        />
        {/* Fade toward content */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, transparent 0%, var(--color-bg) 70%)'
        }} />
        {/* Top/bottom vignette */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, var(--color-bg) 0%, transparent 15%, transparent 85%, var(--color-bg) 100%)'
        }} />
      </div>

      {/* Content pushed right of image on large screens */}
      <div className="relative z-10 lg:pr-0">
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
      </div>
    </header>
  );
}