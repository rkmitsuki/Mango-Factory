# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `/about` into a clean, premium about page focused on the mango journey and freshness story.

**Architecture:** Keep the route at `app/about/page.tsx`, replace the utility-first content with a story-first layout, and extend `app/globals.css` with a small set of about-page-specific classes. Update contract tests to assert the new editorial copy and retained CTA links.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind-global CSS, Node test runner

---

### Task 1: Update route contract

**Files:**
- Modify: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing test**

Add assertions that `/about` contains journey-led copy instead of visit-first copy:

```js
assert.match(route, /From mango farm to plate/i);
assert.match(route, /small-batch/i);
assert.match(route, /ripe fruit/i);
assert.match(route, /View menu/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because the old route content still says `Visit Mango Factory.`

- [ ] **Step 3: Write minimal implementation**

Replace the old utility-page assertions with story-page assertions and keep the nav link assertion.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/site-contract.test.mjs
git commit -m "test: update about page contract"
```

### Task 2: Rewrite `/about`

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Write the failing test**

Use Task 1’s updated assertions as the route contract.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL on missing story copy

- [ ] **Step 3: Write minimal implementation**

Replace the page with:

```tsx
<main className="subpage-main info-page">
  <section className="section-shell info-hero">...</section>
  <section className="section-shell info-story-grid">...</section>
  <section className="section-shell info-ethos">...</section>
  <section className="section-shell info-origin">...</section>
  <section className="section-shell info-band">...</section>
</main>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: rewrite info page as about story"
```

### Task 3: Add premium about-page styling

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing test**

No CSS-specific automated test exists; rely on build verification after route implementation.

- [ ] **Step 2: Run test to verify current safety**

Run: `npm run build`
Expected: PASS before styling changes

- [ ] **Step 3: Write minimal implementation**

Add classes for:

```css
.info-kicker
.info-story-grid
.info-story-card
.info-ethos
.info-origin
.info-principles
```

Use calm gradients, restrained borders, and responsive single-column collapse.

- [ ] **Step 4: Run build to verify it passes**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "style: add editorial about page layout"
```

### Task 4: Full verification

**Files:**
- Verify only

- [ ] **Step 1: Run focused tests**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run full build**

Run: `npm run build`
Expected: PASS with `/about` in route output

- [ ] **Step 4: Review diff**

Run: `git diff -- app/about/page.tsx app/globals.css tests/site-contract.test.mjs`
Expected: only about-page route, styles, and tests changed for this task

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx app/globals.css tests/site-contract.test.mjs docs/superpowers/specs/2026-06-28-about-page-design.md docs/superpowers/plans/2026-06-28-about-page.md
git commit -m "feat: turn info route into editorial about page"
```
