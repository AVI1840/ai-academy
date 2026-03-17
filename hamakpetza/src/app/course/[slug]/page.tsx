import { notFound } from 'next/navigation';
import { COURSE_CATALOG } from '@/data/course-catalog';
import { getCourseSource } from '@/lib/mdx';
import AppShell from '@/components/layout/AppShell';
import ModuleRenderer from '@/components/course/ModuleRenderer';
import CourseNav from '@/components/course/CourseNav';
import CourseComplete from '@/components/course/CourseComplete';
import SocialShare from '@/components/course/SocialShare';
import AudioPlayer from '@/components/mdx/AudioPlayer';
import ReadingProgress from '@/components/course/ReadingProgress';
import TableOfContents from '@/components/course/TableOfContents';
import ScrollToTop from '@/components/course/ScrollToTop';

export function generateStaticParams() {
  return COURSE_CATALOG.map(c => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const course = COURSE_CATALOG.find(c => c.slug === params.slug);
  if (!course) return { title: 'לא נמצא — המקפצה' };
  return {
    title: `${course.title} — המקפצה`,
    description: course.description,
    openGraph: {
      title: `${course.title} — המקפצה`,
      description: course.description,
      type: 'article',
      locale: 'he_IL',
      url: `https://avi1840.github.io/ai-academy/course/${course.slug}/`,
    },
  };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = COURSE_CATALOG.find(c => c.slug === params.slug);
  if (!course) notFound();

  const source = getCourseSource(params.slug);
  const idx = COURSE_CATALOG.findIndex(c => c.slug === params.slug);
  const prevCourse = idx > 0 ? COURSE_CATALOG[idx - 1] : null;
  const nextCourse = idx < COURSE_CATALOG.length - 1 ? COURSE_CATALOG[idx + 1] : null;

  const courseUrl = `https://avi1840.github.io/ai-academy/course/${course.slug}/`;

  return (
    <AppShell currentSlug={params.slug}>
      <ReadingProgress />
      <TableOfContents />
      <ScrollToTop />
      {course.audioUrl && <AudioPlayer src={course.audioUrl} title={course.title} />}

      <article className="reading-column py-8 sm:py-12">
        {source ? (
          <ModuleRenderer source={source.content} frontmatter={course} />
        ) : (
          <ModuleRenderer source="" frontmatter={course} />
        )}

        {/* End-of-course actions */}
        <div className="mt-10 space-y-4">
          <CourseComplete courseNumber={course.courseNumber} />

          {/* Share after completing */}
          <div className="rounded-xl border border-border bg-surface p-4 text-center">
            <p className="text-sm text-muted font-heading mb-3">
              💡 סיימת? שתף עם הקולגות שלך
            </p>
            <div className="flex justify-center">
              <SocialShare
                title={course.title}
                url={courseUrl}
                description={`סיימתי את "${course.title}" בהמקפצה — אקדמיית AI ממשלתית 🚀`}
              />
            </div>
          </div>
        </div>

        <CourseNav prevCourse={prevCourse} nextCourse={nextCourse} />
      </article>
    </AppShell>
  );
}
