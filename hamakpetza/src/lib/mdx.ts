import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CourseFrontmatter } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'courses');

export function getAllCourseSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/^\d+-/, '').replace('.mdx', ''));
}

export function getCourseSource(slug: string): { content: string; frontmatter: CourseFrontmatter } | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  const file = files.find(f => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf-8');
    const { data } = matter(raw);
    return data.slug === slug;
  });
  if (!file) return null;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
  const { content, data } = matter(raw);
  return { content, frontmatter: data as CourseFrontmatter };
}

export function getAllCourses(): CourseFrontmatter[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, f), 'utf-8');
      const { data } = matter(raw);
      return data as CourseFrontmatter;
    })
    .sort((a, b) => a.courseNumber - b.courseNumber);
}
