# Firebase Admin Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hidden Firebase-backed admin page for menu editing and photo uploads, with instant live updates to the homepage and menu page after save.

**Architecture:** Keep Firebase entirely client-side. Public routes render existing static fallback data first, then hydrate to Firestore-backed menu content through a small shared loader. The hidden admin route uses Firebase Auth for email/password login, Firestore as the live menu source of truth, and Firebase Storage for image uploads.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Firebase Auth, Firestore, Firebase Storage, Node test runner, ESLint

---

## File Map

- Create: `lib/firebase.ts`
  - Firebase app initialization and shared client exports for auth, Firestore, and Storage
- Create: `lib/menu-content.ts`
  - Shared menu types, fallback content export, Firestore parsing, homepage signature derivation
- Create: `components/live-home-page.tsx`
  - Client wrapper for homepage content that upgrades from fallback to Firebase data
- Create: `components/admin/auth-form.tsx`
  - Email/password login UI for `/mh-admin`
- Create: `components/admin/menu-editor.tsx`
  - Signed-in admin editor, save flow, upload flow, local editing state
- Create: `app/mh-admin/page.tsx`
  - Hidden admin route entrypoint
- Create: `tests/menu-content.test.mjs`
  - Parser and derivation contract tests
- Modify: `package.json`
  - Add Firebase dependency if missing
- Modify: `lib/site.ts`
  - Trim to non-menu static site constants or re-export fallback menu content from `lib/menu-content.ts`
- Modify: `app/page.tsx`
  - Delegate homepage rendering to live client wrapper
- Modify: `components/mango-menu-page.tsx`
  - Read menu content from shared live loader instead of hardcoded constant
- Modify: `tests/site-contract.test.mjs`
  - Update assertions to match new live-content architecture and hidden admin route
- Modify: `README.md`
  - Add Firebase env setup and admin route notes

## Task 1: Install Firebase and Declare Client Config

**Files:**
- Modify: `package.json`
- Create: `lib/firebase.ts`

- [ ] **Step 1: Write the failing dependency/config test**

Add this test block to `tests/site-contract.test.mjs`:

```js
test("firebase client setup exists for auth firestore and storage", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const firebaseModule = await readFile(new URL("../lib/firebase.ts", import.meta.url), "utf8");

  assert.ok(pkg.dependencies.firebase);
  assert.match(firebaseModule, /initializeApp/);
  assert.match(firebaseModule, /getAuth/);
  assert.match(firebaseModule, /getFirestore/);
  assert.match(firebaseModule, /getStorage/);
  assert.match(firebaseModule, /NEXT_PUBLIC_FIREBASE_API_KEY/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because `firebase` is not installed and `lib/firebase.ts` does not exist

- [ ] **Step 3: Add Firebase dependency**

Update `package.json` dependencies:

```json
{
  "dependencies": {
    "firebase": "^12.0.0",
    "framer-motion": "^12.40.0",
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

- [ ] **Step 4: Create minimal Firebase client module**

Create `lib/firebase.ts`:

```ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseApp = app;
export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: lockfile updates and `firebase` added

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS for the new Firebase setup test

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json lib/firebase.ts tests/site-contract.test.mjs
git commit -m "feat: add firebase client setup"
```

## Task 2: Extract Shared Menu Content Layer

**Files:**
- Create: `lib/menu-content.ts`
- Modify: `lib/site.ts`
- Test: `tests/menu-content.test.mjs`

- [ ] **Step 1: Write the failing parser and derivation tests**

Create `tests/menu-content.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  fallbackMenuSections,
  getSignatureItems,
  parseMenuContentDocument,
} from "../lib/menu-content.js";

test("parseMenuContentDocument accepts valid firestore menu content", () => {
  const parsed = parseMenuContentDocument({
    sections: [
      {
        name: "Burgers",
        note: "Top sellers",
        items: [
          {
            name: "Paneer Burger",
            description: "Savory",
            price: "$16.99",
            tags: ["Top Picks", "Popular"],
            image: "https://example.com/paneer.jpg",
          },
        ],
      },
    ],
    updatedAt: 1,
  });

  assert.equal(parsed.sections[0].name, "Burgers");
  assert.equal(parsed.sections[0].items[0].image, "https://example.com/paneer.jpg");
});

test("parseMenuContentDocument rejects invalid section arrays", () => {
  assert.equal(parseMenuContentDocument({ sections: null }), null);
  assert.equal(parseMenuContentDocument({}), null);
});

test("getSignatureItems prefers top picks and returns four items max", () => {
  const items = getSignatureItems(fallbackMenuSections);
  assert.ok(items.length <= 4);
  assert.ok(items.some((item) => item.tags.includes("Top Picks")));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/menu-content.test.mjs`
Expected: FAIL because `lib/menu-content.ts` does not exist yet

- [ ] **Step 3: Create the shared menu content module**

Create `lib/menu-content.ts`:

```ts
export type MenuItem = {
  name: string;
  description: string;
  price: string;
  tags: string[];
  image: string;
};

export type MenuSection = {
  name: string;
  note: string;
  items: MenuItem[];
};

export type MenuContentDocument = {
  sections: MenuSection[];
  updatedAt?: number;
};

export const fallbackMenuSections: MenuSection[] = [
  {
    name: "Desi Burgers",
    note: "Savory burgers people come back for.",
    items: [
      {
        name: "Desi Veg Paneer Burger",
        description: "Paneer, cheddar, roasted onion, and house chutney on a brioche bun.",
        price: "$16.99",
        tags: ["Burgers", "Popular", "Top Picks"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
];

function isMenuItem(value: unknown): value is MenuItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === "string"
    && typeof item.description === "string"
    && typeof item.price === "string"
    && typeof item.image === "string"
    && Array.isArray(item.tags)
    && item.tags.every((tag) => typeof tag === "string");
}

function isMenuSection(value: unknown): value is MenuSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Record<string, unknown>;
  return typeof section.name === "string"
    && typeof section.note === "string"
    && Array.isArray(section.items)
    && section.items.every(isMenuItem);
}

export function parseMenuContentDocument(value: unknown): MenuContentDocument | null {
  if (!value || typeof value !== "object") return null;
  const doc = value as Record<string, unknown>;
  if (!Array.isArray(doc.sections) || !doc.sections.every(isMenuSection)) return null;
  return {
    sections: doc.sections,
    updatedAt: typeof doc.updatedAt === "number" ? doc.updatedAt : undefined,
  };
}

export function getSignatureItems(sections: MenuSection[]): MenuItem[] {
  const allItems = sections.flatMap((section) => section.items);
  const topPicks = allItems.filter((item) => item.tags.includes("Top Picks"));
  const source = topPicks.length >= 4 ? topPicks : [...topPicks, ...allItems.filter((item) => !topPicks.includes(item))];
  return source.slice(0, 4);
}
```

- [ ] **Step 4: Repoint existing site constants to shared types**

Update the top of `lib/site.ts`:

```ts
import { fallbackMenuSections, type MenuSection } from "@/lib/menu-content";

export type { MenuItem, MenuSection } from "@/lib/menu-content";
```

And replace:

```ts
export const menuSections: MenuSection[] = [
  // existing hardcoded array
];
```

with:

```ts
export const menuSections: MenuSection[] = fallbackMenuSections;
```

- [ ] **Step 5: Expand fallback data to full current menu**

Move the full current `menuSections` array from `lib/site.ts` into `fallbackMenuSections` so no content is lost.

- [ ] **Step 6: Run tests to verify they pass**

Run: `node --test tests/menu-content.test.mjs`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add lib/menu-content.ts lib/site.ts tests/menu-content.test.mjs
git commit -m "refactor: extract shared menu content layer"
```

## Task 3: Add Firestore Loader for Public Pages

**Files:**
- Modify: `lib/menu-content.ts`
- Create: `components/live-home-page.tsx`
- Modify: `components/mango-menu-page.tsx`
- Modify: `app/page.tsx`
- Test: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing public-loader test**

Add to `tests/site-contract.test.mjs`:

```js
test("public pages use live menu loaders with fallback content", async () => {
  const home = await readFile(new URL("../components/live-home-page.tsx", import.meta.url), "utf8");
  const menu = await readFile(new URL("../components/mango-menu-page.tsx", import.meta.url), "utf8");

  assert.match(home, /getDoc/);
  assert.match(home, /fallbackMenuSections/);
  assert.match(menu, /useLiveMenuSections/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because live loader files/hooks do not exist

- [ ] **Step 3: Add a shared loader hook**

Append to `lib/menu-content.ts`:

```ts
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase";

export function useLiveMenuSections() {
  const [sections, setSections] = useState(fallbackMenuSections);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snapshot = await getDoc(doc(firebaseDb, "site-content", "menu"));
        if (!snapshot.exists()) return;
        const parsed = parseMenuContentDocument(snapshot.data());
        if (!parsed || cancelled) return;
        setSections(parsed.sections);
      } catch {
        // keep fallback content for public routes
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return sections;
}
```

- [ ] **Step 4: Create homepage client wrapper**

Create `components/live-home-page.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionCard, MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import { FeedbackCarousel, LocationMap, PairingCarousel } from "@/components/home-showcase";
import { proof, site } from "@/lib/site";
import { getSignatureItems, useLiveMenuSections } from "@/lib/menu-content";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

export function LiveHomePage() {
  const sections = useLiveMenuSections();
  const signatures = getSignatureItems(sections);

  return (
    <main>
      {/* copy the current homepage markup from app/page.tsx */}
      {/* keep proof, pairings, feedback, and visit sections unchanged */}
      {/* replace signatures.map source with derived signatures */}
    </main>
  );
}
```

- [ ] **Step 5: Switch `app/page.tsx` to the client wrapper**

Replace `app/page.tsx` with:

```tsx
import { LiveHomePage } from "@/components/live-home-page";

export default function Home() {
  return <LiveHomePage />;
}
```

- [ ] **Step 6: Update menu client component to use live sections**

In `components/mango-menu-page.tsx`, replace:

```tsx
import { menuSections, site, MenuSection } from "@/lib/site";
```

with:

```tsx
import { site } from "@/lib/site";
import { type MenuSection, useLiveMenuSections } from "@/lib/menu-content";
```

Then inside `MenuPageClient()`:

```tsx
const menuSections = useLiveMenuSections();
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx components/live-home-page.tsx components/mango-menu-page.tsx lib/menu-content.ts tests/site-contract.test.mjs
git commit -m "feat: load live menu content on public pages"
```

## Task 4: Add Hidden Admin Route and Auth Form

**Files:**
- Create: `app/mh-admin/page.tsx`
- Create: `components/admin/auth-form.tsx`
- Modify: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing admin-route/auth test**

Add to `tests/site-contract.test.mjs`:

```js
test("hidden admin route exists with email password auth and no register flow", async () => {
  const route = await readFile(new URL("../app/mh-admin/page.tsx", import.meta.url), "utf8");
  const authForm = await readFile(new URL("../components/admin/auth-form.tsx", import.meta.url), "utf8");

  assert.match(route, /mh-admin/);
  assert.match(authForm, /signInWithEmailAndPassword/);
  assert.match(authForm, /type="email"/);
  assert.match(authForm, /type="password"/);
  assert.doesNotMatch(authForm, /register/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because admin route and auth form do not exist

- [ ] **Step 3: Create the auth form**

Create `components/admin/auth-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

export function AdminAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error ? <p>{error}</p> : null}
      <button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create the route entrypoint**

Create `app/mh-admin/page.tsx`:

```tsx
import { AdminAuthForm } from "@/components/admin/auth-form";

export default function HiddenAdminPage() {
  return (
    <main className="subpage-main">
      <section className="section-shell">
        <p className="label">Admin</p>
        <h1 className="display-section">mh-admin</h1>
        <AdminAuthForm />
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/mh-admin/page.tsx components/admin/auth-form.tsx tests/site-contract.test.mjs
git commit -m "feat: add hidden admin auth route"
```

## Task 5: Build the Signed-In Menu Editor and Firestore Save Flow

**Files:**
- Create: `components/admin/menu-editor.tsx`
- Modify: `app/mh-admin/page.tsx`
- Modify: `lib/menu-content.ts`
- Test: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing editor/save test**

Add to `tests/site-contract.test.mjs`:

```js
test("admin editor saves full menu documents to firestore", async () => {
  const editor = await readFile(new URL("../components/admin/menu-editor.tsx", import.meta.url), "utf8");

  assert.match(editor, /setDoc/);
  assert.match(editor, /site-content/);
  assert.match(editor, /menu/);
  assert.match(editor, /updatedAt/);
  assert.match(editor, /signOut/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because editor does not exist

- [ ] **Step 3: Create the editor skeleton**

Create `components/admin/menu-editor.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import { fallbackMenuSections, parseMenuContentDocument, type MenuSection } from "@/lib/menu-content";

export function AdminMenuEditor() {
  const [sections, setSections] = useState<MenuSection[]>(fallbackMenuSections);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    async function load() {
      const snapshot = await getDoc(doc(firebaseDb, "site-content", "menu"));
      if (!snapshot.exists()) return;
      const parsed = parseMenuContentDocument(snapshot.data());
      if (parsed) setSections(parsed.sections);
    }

    load().catch(() => setStatus("error"));
  }, []);

  async function handleSave() {
    setStatus("saving");
    try {
      await setDoc(doc(firebaseDb, "site-content", "menu"), {
        sections,
        updatedAt: Date.now(),
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="section-shell">
      <button type="button" onClick={() => signOut(firebaseAuth)}>Sign out</button>
      <button type="button" onClick={handleSave}>Save</button>
      <p>{status}</p>
      {sections.map((section) => (
        <article key={section.name}>
          <h2>{section.name}</h2>
        </article>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Add auth-aware route switching**

Replace `app/mh-admin/page.tsx` with a client-aware shell:

```tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AdminAuthForm } from "@/components/admin/auth-form";
import { AdminMenuEditor } from "@/components/admin/menu-editor";
import { firebaseAuth } from "@/lib/firebase";

export default function HiddenAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, []);

  if (!ready) return <main className="subpage-main"><section className="section-shell"><p>Loading…</p></section></main>;

  return <main className="subpage-main">{user ? <AdminMenuEditor /> : <AdminAuthForm />}</main>;
}
```

- [ ] **Step 5: Flesh out the local editor controls**

Expand `AdminMenuEditor` so it supports:

```tsx
function updateSectionName(index: number, value: string) {
  setSections((current) => current.map((section, sectionIndex) => (
    sectionIndex === index ? { ...section, name: value } : section
  )));
}

function updateItemField(sectionIndex: number, itemIndex: number, field: "name" | "description" | "price" | "image", value: string) {
  setSections((current) => current.map((section, currentSectionIndex) => {
    if (currentSectionIndex !== sectionIndex) return section;
    return {
      ...section,
      items: section.items.map((item, currentItemIndex) => (
        currentItemIndex === itemIndex ? { ...item, [field]: value } : item
      )),
    };
  }));
}
```

Render text inputs for section and item fields plus add/delete and move up/down buttons.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/mh-admin/page.tsx components/admin/menu-editor.tsx lib/menu-content.ts tests/site-contract.test.mjs
git commit -m "feat: add firestore-backed admin menu editor"
```

## Task 6: Add Storage Uploads to the Admin Editor

**Files:**
- Modify: `components/admin/menu-editor.tsx`
- Modify: `tests/site-contract.test.mjs`

- [ ] **Step 1: Write the failing upload test**

Add to `tests/site-contract.test.mjs`:

```js
test("admin editor uploads item photos to firebase storage", async () => {
  const editor = await readFile(new URL("../components/admin/menu-editor.tsx", import.meta.url), "utf8");

  assert.match(editor, /uploadBytes/);
  assert.match(editor, /getDownloadURL/);
  assert.match(editor, /firebaseStorage/);
  assert.match(editor, /type="file"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because upload code is not present

- [ ] **Step 3: Add upload helper logic**

In `components/admin/menu-editor.tsx`, import:

```tsx
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase";
```

Add helper:

```tsx
async function uploadImage(sectionIndex: number, itemIndex: number, file: File) {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const storageRef = ref(firebaseStorage, `menu/${Date.now()}-${safeName}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  updateItemField(sectionIndex, itemIndex, "image", url);
}
```

- [ ] **Step 4: Add file input per item**

Render this inside each item card:

```tsx
<label>
  <span>Upload image</span>
  <input
    type="file"
    accept="image/*"
    onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      void uploadImage(sectionIndex, itemIndex, file);
    }}
  />
</label>
```

Also render current preview:

```tsx
{item.image ? <img src={item.image} alt={item.name} /> : null}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/admin/menu-editor.tsx tests/site-contract.test.mjs
git commit -m "feat: add firebase storage uploads for menu photos"
```

## Task 7: Add Validation, Docs, and Final Verification

**Files:**
- Modify: `components/admin/menu-editor.tsx`
- Modify: `README.md`
- Modify: `tests/site-contract.test.mjs`
- Modify: `tests/menu-content.test.mjs`

- [ ] **Step 1: Write the failing validation/doc test**

Add to `tests/site-contract.test.mjs`:

```js
test("readme documents firebase env vars and hidden admin route", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.match(readme, /NEXT_PUBLIC_FIREBASE_API_KEY/);
  assert.match(readme, /NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN/);
  assert.match(readme, /\\/mh-admin/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/site-contract.test.mjs`
Expected: FAIL because README does not document the Firebase setup yet

- [ ] **Step 3: Add minimal save validation**

In `components/admin/menu-editor.tsx`, add:

```tsx
function validateSections(sections: MenuSection[]) {
  for (const section of sections) {
    if (!section.name.trim()) return "Section name is required.";
    for (const item of section.items) {
      if (!item.name.trim()) return "Item name is required.";
      if (!item.price.trim()) return "Item price is required.";
      if (!item.image.trim()) return "Each item needs an image.";
    }
  }

  return "";
}
```

Use it in `handleSave()`:

```tsx
const validationError = validateSections(sections);
if (validationError) {
  setStatus("error");
  setErrorMessage(validationError);
  return;
}
```

- [ ] **Step 4: Document setup**

Append to `README.md`:

```md
## Firebase Admin Setup

Set these client env vars in `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Create a Firebase Auth email/password user in the Firebase Console.

Hidden admin route:

- `/mh-admin`
```

- [ ] **Step 5: Run the full automated verification**

Run: `npm test`
Expected: PASS

Run: `npm run lint`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Run manual browser verification**

Run: `npm start -- --port 3005`

Then verify:

1. Open `http://127.0.0.1:3005/mh-admin`
2. Sign in with a Firebase email/password admin account
3. Edit one menu item name
4. Upload one replacement image
5. Save
6. Open `http://127.0.0.1:3005/menu` and confirm the update is visible
7. Open `http://127.0.0.1:3005/` and confirm signature picks reflect the updated data when applicable
8. Sign out and confirm the editor disappears

- [ ] **Step 7: Commit**

```bash
git add components/admin/menu-editor.tsx README.md tests/site-contract.test.mjs tests/menu-content.test.mjs
git commit -m "feat: finish firebase admin menu flow"
```
