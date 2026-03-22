# דרישות - שדרוג מז׳ורי של המקפצה v2.0

## מבוא

שדרוג מקיף של פלטפורמת המקפצה לקראת הפצה רחבה. 4 צירים: UX ורכיבים חדשים, מיתוג, תיקוני באגים, תוכן (שדרוג 15 קורסים + קורס 16 חדש בנושא AI Agents).

## מילון מונחים

- ReadingProgress - סרגל התקדמות קריאה בראש דף הקורס (אחוז גלילה)
- TableOfContents - תוכן עניינים צף בצד שמאל (desktop) עם highlight לסקשן הנוכחי
- ScrollToTop - כפתור חזרה לראש הדף, מופיע אחרי גלילה
- CourseEndCTA - כרטיס הקורס הבא בולט ומעוצב בסוף כל יחידה
- Favicon - אייקון SVG בלשונית הדפדפן
- OGImage - תמונת social sharing

## דרישות

### דרישה 1: תיקון באג getCompletionPercentage

סיפור משתמש: כמשתמש, אני רוצה שאחוז ההשלמה יחושב נכון גם כשמוסיפים קורסים.

#### קריטריוני קבלה

1. GIVEN getCompletionPercentage in progress.ts, WHEN called, THEN it SHALL divide by COURSE_CATALOG.length instead of hardcoded 12
2. GIVEN existing tests, WHEN the fix is applied, THEN all 38 tests SHALL pass
3. GIVEN 16 courses in catalog, WHEN user completed 8, THEN percentage SHALL be 50 not 67

### דרישה 2: רכיב ReadingProgress

סיפור משתמש: כלומד, אני רוצה לראות כמה מהקורס קראתי כדי לדעת כמה נשאר.

#### קריטריוני קבלה

1. WHEN user scrolls a course page, THEN a thin progress bar SHALL appear at the very top of the viewport showing scroll percentage
2. WHEN user is at the top, THEN the bar SHALL show 0 percent width
3. WHEN user reaches the bottom, THEN the bar SHALL show 100 percent width
4. THE bar SHALL be accent color, 3px height, fixed position, z-index above sidebar
5. THE bar SHALL respect prefers-reduced-motion by disabling transition animation

### דרישה 3: רכיב TableOfContents

סיפור משתמש: כלומד, אני רוצה לנווט בקלות בין סקשנים בקורס ארוך.

#### קריטריוני קבלה

1. WHEN a course page loads on desktop (above 1024px), THEN a TOC SHALL appear on the left side
2. THE TOC SHALL extract all h2 headings from the rendered MDX content
3. WHEN user scrolls, THEN the current section SHALL be highlighted in the TOC
4. WHEN user clicks a TOC item, THEN the page SHALL smooth-scroll to that heading
5. WHEN viewport is below 1024px, THEN the TOC SHALL be hidden
6. THE TOC SHALL be sticky with top offset to avoid overlapping the ReadingProgress bar

### דרישה 4: רכיב ScrollToTop

סיפור משתמש: כלומד שגלל למטה, אני רוצה דרך מהירה לחזור לראש הדף.

#### קריטריוני קבלה

1. WHEN user scrolls down more than 400px, THEN a scroll-to-top button SHALL appear
2. WHEN user clicks the button, THEN the page SHALL smooth-scroll to top
3. THE button SHALL be positioned fixed at bottom-left (RTL), with accent styling
4. THE button SHALL have minimum 44x44px touch target
5. WHEN user is near the top, THEN the button SHALL be hidden

### דרישה 5: שדרוג CourseHeader עם gradient רקע

סיפור משתמש: כלומד, אני רוצה שכותרת הקורס תיראה מרשימה ותשדר מקצועיות.

#### קריטריוני קבלה

1. WHEN a course page loads, THEN the CourseHeader SHALL display a subtle gradient background matching the domain color
2. THE gradient SHALL be very subtle (opacity 0.05-0.1) to not interfere with readability
3. THE header SHALL include breadcrumb navigation, course number badge, duration, and path indicator

### דרישה 6: CourseEndCTA - כרטיס הקורס הבא

סיפור משתמש: כלומד שסיים קורס, אני רוצה CTA בולט שמוביל אותי לקורס הבא.

#### קריטריוני קבלה

1. WHEN a course page renders, THEN a prominent next-course card SHALL appear after the content and before CourseNav
2. THE card SHALL show the next course title, description, domain icon, and duration
3. THE card SHALL have a large CTA button with accent color
4. WHEN this is the last course, THEN the card SHALL show a completion celebration message instead

### דרישה 7: Favicon SVG

סיפור משתמש: כמשתמש, אני רוצה לראות אייקון מזהה בלשונית הדפדפן.

#### קריטריוני קבלה

1. WHEN any page loads, THEN the browser tab SHALL display a custom favicon
2. THE favicon SHALL be an SVG rocket icon representing a leap
3. THE favicon SHALL use the accent color
4. THE favicon SHALL be referenced in layout.tsx metadata

### דרישה 8: OG Image לשיתוף חברתי

סיפור משתמש: כמשתמש ששולח קישור, אני רוצה שתופיע תמונה מקצועית בתצוגה המקדימה.

#### קריטריוני קבלה

1. WHEN a link to the platform is shared on social media, THEN an OG image SHALL be displayed
2. THE image SHALL be a static asset at public/og-image.svg
3. THE image SHALL include the platform name, tagline, and branding colors
4. THE image path SHALL be referenced in layout.tsx openGraph metadata

### דרישה 9: prefers-reduced-motion

סיפור משתמש: כמשתמש עם רגישות לתנועה, אני רוצה שהאנימציות יכובו.

#### קריטריוני קבלה

1. WHEN user has prefers-reduced-motion enabled, THEN all CSS animations SHALL be disabled or reduced
2. THIS SHALL be implemented as a media query in globals.css

### דרישה 10: קורס 16 - סוכני AI

סיפור משתמש: כמוביל AI, אני רוצה ללמוד על סוכני AI, Claude Code, Kiro, MCP ומערכות מרובות סוכנים.

#### קריטריוני קבלה

1. WHEN the platform loads, THEN course 16 SHALL appear in the catalog with slug ai-agents
2. THE course SHALL be in domain ai-product-leadership, path advanced
3. THE MDX file SHALL be at content/courses/16-ai-agents.mdx
4. THE course SHALL contain sections on: Agent definition, architecture, types, practical tools, government use cases, risks, exercises, and quiz questions
5. THE course SHALL have at least 5 exercises and 4 quiz questions
6. THE DOMAINS and PATHS arrays in course-catalog.ts SHALL be updated to include course 16

### דרישה 11: שדרוג תוכן קורסים קיימים

סיפור משתמש: כלומד, אני רוצה שכל קורס יהיה מעשי, עשיר בתוכן ורלוונטי.

#### קריטריוני קבלה

1. EACH course SHALL have at least 6 content sections, 3 exercises with PromptBlock, 3 QuizQuestion components, and a KeyTerms section
2. COURSES that are currently thin SHALL be enriched
3. ALL content SHALL be practical with government-specific examples
4. ALL PromptBlock children SHALL be strings not JSX
5. ALL QuizQuestion SHALL have: question, options array, correctIndex, explanation, and unique id
