import { CourseFrontmatter } from '@/types';

interface CourseHeaderProps {
  frontmatter: CourseFrontmatter;
}

export default function CourseHeader({ frontmatter }: CourseHeaderProps) {
  return (
    <header className="mb-10 pb-8 border-b border-border">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-accent-light text-accent">
          יחידה {frontmatter.courseNumber} מתוך 12
        </span>
        <span className="text-xs text-muted">{frontmatter.duration}</span>
      </div>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text leading-tight mb-3">
        {frontmatter.title}
      </h1>
      <p className="text-lg text-muted leading-relaxed">{frontmatter.description}</p>
      <div className="flex flex-wrap gap-3 mt-4">
        <span className="px-3 py-1 rounded-lg text-xs bg-secondary-light text-secondary font-medium">
          👥 {frontmatter.audience}
        </span>
        <span className="px-3 py-1 rounded-lg text-xs bg-accent-light text-accent font-medium">
          ✏️ {frontmatter.exerciseCount} תרגילים
        </span>
      </div>
    </header>
  );
}
