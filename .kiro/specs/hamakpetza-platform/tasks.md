# תוכנית יישום — "המקפצה" (Implementation Plan)

## סקירה כללית

תוכנית יישום מלאה לפלטפורמת "המקפצה" — אפליקציית Next.js סטטית עם 12 קורסי AI בעברית, עיצוב בהשראת Anthropic, ותמיכת RTL מלאה. המשימות מאורגנות בסדר אינקרמנטלי כך שכל שלב בונה על הקודם, עם בדיקות property-based לאימות תכונות נכונות.

## Tasks

- [ ] 1. הקמת תשתית Next.js, Tailwind CSS ומערכת עיצוב
  - [ ] 1.1 Initialize Next.js project with TypeScript, Tailwind CSS, and `@tailwindcss/typography` plugin
    - Create `package.json` with dependencies: `next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/typography`, `next-mdx-remote`
    - Configure `next.config.mjs` with `output: 'export'`, `basePath: '/ai-academy'`, `images: { unoptimized: true }`, `trailingSlash: true`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 12.3_

  - [ ] 1.2 Configure Tailwind design tokens and RTL typography
    - Create `tailwind.config.ts` with custom colors (`bg: #faf9f5`, `text: #141413`, `accent: #d97757`, `secondary: #6a9bcc`), font families (Heebo, Frank Ruhl Libre, Fira Code), base font size 18px/1.7, `maxWidth.reading: 48rem`
    - Configure `typography` plugin with RTL direction, serif body, sans-serif headings
    - _Requirements: 1.4, 1.5, 1.6, 10.1, 10.2, 10.3, 10.5, 10.6_

  - [ ] 1.3 Create root layout with RTL, Hebrew fonts, and CSP
    - Create `src/app/layout.tsx` with `dir="rtl"` and `lang="he"` on `<html>` element
    - Load Google Fonts (Heebo, Frank Ruhl Libre) over HTTPS
    - Add Content Security Policy meta tag restricting script-src to self
    - Create `src/styles/globals.css` with Tailwind directives and CSS logical properties
    - _Requirements: 1.1, 1.2, 1.3, 12.5, 12.6_

  - [ ]* 1.4 Write property test: RTL attributes on all pages (Property 1)
    - **Property 1: RTL attributes on all pages**
    - Verify root HTML element contains `dir="rtl"` and `lang="he"`
    - **Validates: Requirements 1.1**

  - [ ]* 1.5 Write property test: Color contrast WCAG AA (Property 18)
    - **Property 18: Color contrast ratios meet WCAG AA**
    - For all text/background color pairs in design tokens, verify contrast ratio ≥ 4.5:1 (normal) and ≥ 3:1 (large text)
    - Use `fc.constantFrom(...colorPairs)` generator
    - **Validates: Requirements 11.2**

- [ ] 2. Checkpoint — תשתית בסיסית
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. מודלי נתונים, קטלוג קורסים ומנוע progress
  - [ ] 3.1 Create data models and TypeScript interfaces
    - Create `src/data/course-catalog.ts` with `COURSE_CATALOG` (12 courses), `DOMAINS` (6 domains), `PATHS` (3 paths)
    - Define TypeScript types: `CourseFrontmatter`, `LearningDomain`, `LearningPath`, `DomainInfo`, `PathInfo`, `ProgressState`
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 3.2 Write property test: Course catalog integrity (Property 20)
    - **Property 20: Course catalog integrity**
    - Verify catalog contains exactly 12 courses, each in exactly one domain and one path, no duplicates
    - **Validates: Requirements 14.1, 14.2, 14.3**

  - [ ] 3.3 Implement localStorage progress API (`src/lib/progress.ts`)
    - Implement `loadProgress()`: read from localStorage key `hamakpetza_progress`, parse JSON, handle corrupt data by resetting to default empty state
    - Implement `saveProgress(state: ProgressState)`: serialize and write to localStorage
    - Implement `markModuleComplete(courseNumber: number)`: add to completedModules array
    - Implement `saveQuizAnswer(quizId: string, selectedIndex: number, revealed: boolean)`
    - Handle missing localStorage gracefully (reset to initial state)
    - _Requirements: 3.5, 3.6, 7.6, 12.2, 12.4_

  - [ ]* 3.4 Write property test: Progress persistence round-trip (Property 7)
    - **Property 7: Progress persistence round-trip**
    - For any valid ProgressState, write to localStorage then read back → equivalent object
    - Use `fc.record({ completedModules: fc.subarray([1..12]), ... })` generator
    - **Validates: Requirements 3.5, 3.6**

  - [ ]* 3.5 Write property test: Progress data contains no PII (Property 19)
    - **Property 19: Progress data contains no PII**
    - For any ProgressState, serialized JSON must not match PII patterns (Israeli ID, email, phone)
    - **Validates: Requirements 12.2**

  - [ ]* 3.6 Write property test: Dashboard completion percentage (Property 5)
    - **Property 5: Dashboard completion percentage calculation**
    - For any subset of {1..12}, completion = `completedModules.length / 12 * 100`
    - Use `fc.subarray([1,2,3,4,5,6,7,8,9,10,11,12])` generator
    - **Validates: Requirements 3.2**

  - [ ]* 3.7 Write property test: Domain progress updates (Property 6)
    - **Property 6: Domain progress updates on course completion**
    - For any course completion, the containing domain's progress increments by 1
    - **Validates: Requirements 3.4**

- [ ] 4. Checkpoint — מודלי נתונים ו-progress
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. רכיבי Layout — AppShell ו-Sidebar
  - [ ] 5.1 Implement AppShell component (`src/components/layout/AppShell.tsx`)
    - Create grid layout: sidebar (fixed/collapsible) + main content area (`max-w-3xl`)
    - Manage sidebar open/close state
    - Respond to 768px breakpoint for default collapsed state
    - Wrap children with Error Boundary at root level
    - _Requirements: 1.6, 2.5, 13.1_

  - [ ] 5.2 Implement Sidebar component (`src/components/layout/Sidebar.tsx`)
    - Display 12 courses grouped by 6 LearningDomains
    - Collapsed state: domain icons only; Expanded state: full course list with completion checkmarks
    - Active course highlighted with accent color `#d97757`
    - Smooth CSS transition for collapse/expand
    - Below 768px: overlay mode with hamburger button
    - Read completion status from ProgressState
    - Include ARIA labels and keyboard navigation support
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 11.3, 11.4, 11.7, 13.2_

  - [ ]* 5.3 Write property test: Sidebar groups all courses by domain (Property 2)
    - **Property 2: Sidebar groups all courses by domain**
    - For any valid catalog, Sidebar displays all 12 courses, each under exactly one domain
    - **Validates: Requirements 2.1**

  - [ ]* 5.4 Write property test: Sidebar active course indicator (Property 3)
    - **Property 3: Sidebar active course indicator**
    - For any course slug, exactly that course is marked active and no other
    - **Validates: Requirements 2.4**

  - [ ]* 5.5 Write property test: Sidebar completion status (Property 4)
    - **Property 4: Sidebar completion status reflects progress**
    - For any ProgressState, completion indicators match exactly the completed modules
    - **Validates: Requirements 2.6**

  - [ ]* 5.6 Write unit tests for Sidebar
    - Test collapsed/expanded rendering
    - Test active course highlighting
    - Test mobile overlay behavior
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 6. רכיבי MDX — PromptBlock, QuizQuestion, KeyTerms
  - [ ] 6.1 Implement PromptBlock component (`src/components/mdx/PromptBlock.tsx`)
    - Render prompt text in monospace font within visually distinct container
    - Copy-to-clipboard button at top-left (RTL)
    - Show checkmark icon for 2 seconds after successful copy
    - Fallback to text selection if Clipboard API unavailable
    - Preserve whitespace and line breaks
    - Horizontal scroll on mobile for long lines
    - ARIA label on copy button
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 11.3, 13.5_

  - [ ]* 6.2 Write property test: PromptBlock clipboard copy (Property 10)
    - **Property 10: PromptBlock clipboard copy**
    - For any string, copy action places exact string on clipboard
    - Use `fc.string()` generator
    - **Validates: Requirements 5.3**

  - [ ]* 6.3 Write property test: PromptBlock whitespace preservation (Property 11)
    - **Property 11: PromptBlock whitespace preservation**
    - For any multi-line string, rendered output preserves all whitespace and line breaks
    - Use `fc.string().filter(s => s.includes('\n'))` generator
    - **Validates: Requirements 5.6**

  - [ ] 6.4 Implement QuizQuestion component (`src/components/mdx/QuizQuestion.tsx`)
    - Display question with multiple answer options
    - On answer selection: visual correct/incorrect indication
    - "חשוף תשובה" button to reveal correct answer + explanation
    - Explanation hidden until revealed
    - Save answer state to localStorage via progress API
    - ARIA labels for interactive elements
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 11.3_

  - [ ]* 6.5 Write property test: QuizQuestion correct/incorrect (Property 13)
    - **Property 13: QuizQuestion correct/incorrect indication**
    - For any correctIndex and selectedIndex, "correct" iff selectedIndex === correctIndex
    - Use `fc.nat(3)` generators
    - **Validates: Requirements 7.2**

  - [ ]* 6.6 Write property test: QuizQuestion reveal toggle (Property 14)
    - **Property 14: QuizQuestion reveal toggle**
    - Explanation hidden when revealed=false, visible when revealed=true
    - Use `fc.boolean()` generator
    - **Validates: Requirements 7.4, 7.5**

  - [ ]* 6.7 Write property test: QuizQuestion state persistence (Property 15)
    - **Property 15: QuizQuestion state persistence**
    - For any quiz answer event, write to localStorage and read back → equivalent state
    - Use `fc.record({ selectedIndex: fc.nat(), revealed: fc.boolean() })` generator
    - **Validates: Requirements 7.6**

  - [ ] 6.8 Implement KeyTerms component (`src/components/mdx/KeyTerms.tsx`)
    - Display key terms in a styled glossary-like container
    - Support Hebrew RTL text
    - _Requirements: 4.2_

- [ ] 7. Checkpoint — רכיבי Layout ו-MDX
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. AudioPlayer ו-WhatsApp Share
  - [ ] 8.1 Implement AudioPlayer component (`src/components/mdx/AudioPlayer.tsx`)
    - Sticky positioning at top of viewport
    - Play, pause, seek controls
    - Display current position and total duration
    - Hidden when no audioUrl in frontmatter
    - Continue playback across page navigation (state managed in AppShell)
    - ARIA labels in Hebrew for all controls
    - Compact single-row layout below 768px
    - Graceful error handling for failed audio load
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 11.5, 13.3_

  - [ ]* 8.2 Write property test: AudioPlayer visibility (Property 12)
    - **Property 12: AudioPlayer visibility based on audioUrl**
    - AudioPlayer visible iff frontmatter contains non-empty audioUrl
    - **Validates: Requirements 6.4, 6.5**

  - [ ] 8.3 Implement WhatsAppShare component (`src/components/course/WhatsAppShare.tsx`)
    - Generate WhatsApp share URL: `https://wa.me/?text={encodedMessage}`
    - Format message in Hebrew with course title and direct link
    - Support both 'course' and 'progress' share types
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 8.4 Write property test: WhatsApp share URL generation (Property 16)
    - **Property 16: WhatsApp share URL generation**
    - For any Hebrew title and URL, generated share URL contains URL-encoded title and link
    - Use `fc.tuple(fc.unicodeString(), fc.webUrl())` generator
    - **Validates: Requirements 8.2, 8.4**

- [ ] 9. Dashboard ומעקב התקדמות
  - [ ] 9.1 Implement Dashboard page (`src/app/page.tsx` + `src/components/dashboard/Dashboard.tsx`)
    - Display 6 DomainCards with ProgressRing for each LearningDomain
    - Calculate and display overall completion percentage (completedModules.length / 12 * 100)
    - Present 3 LearningPaths with visual distinction
    - Display 24-week timeline with milestones
    - Author credit: "אביעד יצחקי, מוביל AI ושותפויות, מינהלי גמלאות ביטוח לאומי"
    - WhatsApp share button for overall progress
    - Load progress from localStorage on mount
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 14.4_

  - [ ] 9.2 Implement DomainCard and ProgressRing components
    - Create `src/components/dashboard/DomainCard.tsx`: visual card per domain with course list and completion status
    - Create `src/components/dashboard/ProgressRing.tsx`: circular SVG progress indicator
    - _Requirements: 3.1, 3.4_

  - [ ] 9.3 Implement PathSelector component (`src/components/dashboard/PathSelector.tsx`)
    - Display 3 learning paths with visual distinction
    - On path selection, highlight relevant courses
    - _Requirements: 3.3, 14.5_

  - [ ]* 9.4 Write property test: Path selection highlights correct courses (Property 21)
    - **Property 21: Path selection highlights correct courses**
    - For any selected LearningPath, highlighted courses match exactly the path's courseNumbers
    - **Validates: Requirements 14.5**

  - [ ]* 9.5 Write unit tests for Dashboard
    - Test 6 domain cards rendered
    - Test 3 learning paths displayed
    - Test author credit text present
    - Test progress calculation display
    - _Requirements: 3.1, 3.2, 3.3, 3.7_

- [ ] 10. Checkpoint — AudioPlayer, WhatsApp, Dashboard
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. מנוע MDX וניתוב דינמי לקורסים
  - [ ] 11.1 Implement MDX compilation utilities (`src/lib/mdx.ts` + `src/lib/courses.ts`)
    - Create `getAllCourses()`: read all MDX files from `content/courses/`, extract frontmatter
    - Create `getCourseBySlug(slug: string)`: load and compile specific MDX file with `next-mdx-remote`
    - Create `getCourseSlugs()`: return all slugs for `generateStaticParams`
    - _Requirements: 4.1, 4.4, 15.1, 15.4_

  - [ ] 11.2 Implement ModuleRenderer component (`src/components/course/ModuleRenderer.tsx`)
    - Render MDX content with Tailwind Typography (`prose`) styling
    - Inject custom components: PromptBlock, QuizQuestion, KeyTerms, AudioPlayer
    - Display CourseHeader with frontmatter metadata (title, duration, audience, exercise count)
    - Serif font for body, sans-serif for headings
    - Error placeholder for invalid/missing components (no crash)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 11.3 Write property test: Frontmatter metadata extraction (Property 9)
    - **Property 9: Frontmatter metadata extraction**
    - For any valid CourseFrontmatter, serialize to YAML then parse back → equivalent object
    - Use `fc.record({ slug: fc.string(), title: fc.string(), ... })` generator
    - **Validates: Requirements 4.4**

  - [ ]* 11.4 Write property test: MDX custom component rendering (Property 8)
    - **Property 8: MDX custom component rendering**
    - For any registered component name, MDX containing that tag renders without error
    - **Validates: Requirements 4.2**

  - [ ] 11.5 Create dynamic course route (`src/app/course/[slug]/page.tsx`)
    - Implement `generateStaticParams` returning all 12 course slugs
    - Load MDX content via `getCourseBySlug`
    - Render with ModuleRenderer
    - Include AudioPlayer if frontmatter has audioUrl
    - Include WhatsAppShare button
    - _Requirements: 15.1, 15.2, 15.4_

  - [ ] 11.6 Implement CourseNav component (`src/components/course/CourseNav.tsx`)
    - Previous/next course navigation links at bottom of each course page
    - Course 1: no previous link; Course 12: no next link
    - _Requirements: 15.5_

  - [ ]* 11.7 Write property test: Route-to-content mapping (Property 22)
    - **Property 22: Route-to-content mapping**
    - For any course in catalog, `/course/{slug}` loads MDX with matching frontmatter slug
    - **Validates: Requirements 15.1, 15.2**

  - [ ]* 11.8 Write property test: Course navigation prev/next (Property 23)
    - **Property 23: Course navigation prev/next links**
    - For course N (1 < N < 12): prev link to N-1, next link to N+1. Course 1: no prev. Course 12: no next.
    - Use `fc.integer({ min: 1, max: 12 })` generator
    - **Validates: Requirements 15.5**

  - [ ] 11.9 Create styled 404 page (`src/app/not-found.tsx`)
    - Hebrew-language 404 page with navigation back to Dashboard
    - Consistent with DesignSystem styling
    - _Requirements: 15.3_

- [ ] 12. Checkpoint — MDX engine וניתוב
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. מיגרציית תוכן — המרת 12 קורסי HTML ל-MDX
  - [ ] 13.1 Create MDX template and migrate courses 1-4
    - Create `content/courses/` directory structure
    - Convert `site/course1.html` → `01-ai-literacy.mdx` with frontmatter
    - Convert `site/course2.html` → `02-model-map.mdx` with frontmatter
    - Convert `site/course3.html` → `03-prompt-engineering.mdx` with frontmatter
    - Convert `site/course4.html` → `04-ai-writing.mdx` with frontmatter
    - Replace inline HTML prompt boxes with `<PromptBlock>` components
    - Replace exercise sections with `<QuizQuestion>` components where applicable
    - Add proper frontmatter metadata (title, duration, audience, domain, path)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [ ] 13.2 Migrate courses 5-8
    - Convert `site/course5.html` → `05-ai-data-analysis.mdx`
    - Convert `site/course6.html` → `06-ai-research.mdx`
    - Convert `site/course7.html` → `07-ai-strategic-thinking.mdx`
    - Convert `site/course8.html` → `08-ai-ethics-gov.mdx`
    - Apply same PromptBlock/QuizQuestion component replacements
    - Add proper frontmatter metadata
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [ ] 13.3 Migrate courses 9-12
    - Convert `site/course9.html` → `09-ai-public-service.mdx`
    - Convert `site/course10.html` → `10-ai-automation.mdx`
    - Convert `site/course11.html` → `11-rag.mdx`
    - Convert `site/course12.html` → `12-claude-code.mdx`
    - Apply same PromptBlock/QuizQuestion component replacements
    - Add proper frontmatter metadata
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.6_

  - [ ]* 13.4 Write property test: Content migration text preservation (Property 17)
    - **Property 17: Content migration text preservation**
    - For all 12 courses, visible text from rendered MDX ≈ visible text from original HTML
    - **Validates: Requirements 9.5**

- [ ] 14. Checkpoint — מיגרציית תוכן
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. נגישות, רספונסיביות ואבטחה
  - [ ] 15.1 Accessibility audit and fixes
    - Add ARIA labels to all interactive elements (buttons, nav, audio controls) in Hebrew
    - Ensure full keyboard navigation with visible focus indicators on all interactive elements
    - Use semantic HTML elements (`nav`, `main`, `article`, `aside`, `header`, `footer`)
    - Add `alt` text or `aria-label` for all non-decorative visual elements
    - Ensure all touch targets are at least 44x44px on mobile
    - Ensure minimum 16px font size on all viewports
    - _Requirements: 11.1, 11.3, 11.4, 11.5, 11.6, 11.7, 13.4, 13.6_

  - [ ] 15.2 Mobile responsiveness pass
    - Verify layout adapts for viewports 320px–1920px
    - Sidebar: overlay with hamburger below 768px
    - AudioPlayer: compact single-row below 768px
    - PromptBlock: horizontal scroll for long lines on mobile
    - _Requirements: 13.1, 13.2, 13.3, 13.5_

  - [ ] 15.3 Implement PII scanner hook (`src/lib/pii-scanner.ts` + `.kiro/hooks/`)
    - Create PII pattern scanner for Israeli ID (9 digits), email, phone patterns
    - Scan only text-based files: `.ts`, `.tsx`, `.mdx`, `.md`, `.json`
    - Skip binary files
    - Create pre-commit hook configuration in `.kiro/` directory
    - On PII detection: block commit, display warning with file and line number
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ]* 15.4 Write property test: PII pattern detection (Property 24)
    - **Property 24: PII pattern detection**
    - For any string containing Israeli ID (9 digits), email, or phone pattern → scanner flags it
    - Use `fc.oneof(israeliId, email, phone)` generators
    - **Validates: Requirements 16.1, 16.2**

  - [ ]* 15.5 Write property test: PII scanner file type filtering (Property 25)
    - **Property 25: PII scanner file type filtering**
    - Scanner processes file iff extension is `.ts`, `.tsx`, `.mdx`, `.md`, `.json`
    - Use `fc.tuple(fc.string(), fc.constantFrom('.ts', '.tsx', '.mdx', '.md', '.json', '.png', '.jpg'))` generator
    - **Validates: Requirements 16.4**

- [ ] 16. Checkpoint — נגישות ואבטחה
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. GitHub Pages deployment ואינטגרציה סופית
  - [ ] 17.1 Configure GitHub Actions workflow for static deployment
    - Create `.github/workflows/deploy.yml`: build with `next build`, deploy `/out` to `gh-pages` branch
    - Set `basePath: '/ai-academy'` in all asset references
    - Verify static export produces all 12 course routes + dashboard + 404
    - _Requirements: 12.3, 15.4_

  - [ ] 17.2 Wire all components together and final integration
    - Ensure AppShell wraps all pages with Sidebar + AudioPlayer state
    - Verify Dashboard loads progress and displays all 6 domains
    - Verify course pages render MDX with all custom components
    - Verify navigation (Sidebar, CourseNav, 404) works end-to-end
    - Verify WhatsApp share on course pages and Dashboard
    - _Requirements: 1.1–1.6, 2.1–2.6, 3.1–3.7, 4.1–4.6, 15.1–15.5_

- [ ] 18. Final checkpoint — אינטגרציה סופית
  - Ensure all tests pass, ask the user if questions arise.

## הערות

- משימות המסומנות ב-`*` הן אופציונליות וניתן לדלג עליהן ל-MVP מהיר יותר
- כל משימה מפנה לדרישות ספציפיות לצורך מעקב
- Checkpoints מבטיחים אימות אינקרמנטלי
- Property tests מאמתים תכונות נכונות אוניברסליות (25 properties מהעיצוב)
- Unit tests מאמתים דוגמאות ספציפיות ו-edge cases
- שפת היישום: TypeScript עם Next.js 14+ App Router
