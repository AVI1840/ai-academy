import { MDXRemote } from 'next-mdx-remote/rsc';
import PromptBlock from '@/components/mdx/PromptBlock';
import QuizQuestion from '@/components/mdx/QuizQuestion';
import KeyTerms from '@/components/mdx/KeyTerms';

const components = {
  PromptBlock,
  QuizQuestion,
  KeyTerms,
};

interface CourseContentProps {
  content: string;
}

export default function CourseContent({ content }: CourseContentProps) {
  return (
    <div className="prose prose-lg max-w-none" dir="rtl">
      <MDXRemote source={content} components={components} />
    </div>
  );
}
