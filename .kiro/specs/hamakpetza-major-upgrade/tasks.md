# משימות יישום - שדרוג המקפצה v2.0

## Tasks

- [ ] 1. תיקון באג progress.ts + עדכון טסטים
  - [ ] 1.1 ב-progress.ts שנה getCompletionPercentage לחלק ב-COURSE_CATALOG.length במקום 12
  - [ ] 1.2 עדכן טסטים ב-progress.test.ts בהתאם
  - [ ] 1.3 הרץ npx vitest run וודא שעובר
  - דרישה: 1

- [ ] 2. הוספת קורס 16 לקטלוג
  - [ ] 2.1 הוסף קורס 16 ל-COURSE_CATALOG (slug: ai-agents, domain: ai-product-leadership, path: advanced)
  - [ ] 2.2 עדכן DOMAINS - הוסף 16 ל-ai-product-leadership
  - [ ] 2.3 עדכן PATHS - הוסף 16 ל-advanced
  - [ ] 2.4 הרץ npx vitest run
  - דרישה: 10

- [ ] 3. יצירת רכיבי UX חדשים
  - [ ] 3.1 צור ReadingProgress.tsx - סרגל 3px fixed בראש, צבע accent, z-50
  - [ ] 3.2 צור ScrollToTop.tsx - כפתור fixed bottom-left, מופיע אחרי 400px גלילה
  - [ ] 3.3 צור TableOfContents.tsx - sticky בצד שמאל, חולץ h2, IntersectionObserver, מוסתר מתחת 1024px
  - דרישות: 2, 3, 4

- [ ] 4. שדרוג CourseHeader + CourseEndCTA
  - [ ] 4.1 עדכן CourseHeader - gradient רקע עדין לפי domain.color
  - [ ] 4.2 צור CourseEndCTA.tsx - כרטיס הקורס הבא בולט, או הודעת סיום אם אחרון
  - דרישות: 5, 6

- [ ] 5. אינטגרציה בדף הקורס
  - [ ] 5.1 עדכן course/[slug]/page.tsx - הוסף ReadingProgress, TableOfContents, ScrollToTop, CourseEndCTA
  - [ ] 5.2 הרץ npm run build וודא שעובד
  - דרישות: 2, 3, 4, 5, 6

- [ ] 6. מיתוג - favicon + OG image
  - [ ] 6.1 צור public/favicon.svg - רקטה בצבע accent
  - [ ] 6.2 צור public/og-image.svg - 1200x630 עם שם ותת-כותרת
  - [ ] 6.3 עדכן layout.tsx - הוסף favicon link ו-openGraph.images
  - דרישות: 7, 8

- [ ] 7. prefers-reduced-motion
  - [ ] 7.1 הוסף media query ל-globals.css שמבטל אנימציות
  - דרישה: 9

- [ ] 8. יצירת קורס 16 MDX
  - [ ] 8.1 צור content/courses/16-ai-agents.mdx עם תוכן מלא: הגדרת Agent, ארכיטקטורה, סוגים, כלים מעשיים, תרחישי ממשלה, סיכונים, 5 תרגילים, 4 שאלות חידון, מושגי מפתח
  - דרישה: 10

- [ ] 9. העשרת קורסים דלים
  - [ ] 9.1 בדוק כל קורס - ודא לפחות 6 סקשנים, 3 תרגילים, 3 שאלות חידון, KeyTerms
  - [ ] 9.2 העשר קורסים שחסרים בהם רכיבים
  - דרישה: 11

- [ ] 10. בדיקות סופיות ו-push
  - [ ] 10.1 הרץ npx vitest run - כל הטסטים חייבים לעבור
  - [ ] 10.2 הרץ npm run build - חייב להצליח
  - [ ] 10.3 בדוק שאין TypeScript errors
  - [ ] 10.4 commit ו-push ל-main
