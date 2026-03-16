# Platform Audit — המקפצה
**Date:** 2026-03-16
**Auditor:** Claude Sonnet 4.6 (principal UX + staff engineer perspective)
**Scope:** Full system — IA, UX, UI, code, content, data, branding

---

## 1. What Works Well

### Architecture
- Clean static export via `next export` with `basePath: '/ai-academy'` — correct for GitHub Pages
- MDX-based content system is the right choice; frontmatter structure is solid
- `progress.ts` localStorage API is well-designed: versioned, corrupt-data-safe, no PII stored
- TypeScript strict mode throughout, good type coverage
- `reading-column` (max-inline-size: 48rem) utility is exactly right for long-form reading
- CSS logical properties (`padding-inline`, `margin-inline`) used correctly for RTL
- Design tokens (cream bg, near-black text, terracotta accent) are quality choices
- Frank Ruhl Libre + Heebo font pairing is appropriate for Hebrew academic content
- `QuizQuestion` state persistence in localStorage is well-implemented
- `ErrorBoundary` at AppShell level is a good defensive pattern

### Content
- Courses 1–6 have genuine depth: 8-section pedagogical structure is solid
- PromptBlock library pattern is excellent — learners get immediately usable prompts
- Failure analysis sections in each module are distinctive and high-value
- Quiz questions with explanations are well-constructed

### Testing
- 17 progress API tests cover all edge cases including PII check (Req 12.2)
- Vitest + jsdom setup is correct
- No-PII localStorage test is particularly good

---

## 2. What Is Confusing

### Navigation & Information Architecture
- **Dual course listing**: Dashboard shows both "domain cards" AND "all courses list" — users must scan the same content twice. Redundant and cognitively expensive.
- **PathSelector** (foundation/applied/advanced) + **domain cards** are overlapping navigation systems. Two different ways to slice the same 12 courses creates confusion about how they're organized.
- **Collapsed sidebar icons** are emojis — no clear meaning for domain identity (🏗️ = foundation? not obvious)
- The sidebar title says "קורס AI למגזר הציבורי" — singular "course" when it's actually 12 modules of an academy. Wrong framing.
- **"Reading column" constraint applied to dashboard** — 48rem is correct for article text, but too narrow for a dashboard with domain cards grid. The grid is constrained inside it, limiting cards to ~200px each.

### Content
- `CourseHeader` badge says "יחידה X מתוך 12" — this hardcodes 12, and the word "יחידה" (unit) feels like a school course, not a professional academy module
- **Title mismatch**: course-catalog.ts titles differ from MDX frontmatter titles in multiple courses — confusing for developers maintaining content
- **Courses 7–12**: "תוכן היחידה בהכנה..." on 6 of 12 course pages = 50% of the platform is empty. This severely undermines perceived quality.
- Course descriptions in catalog are generic and undersell the value

### Brand & Positioning
- The hero text "קורס AI למובילי המגזר הציבורי" positions this as "a course" — commoditized, unremarkable
- The tagline "12 יחידות למידה מעשיות" is descriptive but not aspirational
- Author credit at dashboard bottom ("נבנה ע״י אביעד יצחקי") is in a footer — the creator's credentials are the platform's credibility signal and should be better positioned
- WhatsApp share button on the **main progress card** is visually jarring for a professional platform. It clashes with the serious/minimal aesthetic.
- Emoji in OpenGraph title (`🚀 המקפצה`) reduces trust for government/professional audience

---

## 3. What Is Unnecessary

- **WhatsAppShare on the Dashboard progress section** — the share-on-WhatsApp CTA on the main learning progress card is an interruption and reduces the platform's professional tone. Move to course completion only, or remove.
- **PathSelector + domain card grid as separate sections** — one of these is redundant. The domain cards already show completion by path context.
- **Inline CSS `display: 'block'`** in Sidebar at line 47 — unnecessary style, CSS handles `block` behavior.
- **`content-block` utility in globals.css** — defined but not used anywhere in the codebase.
- **`mis-*`/`mie-*`/`pis-*`/`pie-*` utility classes** — partially redundant; Tailwind 3.4 supports logical property utilities natively (`ms-*`, `me-*`, `ps-*`, `pe-*`). The custom ones cause duplication.

---

## 4. What Reduces Perceived Quality

### Critical Quality Reductions
1. **Emoji throughout UI** — `🏗️`, `⚙️`, `🤝`, `🔧`, `🏛️`, `🚀`, `👥`, `✏️`, `📝` in domain cards, sidebar, badges, quiz headers. Emojis are unprofessional for a government leadership academy targeting senior officials. Anthropic and Stripe don't use emojis in their product UI.
2. **"תוכן היחידה בהכנה..."** on 50% of course pages — signals the platform is incomplete. Either remove these routes or show a meaningful "coming soon" state.
3. **WhatsApp share on progress card** — peers at a government director level don't share their course progress to WhatsApp. This undermines the platform's authority signal.
4. **`ProgressRing` % text is too small** — at 80px size it shows tiny text; at 56px (DomainCard) it's barely readable.
5. **DomainCard completion logic bug** — `domain.courses.indexOf(course.courseNumber) < completedCount` checks the _position_ of a course in the domain array, not whether that specific course is actually completed. Courses can show incorrect checkmarks.
6. **`id="prompt-text"` hardcoded in PromptBlock** — when multiple `<PromptBlock>` components appear on a page (every MDX file has several), the clipboard fallback uses `document.getElementById('prompt-text')` and will always select only the first block's text. Every copy action after the first may silently copy the wrong prompt.
7. **Client-side MDX serialization** in `CourseContent.tsx` — MDX is serialized in the browser on every mount via `useEffect`, causing a visible "טוען תוכן..." flash. Server-side serialization via `next-mdx-remote/rsc` would eliminate this.

### Design Quality Reductions
8. **Dashboard hero is text-heavy but low-hierarchy** — three lines of text at similar weights don't create visual gravity. The platform name should command the page.
9. **Border-only domain cards** look like a list, not a learning path. No visual flow or progression logic.
10. **`border-l-2 border-accent`** in the sidebar course active indicator — this is a `border-left` property in RTL context where `border-inline-start` should be used. The active indicator may appear on the wrong side.

---

## 5. What Reduces Learning Value

- **No explicit learning objectives** shown on the Dashboard per course — users can't decide if a module is worth their time
- **No estimated deliverable output** shown on course cards — users don't know what they'll produce
- **PromptBlock label** is always "💬 פרומפט" — not categorized by type (system prompt, user prompt, template, etc.)
- **Quiz explanations are revealed late** — the "חשוף תשובה" button is the only way to see feedback; there's no automatic feedback after answer selection
- **No "Resume Learning" CTA** on the Dashboard — users who return see the full dashboard with no "continue where you left off" affordance. `lastVisited` is tracked in localStorage but never surfaced in the UI.
- **No module prerequisites shown** — advanced modules (RAG, Claude Code) have no indication that earlier modules are prerequisites

---

## 6. What Must Be Removed

- All emoji from production UI (sidebar, domain cards, badges, quiz headers, OpenGraph)
- `WhatsAppShare` from the Dashboard progress section (keep on course completion page)
- Hardcoded `id="prompt-text"` from PromptBlock
- The `content-block` CSS utility class (unused)
- Redundant course listing on Dashboard (keep domain cards OR flat list, not both)

---

## 7. What Must Be Redesigned

### Urgent
1. **Dashboard hero** — reposition as "מערכת ההפעלה של מנהיגות ה-AI הממשלתית" (The AI Leadership Operating System for Government). Show mission statement, not just description.
2. **Domain cards** — fix the completion logic bug. Replace emoji icons with SVG or colored indicators.
3. **Sidebar** — remove emojis. Use domain color squares + text. Fix `border-left` → `border-inline-start` active indicator.
4. **CourseHeader** — remove emoji badges. Elevate typography. Add deliverable preview.
5. **"Resume Learning" CTA** — surface `lastVisited` from localStorage on Dashboard as a prominent "Continue" button.
6. **PromptBlock** — fix ID bug. Add `useRef` or unique ID per instance. Add prompt type labeling.

### Important
7. **AppShell resize handler** — resize listener updates `isMobile` but NOT `sidebarOpen`. User can open sidebar on mobile, resize to desktop, and have stale state (sidebar may be open on mobile size but not toggled correctly).
8. **CSP in layout.tsx** — `script-src 'self'` without `'unsafe-inline'` blocks Next.js inline hydration scripts in some deployment configurations. Needs `'unsafe-inline'` or nonce-based approach.
9. **`getCompletionPercentage()`** — hardcodes `/ 12`. Should use `COURSE_CATALOG.length`.
10. **Reading column on Dashboard** — 48rem is too narrow for the 3-column domain card grid. Dashboard should use a wider layout container (max-w-6xl or similar) with the reading column only for prose sections.

---

## 8. Summary Scorecard

| Dimension | Score | Notes |
|---|---|---|
| Information Architecture | 5/10 | Dual-listing redundancy, unclear path/domain hierarchy |
| Navigation | 6/10 | Sidebar works, but emoji icons and wrong active border |
| Content Clarity | 7/10 | Good MDX structure; 50% content missing |
| UI Hierarchy | 5/10 | Dashboard hero lacks gravity; cards visually flat |
| Typography | 8/10 | Right fonts, right sizes; heading hierarchy is good |
| Cognitive Load | 5/10 | Too many navigation systems; emoji adds noise |
| Mobile | 7/10 | Sidebar overlay works; reading column is correct |
| RTL Correctness | 8/10 | Mostly correct; sidebar active indicator uses wrong property |
| Component Consistency | 6/10 | 2 active bugs; hardcoded values; emoji inconsistency |
| Code Architecture | 8/10 | Clean separation; good TypeScript; needs 3 bug fixes |
| Data Structure | 9/10 | Solid catalog + progress API; minor title mismatch |
| Learning Value Density | 7/10 | Good where content exists; 6 empty modules hurt badly |
| **Overall** | **6.7/10** | Strong foundation, significant UX/brand debt |
