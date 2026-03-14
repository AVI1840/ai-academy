# מסמך דרישות — "המקפצה" (The Springboard)

## מבוא

"המקפצה" היא פלטפורמת למידת AI פרימיום עבור כ-1,000 מובילי AI במגזר הציבורי בישראל, מכל משרדי הממשלה. הפלטפורמה מחליפה את אתר ה-HTML הסטטי הקיים באפליקציית Next.js מודרנית עם עיצוב ברמת Anthropic, ממשק עברי מלא בכיוון RTL, ו-12 קורסים מעשיים בבינה מלאכותית. הפלטפורמה מיועדת ללמידה עצמית, ללא צורך ברקע טכני, עם דגש על יישום מעשי בעבודה הממשלתית.

## מילון מונחים (Glossary)

- **Platform**: אפליקציית Next.js המהווה את פלטפורמת הלמידה "המקפצה"
- **Dashboard**: דף הבית האינטראקטיבי המציג התקדמות הלומד ב-6 תחומי למידה
- **ModuleRenderer**: רכיב המרנדר תוכן MDX עם רכיבי Tailwind Typography מותאמים
- **PromptBlock**: רכיב UI המציג פרומפטים בפונט monospace עם כפתור העתקה ללוח
- **AudioPlayer**: נגן שמע דביק (sticky) לשילוב תוכן NotebookLM
- **Sidebar**: תפריט צד מתקפל לניווט בין קורסים ומודולים
- **CourseModule**: יחידת תוכן בודדת מתוך 12 הקורסים בפלטפורמה
- **LearningDomain**: אחד מ-6 תחומי הלמידה (בסיס, הנדסת AI, פיתוח בסיוע AI, בניית מוצרי AI, AI לממשלה, מנהיגות מוצר AI)
- **LearningPath**: אחד מ-3 מסלולי הלמידה (בסיס, יישומי, מתקדם)
- **QuizQuestion**: רכיב שאלת בדיקה עם פונקציונליות חשיפת תשובה
- **DesignSystem**: מערכת העיצוב בהשראת Anthropic הכוללת צבעים, טיפוגרפיה ורכיבים
- **ContentMigration**: תהליך המרת 12 דפי HTML סטטיים לתוכן MDX מובנה

---

## דרישות

### דרישה 1: תשתית Next.js עם תמיכת RTL

**סיפור משתמש:** כמפתח, אני רוצה תשתית Next.js מוגדרת עם Tailwind CSS ותמיכת RTL מלאה, כדי שהפלטפורמה תתמוך בממשק עברי מלא מהיסוד.

#### קריטריוני קבלה

1. THE Platform SHALL render all pages with `dir="rtl"` and `lang="he"` attributes on the HTML element
2. THE Platform SHALL use CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of physical direction properties (`margin-left`, `padding-right`) for all layout styling
3. THE Platform SHALL load and apply Hebrew fonts (Heebo for headings, Frank Ruhl Libre for body text) with appropriate fallbacks
4. WHEN a page is loaded, THE Platform SHALL apply the DesignSystem color tokens: background `#faf9f5`, text `#141413`, accent `#d97757`, secondary `#6a9bcc`
5. THE Platform SHALL use a base font size of 18px with a line-height of 1.7 for body text
6. THE Platform SHALL constrain the main reading column to a maximum width of `max-w-3xl` (48rem)

---

### דרישה 2: מערכת ניווט — Sidebar מתקפל

**סיפור משתמש:** כלומד, אני רוצה תפריט צד מתקפל שמאפשר ניווט בין 12 הקורסים, כדי שאוכל לעבור בקלות בין מודולים בלי לאבד את ההקשר.

#### קריטריוני קבלה

1. THE Sidebar SHALL display a navigable list of all 12 CourseModules grouped by LearningDomain
2. WHEN the user clicks the toggle button, THE Sidebar SHALL collapse or expand with a smooth CSS transition
3. WHILE the Sidebar is collapsed, THE Platform SHALL display only icons for each LearningDomain
4. THE Sidebar SHALL visually indicate the currently active CourseModule using the accent color (`#d97757`)
5. WHEN the viewport width is below 768px, THE Sidebar SHALL default to a collapsed state
6. THE Sidebar SHALL indicate completion status for each CourseModule using a visual checkmark or progress indicator

---

### דרישה 3: Dashboard אינטראקטיבי עם מעקב התקדמות

**סיפור משתמש:** כמוביל AI במגזר הציבורי, אני רוצה לוח מחוונים שמציג את ההתקדמות שלי ב-6 תחומי למידה, כדי שאוכל לעקוב אחרי הלמידה שלי לאורך 24 שבועות.

#### קריטריוני קבלה

1. THE Dashboard SHALL display progress visualization for each of the 6 LearningDomains
2. THE Dashboard SHALL calculate and display overall completion percentage based on completed CourseModules
3. THE Dashboard SHALL present the 3 LearningPaths (בסיס, יישומי, מתקדם) with visual distinction between them
4. WHEN a user completes a CourseModule, THE Dashboard SHALL update the corresponding LearningDomain progress indicator
5. THE Dashboard SHALL persist progress data in the browser's localStorage
6. WHEN the Dashboard is loaded, THE Dashboard SHALL restore previously saved progress from localStorage
7. THE Dashboard SHALL display the author credit: "אביעד יצחקי, מוביל AI ושותפויות, מינהלי גמלאות ביטוח לאומי"

---

### דרישה 4: רנדור תוכן MDX עם רכיבים מותאמים

**סיפור משתמש:** כמפתח תוכן, אני רוצה מערכת רנדור MDX עם רכיבים מותאמים, כדי שאוכל לכתוב תוכן קורסים עשיר עם אלמנטים אינטראקטיביים.

#### קריטריוני קבלה

1. THE ModuleRenderer SHALL parse and render MDX content files with Tailwind Typography (`prose`) styling
2. THE ModuleRenderer SHALL support embedding custom components (PromptBlock, QuizQuestion, KeyTerms) within MDX content
3. THE ModuleRenderer SHALL render Hebrew text with correct RTL typography including proper list markers and blockquote alignment
4. WHEN an MDX file contains a frontmatter section, THE ModuleRenderer SHALL extract metadata (title, duration, audience, exercise count) and display it in the course header
5. THE ModuleRenderer SHALL apply the DesignSystem typography: serif font for body text, sans-serif font for headings
6. WHEN an MDX file references an invalid component, THE ModuleRenderer SHALL render a visible error placeholder instead of crashing

---

### דרישה 5: רכיב PromptBlock עם העתקה ללוח

**סיפור משתמש:** כלומד, אני רוצה לראות פרומפטים מעוצבים עם כפתור העתקה, כדי שאוכל להעתיק פרומפטים ישירות לכלי AI שלי.

#### קריטריוני קבלה

1. THE PromptBlock SHALL display prompt text in a monospace font within a visually distinct container
2. THE PromptBlock SHALL include a copy-to-clipboard button positioned at the top-left corner of the block (RTL layout)
3. WHEN the user clicks the copy button, THE PromptBlock SHALL copy the prompt text to the system clipboard
4. WHEN the text is successfully copied, THE PromptBlock SHALL display a visual confirmation (checkmark icon) for 2 seconds
5. IF the clipboard API is unavailable, THEN THE PromptBlock SHALL fall back to a text selection method and display an instructional tooltip
6. THE PromptBlock SHALL support multi-line prompts with preserved whitespace and line breaks

---

### דרישה 6: נגן שמע דביק (Sticky AudioPlayer)

**סיפור משתמש:** כלומד, אני רוצה נגן שמע דביק שמנגן תוכן NotebookLM, כדי שאוכל להאזין לתוכן תוך כדי גלילה בחומר הכתוב.

#### קריטריוני קבלה

1. THE AudioPlayer SHALL remain fixed at the top of the viewport while the user scrolls through content
2. THE AudioPlayer SHALL provide play, pause, and seek controls
3. THE AudioPlayer SHALL display the current playback position and total duration
4. WHEN a CourseModule includes an audio URL in its frontmatter, THE AudioPlayer SHALL load and prepare the audio source
5. WHEN no audio URL is provided for a CourseModule, THE AudioPlayer SHALL remain hidden
6. WHILE audio is playing and the user navigates to a different CourseModule, THE AudioPlayer SHALL continue playback without interruption

---

### דרישה 7: שאלות בדיקה (QuizQuestion) עם חשיפת תשובה

**סיפור משתמש:** כלומד, אני רוצה שאלות בדיקה בתוך הקורסים עם אפשרות לחשוף את התשובה, כדי שאוכל לבדוק את ההבנה שלי.

#### קריטריוני קבלה

1. THE QuizQuestion SHALL display a question with multiple answer options
2. WHEN the user selects an answer, THE QuizQuestion SHALL visually indicate whether the answer is correct or incorrect
3. THE QuizQuestion SHALL include a "חשוף תשובה" (reveal answer) button
4. WHEN the user clicks the reveal button, THE QuizQuestion SHALL display the correct answer with an explanation
5. WHILE the answer has not been revealed, THE QuizQuestion SHALL keep the explanation hidden
6. THE QuizQuestion SHALL save the user's answer state to localStorage for progress tracking

---

### דרישה 8: שיתוף WhatsApp לוויראליות

**סיפור משתמש:** כלומד, אני רוצה כפתורי שיתוף WhatsApp, כדי שאוכל לשתף קורסים ותובנות עם עמיתים בממשלה.

#### קריטריוני קבלה

1. THE Platform SHALL display a WhatsApp share button on each CourseModule page
2. WHEN the user clicks the WhatsApp share button, THE Platform SHALL open the WhatsApp share dialog with a pre-formatted message containing the course title and URL
3. THE Platform SHALL include a WhatsApp share button on the Dashboard for sharing overall progress
4. THE Platform SHALL format the shared message in Hebrew with the course name and a direct link to the specific module

---

### דרישה 9: מיגרציית תוכן מ-HTML סטטי ל-MDX

**סיפור משתמש:** כמפתח תוכן, אני רוצה להמיר את 12 דפי הקורסים הקיימים מ-HTML סטטי לפורמט MDX, כדי שהתוכן ישתלב בפלטפורמה החדשה עם כל הרכיבים המותאמים.

#### קריטריוני קבלה

1. THE ContentMigration SHALL convert all 12 existing HTML course pages into MDX files with proper frontmatter
2. THE ContentMigration SHALL preserve all textual content, tables, lists, and structural hierarchy from the original HTML
3. THE ContentMigration SHALL replace inline HTML prompt boxes with PromptBlock components
4. THE ContentMigration SHALL replace inline HTML exercise sections with QuizQuestion components where applicable
5. FOR ALL 12 CourseModules, rendering the migrated MDX content then comparing the visible text output SHALL produce equivalent content to the original HTML pages (round-trip content preservation)
6. THE ContentMigration SHALL add appropriate frontmatter metadata (title, duration, audience, domain, path) to each MDX file

---

### דרישה 10: מערכת עיצוב בהשראת Anthropic

**סיפור משתמש:** כלומד, אני רוצה ממשק פרימיום מינימליסטי בהשראת Anthropic, כדי שחוויית הלמידה תהיה נעימה ומקצועית.

#### קריטריוני קבלה

1. THE DesignSystem SHALL define the following color tokens: background `#faf9f5`, text `#141413`, accent `#d97757`, secondary `#6a9bcc`
2. THE DesignSystem SHALL use sans-serif fonts (Heebo/Assistant/Rubik) for headings and serif fonts (Frank Ruhl Libre/Alef) for body text
3. THE DesignSystem SHALL optimize for cognitive load with generous whitespace, clear visual hierarchy, and a maximum reading column width of 48rem
4. THE DesignSystem SHALL provide consistent component styling for cards, buttons, badges, and navigation elements across all pages
5. THE DesignSystem SHALL use warm, muted tones consistent with the Anthropic design aesthetic rather than high-contrast neon colors
6. THE Platform SHALL apply the DesignSystem tokens through Tailwind CSS configuration (`tailwind.config.js`) as custom theme extensions

---

### דרישה 11: נגישות WCAG AA ו-Lighthouse 90+

**סיפור משתמש:** כמוביל AI בממשלה, אני רוצה שהפלטפורמה תעמוד בתקני נגישות WCAG AA, כדי שכל עובדי המדינה יוכלו להשתמש בה.

#### קריטריוני קבלה

1. THE Platform SHALL achieve a Lighthouse Accessibility score of 90 or above on all pages
2. THE Platform SHALL provide sufficient color contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text) between text and background colors
3. THE Platform SHALL include appropriate ARIA labels on all interactive elements (buttons, navigation, audio controls)
4. THE Platform SHALL support full keyboard navigation including focus indicators on all interactive elements
5. WHEN the AudioPlayer is active, THE AudioPlayer SHALL provide accessible controls with ARIA labels in Hebrew
6. THE Platform SHALL include `alt` text or `aria-label` for all non-decorative visual elements
7. THE Platform SHALL use semantic HTML elements (`nav`, `main`, `article`, `aside`, `header`, `footer`) for page structure

---

### דרישה 12: אבטחה בהתאם ל-NIST RMF

**סיפור משתמש:** כמנהל מערכת, אני רוצה שהפלטפורמה תעמוד בדרישות אבטחה של NIST RMF ללא אחסון PII, כדי שהפלטפורמה תהיה בטוחה לשימוש ממשלתי.

#### קריטריוני קבלה

1. THE Platform SHALL execute entirely on the client side without transmitting user data to external servers
2. THE Platform SHALL store progress data exclusively in the browser's localStorage without collecting personally identifiable information (PII)
3. THE Platform SHALL serve all content as static assets deployable on GitHub Pages
4. IF a user clears browser data, THEN THE Platform SHALL handle the missing localStorage data gracefully by resetting progress to initial state
5. THE Platform SHALL include Content Security Policy (CSP) headers that restrict script sources to same-origin
6. THE Platform SHALL load external fonts from Google Fonts over HTTPS only

---

### דרישה 13: רספונסיביות למובייל

**סיפור משתמש:** כלומד, אני רוצה שהפלטפורמה תעבוד היטב במכשירים ניידים, כדי שאוכל ללמוד גם מהטלפון.

#### קריטריוני קבלה

1. THE Platform SHALL adapt layout responsively for viewports from 320px to 1920px width
2. WHEN the viewport width is below 768px, THE Sidebar SHALL collapse to an overlay menu accessible via a hamburger button
3. WHEN the viewport width is below 768px, THE AudioPlayer SHALL resize to a compact single-row layout
4. THE Platform SHALL ensure all touch targets are at least 44x44 pixels on mobile devices
5. THE PromptBlock SHALL display a horizontally scrollable container for long prompt lines on mobile viewports instead of wrapping
6. THE Platform SHALL maintain readable font sizes (minimum 16px) on all viewport sizes to prevent iOS zoom on input focus

---

### דרישה 14: מבנה 12 הקורסים ו-6 תחומי למידה

**סיפור משתמש:** כמעצב תוכנית לימודים, אני רוצה מבנה ברור של 12 קורסים מחולקים ל-6 תחומים ו-3 מסלולים, כדי שהלומדים יוכלו לנווט בתוכנית הלימודים.

#### קריטריוני קבלה

1. THE Platform SHALL organize the following 12 CourseModules: (1) אוריינות AI, (2) מפת המודלים, (3) הנדסת הנחיות, (4) AI לכתיבה ותקשורת, (5) AI לניתוח נתונים, (6) חיפוש ומחקר עם AI, (7) AI לחשיבה אסטרטגית, (8) אתיקה ובטיחות AI בממשלה, (9) AI לשירות הציבור, (10) אוטומציה ותהליכי עבודה, (11) RAG — חיבור AI למאגרי ידע, (12) Claude Code למפתחים
2. THE Platform SHALL group CourseModules into 6 LearningDomains: Foundation, AI Engineering, AI-Assisted Dev, Building AI Products, AI for Gov, AI Product Leadership
3. THE Platform SHALL assign each CourseModule to one of 3 LearningPaths: בסיס (Foundation), יישומי (Applied), מתקדם (Advanced)
4. THE Dashboard SHALL display the 24-week course timeline with LearningDomain milestones
5. WHEN a user selects a LearningPath, THE Platform SHALL highlight the relevant CourseModules and recommended order

---

### דרישה 15: ניתוב דינמי למודולי קורס

**סיפור משתמש:** כלומד, אני רוצה שכל קורס יהיה נגיש דרך URL ייחודי, כדי שאוכל לשתף קישורים ישירים לקורסים ספציפיים.

#### קריטריוני קבלה

1. THE Platform SHALL generate dynamic routes for each CourseModule using the pattern `/course/[slug]`
2. WHEN a user navigates to a course URL, THE Platform SHALL load the corresponding MDX content and render it with the ModuleRenderer
3. IF a user navigates to a non-existent course URL, THEN THE Platform SHALL display a styled 404 page with navigation back to the Dashboard
4. THE Platform SHALL support static site generation (SSG) for all course routes to enable GitHub Pages deployment
5. THE Platform SHALL include navigation links (previous/next course) at the bottom of each CourseModule page

---

### דרישה 16: Kiro Agent Hooks לסריקת אבטחה

**סיפור משתמש:** כמפתח, אני רוצה hooks של Kiro Agent שמריצים סריקת אבטחה לפני commit, כדי למנוע הכנסת מידע רגיש לקוד.

#### קריטריוני קבלה

1. THE Platform SHALL include a pre-commit hook configuration that scans staged files for PII patterns (Israeli ID numbers, email addresses, phone numbers)
2. WHEN the pre-commit hook detects a PII pattern, THE hook SHALL block the commit and display a warning message specifying the file and line number
3. THE Platform SHALL include the hook configuration in the `.kiro/` directory structure
4. THE hook SHALL scan only text-based files (`.ts`, `.tsx`, `.mdx`, `.md`, `.json`) and skip binary files

