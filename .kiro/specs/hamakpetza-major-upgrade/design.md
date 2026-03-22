# עיצוב טכני - שדרוג מז׳ורי של המקפצה v2.0

## סקירה כללית

שדרוג הפלטפורמה הקיימת (Next.js 14 static export) עם רכיבי UX חדשים, מיתוג, תיקוני באגים ותוכן. אין שינוי ארכיטקטורי - הכל נשאר static export ל-GitHub Pages.

## רכיבים חדשים

### 1. ReadingProgress (src/components/course/ReadingProgress.tsx)

Client component ללא props. משתמש ב-scroll event עם requestAnimationFrame throttling. מחשב scrollY / (documentHeight - viewportHeight) * 100. מרנדר div fixed ב-top:0 עם width באחוזים, גובה 3px, צבע accent, z-index 50.

### 2. TableOfContents (src/components/course/TableOfContents.tsx)

Client component ללא props. ב-mount עושה querySelectorAll על article h2 לחילוץ כותרות. משתמש ב-IntersectionObserver עם rootMargin של -20% top לזיהוי הסקשן הנוכחי. מרנדר רשימת קישורים sticky בצד שמאל (RTL). מוסתר מתחת ל-1024px.

### 3. ScrollToTop (src/components/course/ScrollToTop.tsx)

Client component ללא props. מופיע אחרי גלילה של 400px. כפתור fixed ב-bottom-left (RTL), 44x44px, צבע accent. smooth scroll to top בלחיצה.

### 4. CourseEndCTA (src/components/course/CourseEndCTA.tsx)

Props: nextCourse (CourseFrontmatter או null). אם יש קורס הבא - כרטיס עם כותרת, תיאור, אייקון תחום, כפתור CTA. אם null - הודעת סיום חגיגית.

## שינויים בקבצים קיימים

### progress.ts

תיקון getCompletionPercentage: import COURSE_CATALOG, חלוקה ב-COURSE_CATALOG.length במקום 12.

### globals.css

הוספת media query ל-prefers-reduced-motion שמבטל אנימציות.

### CourseHeader.tsx

הוספת gradient רקע עדין לפי domain.color עם opacity 0.05-0.08.

### course/[slug]/page.tsx

אינטגרציה של ReadingProgress, TableOfContents, ScrollToTop, CourseEndCTA.

### layout.tsx

הוספת favicon link ו-openGraph.images למטאדאטה.

### course-catalog.ts

הוספת קורס 16 (ai-agents) ל-COURSE_CATALOG, עדכון DOMAINS (courses: [11, 12, 16] ב-ai-product-leadership), עדכון PATHS (courseNumbers ב-advanced).

## קבצים סטטיים חדשים

- public/favicon.svg - רקטה בצבע accent
- public/og-image.svg - 1200x630 עם שם הפלטפורמה וצבעי המותג

## מבנה קבצים חדשים

```
hamakpetza/
  src/components/course/
    ReadingProgress.tsx     (NEW)
    TableOfContents.tsx     (NEW)
    ScrollToTop.tsx         (NEW)
    CourseEndCTA.tsx         (NEW)
  public/
    favicon.svg             (NEW)
    og-image.svg            (NEW)
  content/courses/
    16-ai-agents.mdx        (NEW)
```

## אילוצים טכניים

- output: export - אין server, הכל static
- כל הרכיבים החדשים הם client components (use client)
- אין PII בתוכן
- כל התוכן בעברית RTL
- MDX components: PromptBlock children חייב להיות string
- QuizQuestion חייב לקבל id ייחודי
- Build חייב להצליח (npm run build)
- 38 טסטים קיימים חייבים לעבור
