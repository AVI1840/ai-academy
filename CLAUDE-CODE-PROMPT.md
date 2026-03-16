# פרומפט ל-Claude Code — שדרוג מקצה לקצה של פלטפורמת "המקפצה"

## העתק את כל מה שלמטה ותדביק ב-Claude Code

---

אתה מהנדס Full-Stack בכיר. המשימה שלך: לקחת פלטפורמת למידה קיימת בשם "המקפצה" (קורס AI למגזר הציבורי בישראל) ולשדרג אותה לרמה מושלמת — מקצה לקצה.

## הפלטפורמה

- **טכנולוגיה:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + MDX (next-mdx-remote)
- **פלט:** Static Export (`output: 'export'`) → GitHub Pages
- **basePath:** `/ai-academy`
- **כיוון:** RTL (עברית)
- **תיקיית עבודה:** `hamakpetza/`
- **תוכן:** 12 קורסים כקבצי MDX ב-`hamakpetza/content/courses/`
- **מצב נוכחי:** קורסים 01-06 קיימים עם תוכן מלא. קורסים 07-12 חסרים (אין קבצי MDX)

## מבנה הפרויקט

```
hamakpetza/
├── content/courses/          # קבצי MDX — התוכן
│   ├──