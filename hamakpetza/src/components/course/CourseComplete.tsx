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
    <div className="w-full">
      {completed && (
        <div className="mb-4 flex flex-col items-center animate-fade-in-up">
          <div className="relative w-28 h-28 mb-3">
            <img
              src="/ai-academy/images/amb-badge.png"
              alt="תעודת הישג"
              className="w-full h-full object-contain drop-shadow-[0_0_18px_rgba(217,119,87,0.5)]"
            />
          </div>
          <p className="text-sm font-heading font-bold text-accent text-center">יחידה הושלמה בהצלחה!</p>
          <p className="text-xs text-muted text-center mt-1">כל הכבוד — המשך כך</p>
        </div>
      )}
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
    </div>
  );
}
