'use client';

import { useState, useEffect } from 'react';
import { loadProgress, markModuleComplete, markModuleIncomplete } from '@/lib/progress';
import { trackLessonComplete } from '@/lib/analytics';
import { COURSE_CATALOG } from '@/data/course-catalog';

interface CourseCompleteProps {
  courseNumber: number;
}

export default function CourseComplete({ courseNumber }: CourseCompleteProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(loadProgress().completedModules.includes(courseNumber));
  }, [courseNumber]);

  const toggle = () => {
    if (completed) {
      markModuleIncomplete(courseNumber);
      setCompleted(false);
    } else {
      markModuleComplete(courseNumber);
      const course = COURSE_CATALOG.find(c => c.courseNumber === courseNumber);
      const durationMinutes = course ? (parseInt(course.duration, 10) || 35) : 35;
      trackLessonComplete(courseNumber, durationMinutes);
      setCompleted(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`
        w-full py-3 min-h-[44px] rounded-xl text-sm font-heading font-semibold transition-all
        ${completed
          ? 'bg-green-900/30 border border-green-700/40 text-green-400 hover:bg-green-900/50'
          : 'bg-accent text-white hover:bg-accent/90'
        }
      `}
      aria-label={completed ? 'סמן כלא הושלם' : 'סמן כהושלם'}
    >
      {completed ? '✓ הושלם — לחץ לביטול' : 'סיימתי את היחידה ✓'}
    </button>
  );
}
