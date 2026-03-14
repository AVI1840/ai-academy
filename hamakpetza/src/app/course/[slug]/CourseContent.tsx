'use client';

import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
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
  const [mdxSource, setMdxSource] = useState<any>(null);

  useEffect(() => {
    serialize(content).then(setMdxSource);
  }, [content]);

  if (!mdxSource) {
    return <div className="text-muted text-center py-8">טוען תוכן...</div>;
  }

  return (
    <div className="prose prose-lg max-w-none" dir="rtl">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}
