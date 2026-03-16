export type LearningDomain =
  | 'foundation'
  | 'ai-engineering'
  | 'ai-assisted-dev'
  | 'building-ai-products'
  | 'ai-for-gov'
  | 'ai-product-leadership';

export type LearningPath = 'foundation' | 'applied' | 'advanced';

export interface CourseFrontmatter {
  slug: string;
  title: string;
  courseNumber: number;
  duration: string;
  audience: string;
  exerciseCount: number;
  domain: LearningDomain;
  path: LearningPath;
  audioUrl?: string;
  description: string;
}

export interface DomainInfo {
  id: LearningDomain;
  nameHe: string;
  icon: string;
  color: string;
  courses: number[];
}

export interface PathInfo {
  id: LearningPath;
  nameHe: string;
  courseNumbers: number[];
  description: string;
}

export interface ProgressState {
  version: 1;
  completedModules: number[];
  quizAnswers: Record<string, {
    selectedIndex: number;
    revealed: boolean;
  }>;
  lastVisited: string | null;
  updatedAt: string;
}
