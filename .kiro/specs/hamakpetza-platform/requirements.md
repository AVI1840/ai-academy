# Requirements — המקפצה AI Leadership Academy
**Version:** 2.0 (post-audit rewrite, 2026-03-16)

---

## Product Vision

המקפצה is the elite AI leadership operating system for the Israeli government.
It is not a course catalog. It is a structured knowledge environment for senior officials, policy architects, and technology strategists who build AI-native government at scale.

The platform enables leaders to:
- Build mental models of AI systems — not just use tools
- Acquire engineering literacy without becoming engineers
- Deploy AI systems across government with confidence and accountability
- Lead AI strategy, governance, and product decisions with authority

**Tagline:** מערכת ההפעלה של מנהיגות ה-AI הממשלתית

---

## Core Product Principles

1. **Depth over breadth** — each module produces a real artifact, not just awareness
2. **Engineering literacy for leaders** — enough technical understanding to lead, not to code
3. **Government-first context** — every example, case study, and exercise is government-specific
4. **Progressive mastery** — each module builds on the previous; the learning path is a curriculum, not a menu
5. **Minimal cognitive overhead** — the UI disappears; the content is the product
6. **No performative engagement** — no gamification, no streaks, no leaderboards

---

## Feature Requirements

### FR-01: Learning Roadmap
- Display a clear 6-domain learning progression on the Dashboard
- Each domain has 2 modules in a defined sequence
- Visual progress indication per domain (completion ring)
- A "Continue Learning" CTA surfaces the last visited module (from `lastVisited` in localStorage)

### FR-02: Module Pages
- Each module renders MDX with: CourseHeader, body content, PromptBlocks, QuizQuestions, KeyTerms
- AudioPlayer (if `audioUrl` present) shown at top, sticky while scrolling
- "Mark Complete" button at bottom of module
- Prev/Next module navigation links

### FR-03: Prompt Labs
- Every module has at least one `<PromptBlock>` with:
  - Visible prompt text in monospace font
  - One-click copy-to-clipboard
  - Copy confirmation (2s checkmark)
  - Fallback for non-HTTPS environments
  - **Unique ID per instance** — `useId()` or `useRef` to avoid DOM collision between multiple blocks on same page

### FR-04: Interactive Quizzes
- Every module ends with a `<QuizQuestion>` set
- Answer state (selectedIndex, revealed) persists to localStorage per `quizId`
- Correct/incorrect visual feedback on answer reveal
- Explanation shown after reveal

### FR-05: Progress Persistence
- All progress stored client-side in localStorage (`hamakpetza_progress`)
- Versioned schema (version: 1) with migration fallback
- No PII stored (only course numbers, quiz IDs, timestamps)
- `getCompletionPercentage()` uses `COURSE_CATALOG.length` as denominator — **not hardcoded 12**

### FR-06: Sidebar Navigation
- Right-anchored sidebar (RTL) showing all 12 modules grouped by 6 domains
- Expanded: full course titles with completion indicators
- Collapsed: domain color indicators only — **no emojis**
- Active course highlighted with `border-inline-start` accent (RTL-correct, not `border-left`)
- Mobile: overlay mode with backdrop dismissal
- On resize from mobile to desktop, sidebar state resets correctly

### FR-07: Audio Learning
- `AudioPlayer` visible if `audioUrl` is defined in course frontmatter
- Sticky at top of module page during scroll
- Controls: play/pause, seek bar, time display
- ARIA labels in Hebrew

### FR-08: Static Export
- Platform builds as fully static HTML via `next export`
- All 12 course routes pre-generated via `generateStaticParams`
- Compatible with GitHub Pages at `/ai-academy` basePath
- No server-side runtime dependencies

---

## Acceptance Criteria

### AC-01: RTL & Internationalization
- `<html lang="he" dir="rtl">` on every page
- All interactive elements use CSS logical properties (not `left/right` for directional styling)
- Sidebar active indicator uses `border-inline-start`, not `border-left`
- All user-facing text is Hebrew

### AC-02: Accessibility
- All interactive elements have ARIA labels in Hebrew
- Focus visible on keyboard navigation (`outline: 2px solid #d97757`)
- Touch targets minimum 44×44px on mobile
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`
- **No emoji used as primary visual communication** (emojis only decorative with `aria-hidden`)

### AC-03: Typography & Readability
- Body: Frank Ruhl Libre, 18px, line-height 1.7
- Headings: Heebo
- Monospace: Fira Code (prompt blocks)
- Maximum content width: 48rem (reading column) for articles
- Dashboard uses a wider container (max-w-5xl) for the domain grid
- Background: #faf9f5 (warm cream — low eyestrain)

### AC-04: Performance
- Static export — no server round-trips for content
- MDX serialized server-side (not client-side) — eliminates loading flash
- Progress loaded from localStorage on mount with immediate UI update

### AC-05: Data Integrity
- No duplicate course numbers in COURSE_CATALOG
- Every course appears in exactly one domain
- `getDomainProgress` checks `completedModules.includes(courseNumber)` — **not positional index**
- `getCompletionPercentage` uses `COURSE_CATALOG.length` as denominator

### AC-06: Security
- CSP meta tag must allow `script-src 'unsafe-inline'` (required for Next.js static export hydration)
- No PII in localStorage (Israeli ID, email, phone patterns absent — verified by test)
- External links use `rel="noopener noreferrer"`
- No user authentication, no session tokens, no server-side data

---

## Non-Requirements (Explicit Exclusions)

- No gamification (streaks, badges, leaderboards, confetti)
- No user accounts or authentication
- No server-side rendering or database
- No analytics or tracking
- No social feed or peer comparison
- **No WhatsApp share on the main Dashboard progress section**
- **No emoji as domain identifiers in navigation or domain cards**

---

## Content Requirements

### CR-01: Module Structure
Every module MDX file must include these sections in order:
1. **Opening Insight** — a specific government scenario or real incident
2. **Key Terms** (`<KeyTerms>`) — 4–6 defined terms
3. **Concept Explanation** — how the technology works, engineered for non-engineers
4. **Government Case Study** — a real or plausible government implementation
5. **Exercises** — 2–3 concrete exercises with clear success criteria
6. **Prompt Lab** — 3–5 `<PromptBlock>` components with usable prompts
7. **Failure Analysis** — 2–3 common failure modes and how to avoid them
8. **Self-Assessment** (`<QuizQuestion>`) — 3–5 questions

### CR-02: Module Deliverables
Every module must produce at least one real artifact:
- Foundation modules → mental model diagram, comparison matrix
- Engineering modules → prompt library, system prompt template
- Dev workflow modules → data analysis framework, research checklist
- Product building modules → spec.md, workflow map
- Government systems modules → ethics audit checklist, service blueprint
- Leadership modules → RAG architecture diagram, AI project charter

### CR-03: Frontmatter — Required Fields
```yaml
slug: string            # matches COURSE_CATALOG slug exactly
title: string           # matches COURSE_CATALOG title exactly
courseNumber: number
duration: string
audience: string
exerciseCount: number
domain: LearningDomain
path: LearningPath
difficulty: 'foundation' | 'intermediate' | 'advanced'
description: string
deliverables: string[]  # list of artifacts produced
```

---

## Learning Architecture

### 6 Domains — Progression Map

```
FOUNDATION (יסודות)
  01 · אוריינות AI ועבודה אחראית       → artifact: responsible-use framework
  02 · מפת המודלים                     → artifact: model selection matrix

AI ENGINEERING (הנדסת AI)
  03 · הנדסת הנחיות                    → artifact: system prompt library
  04 · AI לכתיבה ותקשורת               → artifact: writing template kit

AI DEVELOPMENT WORKFLOWS (זרימות עבודה עם AI)
  05 · AI לניתוח נתונים                → artifact: analysis prompt framework
  06 · חיפוש ומחקר עם AI              → artifact: research workflow SOP

BUILDING AI PRODUCTS (בניית מוצרי AI)
  07 · AI לחשיבה אסטרטגית             → artifact: strategic analysis template
  10 · אוטומציה ותהליכי עבודה          → artifact: workflow automation spec

AI FOR GOVERNMENT SYSTEMS (מערכות AI לממשלה)
  08 · אתיקה ובטיחות AI בממשלה        → artifact: AI ethics audit checklist
  09 · AI לשירות הציבור               → artifact: citizen service AI blueprint

AI LEADERSHIP & GOVERNANCE (מנהיגות AI)
  11 · RAG — חיבור AI למאגרי ידע      → artifact: RAG architecture design
  12 · Claude Code למפתחים            → artifact: AI development workflow
```

### 3 Learning Paths

| Path | Hebrew | Modules | Audience |
|---|---|---|---|
| foundation | יסודות | 1, 2, 8 | All government staff |
| applied | יישומי | 3, 4, 5, 6, 7, 9, 10 | Practitioners & managers |
| advanced | מתקדם | 11, 12 | AI leads & engineering teams |
