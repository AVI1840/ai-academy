'use client';

import { PATHS } from '@/data/course-catalog';
import { LearningPath } from '@/types';

interface PathSelectorProps {
  selectedPath: LearningPath | null;
  onSelect: (path: LearningPath | null) => void;
}

const pathIcons: Record<LearningPath, string> = {
  foundation: '🏗️',
  applied: '🛠️',
  advanced: '🚀',
};

export default function PathSelector({ selectedPath, onSelect }: PathSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {PATHS.map(path => {
        const isActive = selectedPath === path.id;
        return (
          <button
            key={path.id}
            onClick={() => onSelect(isActive ? null : path.id)}
            className={`
              text-right p-5 rounded-xl border transition-all min-h-[44px]
              ${isActive
                ? 'border-accent bg-accent-light shadow-sm'
                : 'border-border bg-bg hover:border-accent/30'
              }
            `}
            aria-pressed={isActive}
            aria-label={`מסלול ${path.nameHe}`}
          >
            <span className="text-2xl block mb-2" aria-hidden="true">{pathIcons[path.id]}</span>
            <h3 className="font-heading font-bold text-text text-base mb-1">מסלול {path.nameHe}</h3>
            <p className="text-xs text-muted leading-relaxed">{path.description}</p>
            <p className="text-xs text-accent mt-2 font-medium">{path.courseNumbers.length} יחידות</p>
          </button>
        );
      })}
    </div>
  );
}
