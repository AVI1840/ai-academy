import { notFound } from 'next/navigation';
import { COURSE_CATALOG } from '@/data/course-catalog';
import { getCourseSource } from '@/lib/mdx';
import AppShell from '@/components/layout/AppShell';
import CourseHeader from '@/components/course/CourseHeader';
import CourseNav from '@/components/course/CourseNav';
import CourseComplete from '@/components/course/CourseComplete';
import WhatsAppShare from '@/components/course/WhatsAppShare';
import AudioPlayer from '@/components/mdx/AudioPlayer';
import CourseContent from './CourseContent';

export function generateStaticParams() {
  return COURSE_CATALOG.map(c => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const course = COURSE_CATALOG.find(c => c.slug === params.slug);
  if (!course) return { title: 'לא נמצא — המקפצה' };
  return {
    title: `${course.title} — המקפצה`,
    description: course.description,
  };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = COURSE_CATALOG.find(c => c.slug === params.slug);
  if (!course) notFound();

  const source = getCourseSource(params.slug);
  const idx = COURSE_CATALOG.findIndex(c => c.slug === params.slug);
  const prevCourse = idx > 0 ? COURSE_CATALOG[idx - 1] : null;
  const nextCourse = idx < COURSE_CATALOG.length - 1 ? COURSE_CATALOG[idx + 1] : null;

  return (
    <AppShell currentSlug={params.slug}>
      {course.audioUrl && <AudioPlayer src={course.audioUrl} title={course.title} />}

      <article className="reading-column py-12">
        <CourseHeader frontmatter={course} />

        {source ? (
          <CourseContent content={source.content} />
        ) : (
          <div className="prose prose-lg max-w-none" dir="rtl">
            <p className="text-muted">תוכן היחידה בהכנה...</p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CourseComplete courseNumber={course.courseNumber} />
          <WhatsAppShare
            title={course.title}
            url={`https://avi1840.github.io/ai-academy/course/${course.slug}/`}
          />
        </div>

        <CourseNav prevCourse={prevCourse} nextCourse={nextCourse} />
      </article>
    </AppShell>
  );
}
