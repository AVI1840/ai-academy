import { CourseFrontmatter, DomainInfo, PathInfo } from '@/types';

export const COURSE_CATALOG: CourseFrontmatter[] = [
  {
    courseNumber: 1, slug: 'ai-literacy',
    title: 'אוריינות AI ועבודה אחראית',
    duration: '35 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 3,
    domain: 'foundation', path: 'foundation',
    description: 'מה AI יכול ומה לא, איך לעבוד איתו נכון, ולמה זה חשוב במיוחד בשירות הציבורי',
  },
  {
    courseNumber: 2, slug: 'model-map',
    title: 'מפת המודלים',
    duration: '40 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 4,
    domain: 'foundation', path: 'foundation',
    description: 'השוואה מעשית בין ChatGPT, Claude, Gemini, Grok ו-Perplexity — חוזקות, חולשות ומתי להשתמש בכל אחד',
  },
  {
    courseNumber: 3, slug: 'prompt-engineering',
    title: 'הנדסת הנחיות',
    duration: '45 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 5,
    domain: 'ai-engineering', path: 'applied',
    description: 'איך לכתוב הנחיות מדויקות שמפיקות תוצאות איכותיות מכלי AI',
  },
  {
    courseNumber: 4, slug: 'ai-writing',
    title: 'AI לכתיבה ותקשורת',
    duration: '35 דקות קריאה', audience: 'כותבי תוכן ומנהלים', exerciseCount: 4,
    domain: 'ai-engineering', path: 'applied',
    description: 'שימוש ב-AI לכתיבת מסמכים, מיילים, סיכומים ותקשורת ארגונית',
  },
  {
    courseNumber: 5, slug: 'ai-data-analysis',
    title: 'AI לניתוח נתונים',
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
    title: 'AI לחשיבה אסטרטגית',
    duration: '40 דקות קריאה', audience: 'מנהלים בכירים', exerciseCount: 4,
    domain: 'building-ai-products', path: 'applied',
    description: 'שימוש ב-AI ככלי לחשיבה אסטרטגית, ניתוח תרחישים ופתרון בעיות מורכבות',
  },
  {
    courseNumber: 8, slug: 'ai-ethics-gov',
    title: 'אתיקה ובטיחות AI בממשלה',
    duration: '35 דקות קריאה', audience: 'כל עובדי המדינה', exerciseCount: 3,
    domain: 'ai-for-gov', path: 'foundation',
    description: 'עקרונות אתיים, סיכונים ומסגרות רגולטוריות לשימוש אחראי ב-AI במגזר הציבורי',
  },
  {
    courseNumber: 9, slug: 'ai-public-service',
    title: 'AI לשירות הציבור',
    duration: '35 דקות קריאה', audience: 'נותני שירות ומנהלים', exerciseCount: 3,
    domain: 'ai-for-gov', path: 'applied',
    description: 'שימוש ב-AI לשיפור שירות לאזרח, הנגשת מידע ותקשורת ציבורית',
  },
  {
    courseNumber: 10, slug: 'ai-automation',
    title: 'אוטומציה ותהליכי עבודה',
    duration: '40 דקות קריאה', audience: 'מנהלי תהליכים', exerciseCount: 4,
    domain: 'building-ai-products', path: 'applied',
    description: 'אוטומציה של תהליכי עבודה שגרתיים, יצירת workflows חכמים וחיסכון בזמן',
  },
  {
    courseNumber: 11, slug: 'rag',
    title: 'RAG — חיבור AI למאגרי ידע',
    duration: '45 דקות קריאה', audience: 'צוותי IT ומנהלי ידע', exerciseCount: 3,
    domain: 'ai-product-leadership', path: 'advanced',
    description: 'איך לחבר מודלי AI למאגרי מידע פנימיים באמצעות Retrieval-Augmented Generation',
  },
  {
    courseNumber: 12, slug: 'claude-code',
    title: 'AI Engineering — פיתוח תוכנה עם AI',
    duration: '50 דקות קריאה', audience: 'מפתחים וצוותי IT', exerciseCount: 5,
    domain: 'ai-product-leadership', path: 'advanced',
    description: 'פיתוח תוכנה עם כלי AI — Claude Code, GitHub Copilot, Cursor ועוד. דיבוג, code review ואוטומציה',
  },
  {
    courseNumber: 13, slug: 'cloud-nimbus',
    title: 'ענן ממשלתי — AWS, GCP ופרויקט נימבוס',
    duration: '45 דקות קריאה', audience: 'מנהלים וצוותי IT', exerciseCount: 4,
    domain: 'foundation', path: 'foundation',
    description: 'סקירת תשתיות הענן הרלוונטיות לממשלה — AWS, Google Cloud ופרויקט נימבוס',
  },
  {
    courseNumber: 14, slug: 'ai-gov-international',
    title: 'AI בממשלות העולם — מהלכים, הצלחות ולקחים',
    duration: '40 דקות קריאה', audience: 'מנהלים ומובילי מדיניות', exerciseCount: 4,
    domain: 'ai-for-gov', path: 'applied',
    description: 'סקירת מהלכי AI מובילים בממשלות בעולם — אסטוניה, בריטניה, סינגפור ועוד',
  },
  {
    courseNumber: 15, slug: 'notebooklm',
    title: 'NotebookLM — ניהול ידע ומחקר עם AI',
    duration: '40 דקות קריאה', audience: 'חוקרים, מנהלי ידע ומנהלים', exerciseCount: 4,
    domain: 'ai-assisted-dev', path: 'applied',
    description: 'כלי Google לניהול ידע ומחקר מבוסס מסמכים — ניתוח, סיכום ויצירת פודקאסטים',
  },
  {
    courseNumber: 16, slug: 'ai-agents',
    title: 'סוכני AI — מהאוטומציה לאוטונומיה',
    duration: '55 דקות קריאה', audience: 'מנהלים טכנולוגיים ומפתחים', exerciseCount: 5,
    domain: 'ai-product-leadership', path: 'advanced',
    description: 'מה הם AI Agents, איך הם עובדים, כלים מרכזיים (Claude Code, LangGraph, CrewAI, MCP), ויישומים ממשלתיים',
  },
  // ─── מנהיגות ממשלתית — מבוסס AI Journey, מערך הדיגיטל הלאומי ───
  {
    courseNumber: 17, slug: 'ai-8q-framework',
    title: 'מסגרת ה-8 שאלות לאימוץ AI',
    duration: '40 דקות קריאה', audience: 'מנהלים, CDO, CISO, מובילי AI', exerciseCount: 4,
    domain: 'ai-for-gov', path: 'gov-leadership',
    description: 'מסגרת מעשית של 8 שאלות לבחינת כדאיות ואפשרות אימוץ AI בארגון ממשלתי — מהגדרת הבעיה ועד מדידת ROI',
  },
  {
    courseNumber: 18, slug: 'ai-change-management',
    title: 'ניהול שינוי עם AI בממשלה',
    duration: '35 דקות קריאה', audience: 'מנהלים, CDO, מובילי שינוי ארגוני', exerciseCount: 3,
    domain: 'ai-for-gov', path: 'gov-leadership',
    description: 'כיצד מובילים אימוץ AI בארגון ממשלתי — שלבי AI4ME → AI-First → AI-Driven, ניהול התנגדויות ובניית תרבות AI',
  },
  {
    courseNumber: 19, slug: 'ai-finops',
    title: 'FinOps לפרויקטי AI — ניהול עלויות חכם',
    duration: '40 דקות קריאה', audience: 'CDO, CIO, מנהלי תקציב, מובילי AI', exerciseCount: 4,
    domain: 'ai-product-leadership', path: 'gov-leadership',
    description: 'כיצד מנהלים עלויות AI בצורה חכמה — מודלי תמחור LLM, Tokens, Batch vs Real-Time, Caching ומדידת ROI אמיתי',
  },
  {
    courseNumber: 20, slug: 'ai-architecture',
    title: 'ארכיטקטורת AI — BUY vs BUILD',
    duration: '45 דקות קריאה', audience: 'CDO, CIO, ארכיטקטים, מובילי טכנולוגיה', exerciseCount: 4,
    domain: 'ai-product-leadership', path: 'gov-leadership',
    description: 'כיצד מקבלים החלטת BUY vs BUILD לפרויקט AI — Landing Zone ממשלתי, נימבוס, VPC, Firewall וארכיטקטורת ענן ממשלתית',
  },
  {
    courseNumber: 21, slug: 'ai-governance',
    title: 'ממשל AI — COE, GOVAI ו-AI WATCH',
    duration: '40 דקות קריאה', audience: 'CDO, מנכ"לים, מנהלי AI, ועדות היגוי', exerciseCount: 3,
    domain: 'ai-for-gov', path: 'gov-leadership',
    description: 'כיצד בונים מסגרת ממשל AI ארגונית — Center of Excellence, מנגנוני פיקוח, AI WATCH, מדיניות AI ותפקידי CDO/CISO/DPO',
  },
  {
    courseNumber: 22, slug: 'ai-privacy-gdpr',
    title: 'פרטיות ב-AI — GDPR, DPO ורגולציה',
    duration: '40 דקות קריאה', audience: 'DPO, יועמ"ש, מנהלים, CDO', exerciseCount: 4,
    domain: 'ai-for-gov', path: 'gov-leadership',
    description: 'חוק הגנת הפרטיות וGDPR בעידן ה-AI הממשלתי — Privacy by Design, DPIA, סיווג נתונים, EU AI Act ותפקיד ה-DPO',
  },
];

export const DOMAINS: DomainInfo[] = [
  { id: 'foundation', nameHe: 'בסיס', icon: '🏗️', color: '#d97757', courses: [1, 2, 13] },
  { id: 'ai-engineering', nameHe: 'הנדסת AI', icon: '⚙️', color: '#6a9bcc', courses: [3, 4] },
  { id: 'ai-assisted-dev', nameHe: 'עבודה עם AI', icon: '🤝', color: '#7c9a5e', courses: [5, 6, 15] },
  { id: 'building-ai-products', nameHe: 'בניית פתרונות', icon: '🔧', color: '#b07cc6', courses: [7, 10] },
  { id: 'ai-for-gov', nameHe: 'AI לממשלה', icon: '🏛️', color: '#c4915e', courses: [8, 9, 14, 17, 18, 21, 22] },
  { id: 'ai-product-leadership', nameHe: 'מנהיגות טכנולוגית', icon: '🚀', color: '#5e8fb0', courses: [11, 12, 16, 19, 20] },
];

export const PATHS: PathInfo[] = [
  {
    id: 'foundation', nameHe: 'בסיס',
    courseNumbers: [1, 2, 8, 13],
    description: 'הבנה בסיסית של AI, המודלים השונים, ענן ממשלתי ועקרונות אתיים — חובה לכל עובד מדינה',
  },
  {
    id: 'applied', nameHe: 'יישומי',
    courseNumbers: [3, 4, 5, 6, 7, 9, 10, 14, 15],
    description: 'יישום מעשי של AI בעבודה היומיומית — כתיבה, ניתוח, מחקר, ניהול ידע, חשיבה ואוטומציה',
  },
  {
    id: 'advanced', nameHe: 'מתקדם',
    courseNumbers: [11, 12, 16],
    description: 'נושאים מתקדמים למובילים טכנולוגיים — RAG, פיתוח תוכנה עם AI, וסוכני AI',
  },
  {
    id: 'gov-leadership', nameHe: 'מנהיגות ממשלתית',
    courseNumbers: [17, 18, 19, 20, 21, 22],
    description: 'מסגרת AI Journey של מערך הדיגיטל — ניהול, ממשל ואסטרטגיה לאימוץ AI בממשלה עבור CDO, CISO ו-DPO',
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
