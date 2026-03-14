import { CourseFrontmatter, DomainInfo, PathInfo } from '@/types';

export const COURSE_CATALOG: CourseFrontmatter[] = [
  {
    courseNumber: 1, slug: 'ai-literacy',
    title: 'אוריינות AI — בסיס לכל עובד מדינה',
    duration: '35 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 3,
    domain: 'foundation', path: 'foundation',
    description: 'מה AI יכול ומה לא, איך לעבוד איתו נכון, ולמה זה חשוב במיוחד בשירות הציבורי',
  },
  {
    courseNumber: 2, slug: 'model-map',
    title: 'מפת המודלים — במה להשתמש ומתי',
    duration: '40 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 4,
    domain: 'foundation', path: 'foundation',
    description: 'השוואה מעשית בין ChatGPT, Claude, Gemini, Grok ו-Perplexity — חוזקות, חולשות ומתי להשתמש בכל אחד',
  },
  {
    courseNumber: 3, slug: 'prompt-engineering',
    title: 'הנדסת הנחיות (Prompt Engineering)',
    duration: '45 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 5,
    domain: 'ai-engineering', path: 'applied',
    description: 'איך לכתוב הנחיות מדויקות שמפיקות תוצאות איכותיות מכלי AI',
  },
  {
    courseNumber: 4, slug: 'ai-writing',
    title: 'AI לכתיבה ותקשורת בשירות הציבורי',
    duration: '35 דקות קריאה', audience: 'כותבי תוכן ומנהלים', exerciseCount: 4,
    domain: 'ai-assisted-dev', path: 'applied',
    description: 'שימוש ב-AI לכתיבת מסמכים, מיילים, סיכומים ותקשורת ארגונית',
  },
  {
    courseNumber: 5, slug: 'ai-data-analysis',
    title: 'AI לניתוח נתונים וקבלת החלטות',
    duration: '40 דקות קריאה', audience: 'מנתחי נתונים ומנהלים', exerciseCount: 4,
    domain: 'ai-assisted-dev', path: 'applied',
    description: 'ניתוח נתונים, יצירת תובנות וקבלת החלטות מבוססות מידע עם AI',
  },
  {
    courseNumber: 6, slug: 'ai-research',
    title: 'חיפוש ומחקר עם AI',
    duration: '35 דקות קריאה', audience: 'חוקרים ומנהלי מדיניות', exerciseCount: 3,
    domain: 'ai-assisted-dev', path: 'applied',
    description: 'שימוש ב-AI לחיפוש מידע, סקירת ספרות ומחקר מדיניות',
  },
  {
    courseNumber: 7, slug: 'ai-strategic-thinking',
    title: 'AI לחשיבה אסטרטגית ופתרון בעיות',
    duration: '40 דקות קריאה', audience: 'מנהלים בכירים', exerciseCount: 4,
    domain: 'building-ai-products', path: 'applied',
    description: 'שימוש ב-AI ככלי לחשיבה אסטרטגית, ניתוח תרחישים ופתרון בעיות מורכבות',
  },
  {
    courseNumber: 8, slug: 'ai-ethics-gov',
    title: 'אתיקה, בטיחות ורגולציה של AI בממשלה',
    duration: '35 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 3,
    domain: 'ai-for-gov', path: 'foundation',
    description: 'עקרונות אתיים, סיכונים ומסגרות רגולטוריות לשימוש אחראי ב-AI במגזר הציבורי',
  },
  {
    courseNumber: 9, slug: 'ai-public-service',
    title: 'AI לשירות הציבור והנגשת מידע',
    duration: '35 דקות קריאה', audience: 'נותני שירות ומנהלים', exerciseCount: 3,
    domain: 'ai-for-gov', path: 'applied',
    description: 'שימוש ב-AI לשיפור שירות לאזרח, הנגשת מידע ותקשורת ציבורית',
  },
  {
    courseNumber: 10, slug: 'ai-automation',
    title: 'אוטומציה ותהליכי עבודה עם AI',
    duration: '40 דקות קריאה', audience: 'מנהלי תהליכים', exerciseCount: 4,
    domain: 'building-ai-products', path: 'applied',
    description: 'אוטומציה של תהליכי עבודה שגרתיים, יצירת workflows חכמים וחיסכון בזמן',
  },
  {
    courseNumber: 11, slug: 'rag',
    title: 'RAG — חיבור AI למאגרי ידע ארגוניים',
    duration: '45 דקות קריאה', audience: 'צוותי IT ומנהלי ידע', exerciseCount: 3,
    domain: 'ai-product-leadership', path: 'advanced',
    description: 'איך לחבר מודלי AI למאגרי מידע פנימיים באמצעות Retrieval-Augmented Generation',
  },
  {
    courseNumber: 12, slug: 'claude-code',
    title: 'Claude Code — למפתחים וצוותי IT',
    duration: '50 דקות קריאה', audience: 'מפתחים וצוותי IT', exerciseCount: 5,
    domain: 'ai-product-leadership', path: 'advanced',
    description: 'שימוש ב-Claude Code לפיתוח, דיבוג, code review ואוטומציה של משימות פיתוח',
  },
];

export const DOMAINS: DomainInfo[] = [
  { id: 'foundation', nameHe: 'בסיס', icon: '🏗️', color: '#d97757', courses: [1, 2] },
  { id: 'ai-engineering', nameHe: 'הנדסת AI', icon: '⚙️', color: '#6a9bcc', courses: [3] },
  { id: 'ai-assisted-dev', nameHe: 'עבודה עם AI', icon: '🤝', color: '#7c9a5e', courses: [4, 5, 6] },
  { id: 'building-ai-products', nameHe: 'בניית פתרונות', icon: '🔧', color: '#b07cc6', courses: [7, 10] },
  { id: 'ai-for-gov', nameHe: 'AI לממשלה', icon: '🏛️', color: '#c4915e', courses: [8, 9] },
  { id: 'ai-product-leadership', nameHe: 'מנהיגות טכנולוגית', icon: '🚀', color: '#5e8fb0', courses: [11, 12] },
];

export const PATHS: PathInfo[] = [
  {
    id: 'foundation', nameHe: 'בסיס',
    courseNumbers: [1, 2, 8],
    description: 'הבנה בסיסית של AI, המודלים השונים ועקרונות אתיים — חובה לכל עובד מדינה',
  },
  {
    id: 'applied', nameHe: 'יישומי',
    courseNumbers: [3, 4, 5, 6, 7, 9, 10],
    description: 'יישום מעשי של AI בעבודה היומיומית — כתיבה, ניתוח, מחקר, חשיבה ואוטומציה',
  },
  {
    id: 'advanced', nameHe: 'מתקדם',
    courseNumbers: [11, 12],
    description: 'נושאים מתקדמים למובילים טכנולוגיים — RAG, פיתוח עם Claude Code',
  },
];

export function getCourseByNumber(num: number): CourseFrontmatter | undefined {
  return COURSE_CATALOG.find(c => c.courseNumber === num);
}

export function getCourseBySlug(slug: string): CourseFrontmatter | undefined {
  return COURSE_CATALOG.find(c => c.slug === slug);
}

export function getCoursesByDomain(domain: string): CourseFrontmatter[] {
  return COURSE_CATALOG.filter(c => c.domain === domain);
}

export function getCoursesByPath(path: string): CourseFrontmatter[] {
  return COURSE_CATALOG.filter(c => c.path === path);
}

export const DOMAINS: DomainInfo[] = [
  { id: 'foundation', nameHe: 'בסיס', icon: '🏗️', color: '#d97757', courses: [1, 2] },
  { id: 'ai-engineering', nameHe: 'הנדסת AI', icon: '⚙️', color: '#6a9bcc', courses: [3] },
  { id: 'ai-assisted-dev', nameHe: 'עבודה עם AI', icon: '🤝', color: '#7c9a5e', courses: [4, 5, 6] },
  { id: 'building-ai-products', nameHe: 'בניית פתרונות', icon: '🔧', color: '#b07cc6', courses: [7, 10] },
  { id: 'ai-for-gov', nameHe: 'AI לממשלה', icon: '🏛️', color: '#c4915e', courses: [8, 9] },
  { id: 'ai-product-leadership', nameHe: 'מנהיגות טכנולוגית', icon: '🚀', color: '#5e8fb0', courses: [11, 12] },
];

export const PATHS: PathInfo[] = [
  {
    id: 'foundation', nameHe: 'בסיס',
    courseNumbers: [1, 2, 8],
    description: 'הבנה בסיסית של AI, המודלים השונים ועקרונות אתיים — חובה לכל עובד מדינה',
  },
  {
    id: 'applied', nameHe: 'יישומי',
    courseNumbers: [3, 4, 5, 6, 7, 9, 10],
    description: 'יישום מעשי של AI בעבודה היומיומית — כתיבה, ניתוח, מחקר, חשיבה ואוטומציה',
  },
  {
    id: 'advanced', nameHe: 'מתקדם',
    courseNumbers: [11, 12],
    description: 'נושאים מתקדמים למובילים טכנולוגיים — RAG, פיתוח עם Claude Code',
  },
];

export function getCourseByNumber(num: number): CourseFrontmatter | undefined {
  retur