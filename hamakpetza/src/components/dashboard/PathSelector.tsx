'use client';

import { PATHS } from '@/data/course-catalog';
import { LearningPath } from '@/types';

interface PathSelectorProps {
  selectedPath: LearningPath | null;
  onSelect: (path: LearningPath | null) => void;
}

const pathMeta: Record<LearningPath, { icon: string; gradient: string }> = {
  foundation: { icon: '🏗️', gradient: 'from-amber-500/10 to-orange-500/5' },
  applied: { icon: '🛠️', gradient: 'from-blue-500/10 to-cyan-500/5' },
  advanced: { icon: '🚀', gradient: 'from-purple-500/10 to-pink-500/5' },
  'gov-leadership': { icon: '🏛️', gradient: 'from-emerald-500/10 to-teal-500/5' },
};

export default function PathSelector({ selectedPath, onSelect }: PathSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PATHS.map(path => {
        const isActive = selectedPath === path.id;
        const meta = pathMeta[path.id];
        return (
          <button key={path.id} onClick={() => onSelect(isActive ? null : path.id)}
            className={`text-right p-6 rounded-2xl border transition-all min-h-[44px] group ${isActive ? 'border-accent bg-accent-light shadow-[var(--shadow-glow)]' : 'glass-card hover:border-accent/30 hover:-translate-y-0.5'}`}
            aria-pressed={isActive}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 bg-gradient-to-br ${meta.gradient}`}>
              {meta.icon}
            </div>
            <h3 className="font-heading font-bold text-text text-lg mb-1.5">מסלול {path.nameHe}</h3>
            <p className="text-xs text-muted leading-relaxed mb-3">{path.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-semibold text-accent">{path.courseNumbers.length} יחידות</span>
              {isActive && <span className="text-xs text-accent">● פעיל</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
