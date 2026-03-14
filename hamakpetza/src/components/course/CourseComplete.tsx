'use client';

import { useState, useEffect } from 'react';
import { loadProgress, markModuleComplete, markModuleIncomplete } from '@/lib/progress';

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
      setCompleted(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`
        w-full py-3 rounded-xl text-sm font-heading font-semibold transition-all
        ${completed
          ? 'bg-green-50 border border-green-300 text-green-700 hover:bg-green-100'
          : 'bg-accent text-white hover:bg-accent/90'
        }
      `}
      aria-label={completed ? 'סמן כלא הושלם' : 'סמן כהושלם'}
    >
      {completed ? '✓ הושלם — לחץ לביטול' : 'סיימתי את היחידה ✓'}
    </button>
  );
}
