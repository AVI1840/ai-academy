import { MDXRemote } from 'next-mdx-remote/rsc';
import { CourseFrontmatter } from '@/types';
import CourseHeader from './CourseHeader';
import PromptBlock from '@/components/mdx/PromptBlock';
import QuizQuestion from '@/components/mdx/QuizQuestion';
import KeyTerms from '@/components/mdx/KeyTerms';
import AudioPlayer from '@/components/mdx/AudioPlayer';

interface ModuleRendererProps {
  source: string;
  frontmatter: CourseFrontmatter;
}

/**
 * Error placeholder component for invalid/missing MDX components.
 * Renders a visible warning instead of crashing the page.
 */
function ErrorPlaceholder({ componentName }: { componentName: string }) {
  return (
    <div
      className="my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 font-heading"
      role="alert"
      dir="rtl"
    >
      <span className="font-semibold">רכיב חסר:</span>{' '}
      <code className="font-mono text-xs bg-red-100 px-1 py-0.5 rounded">{componentName}</code>
      {' '}— לא ניתן לטעון את הרכיב הזה.
    </div>
  );
}

/**
 * Creates a safe wrapper around an MDX component that catches render errors
 * and displays an error placeholder instead of crashing.
 */
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  name: string
): React.ComponentType<P> {
  const SafeComponent = (props: P) => {
    try {
      return <Component {...props} />;
    } catch {
      return <ErrorPlaceholder componentName={name} />;
    }
  };
  SafeComponent.displayName = `Safe(${name})`;
  return SafeComponent;
}

/**
 * Registry of known MDX components wrapped with error boundaries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const knownComponents: Record<string, React.ComponentType<any>> = {
  PromptBlock: withErrorBoundary(PromptBlock, 'PromptBlock'),
  QuizQuestion: withErrorBoundary(QuizQuestion, 'QuizQuestion'),
  KeyTerms: withErrorBoundary(KeyTerms, 'KeyTerms'),
  AudioPlayer: withErrorBoundary(AudioPlayer, 'AudioPlayer'),
};

/**
 * Proxy handler that returns an ErrorPlaceholder for any unregistered component
 * accessed in MDX content, preventing crashes from invalid/missing components.
 */
const componentProxy = new Proxy(knownComponents, {
  get(target, prop: string) {
    if (prop in target) {
      return target[prop];
    }
    // Return an error placeholder for any unknown component
    return function UnknownComponent() {
      return <ErrorPlaceholder componentName={prop} />;
    };
  },
});

/**
 * ModuleRenderer — renders a full course module page.
 *
 * Combines CourseHeader (frontmatter metadata) with MDX body content,
 * injecting custom components (PromptBlock, QuizQuestion, KeyTerms, AudioPlayer)
 * and applying Tailwind Typography prose styling with the design system fonts.
 */
export default function ModuleRenderer({ source, frontmatter }: ModuleRendererProps) {
  return (
    <div>
      <CourseHeader frontmatter={frontmatter} />

      <div
        className="prose prose-lg max-w-none
                   font-body
                   prose-headings:font-heading
                   prose-pre:font-mono
                   prose-code:font-mono"
        dir="rtl"
      >
        <MDXRemote source={source} components={componentProxy} />
      </div>
    </div>
  );
}
