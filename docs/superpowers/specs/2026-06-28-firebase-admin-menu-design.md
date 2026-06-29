# Firebase Admin Menu Design

## Goal

Add a hidden admin page that lets an authenticated Firebase user:

- Sign in with email and password
- Upload menu photos to Firebase Storage
- Edit the live menu configuration
- Save changes directly to the live site with no publish step

The public homepage and menu page should read live content from Firebase, with the current hardcoded content preserved as a fallback when Firebase has no data yet or a client fetch fails.

## Scope

This design covers one feature set:

- Hidden admin route
- Firebase client initialization
- Firebase Auth sign-in/sign-out
- Firestore-backed menu configuration
- Storage-backed image uploads
- Public menu and homepage reading live menu content

This does not include:

- Account registration
- Role-based admin authorization beyond “authenticated user”
- Draft/publish workflows
- Revision history
- Server-side sync jobs

## Recommended Approach

Use the Firebase client SDK only.

Why:

- Smallest implementation
- Matches the instant-live-update requirement
- Avoids adding custom API routes or server auth plumbing
- Fits the current early-stage app and small codebase

Tradeoff:

- The public site will fetch live content client-side instead of staying purely static
- Any authenticated Firebase user becomes an admin by design

## Routes

### Public Routes

- `/`
- `/menu`

These routes should render the current static fallback immediately, then hydrate to live Firebase menu content when available.

### Hidden Admin Route

- `/mh-admin`

This route should not be linked from public navigation.

Behavior:

- Signed-out users see the email/password login form
- Signed-in users see the admin editor
- Sign-out returns the view to the login form

## Firebase Products

### Auth

Use Firebase Auth email/password sign-in.

Rules:

- No register UI
- No forgot-password flow in this first version
- Any successfully authenticated account can use the admin UI

### Firestore

Use one Firestore document as the live source of truth for menu content.

Recommended path:

- Collection: `site-content`
- Document: `menu`

### Storage

Use Firebase Storage for menu item photos.

Recommended path format:

- `menu/<timestamp>-<slugified-name>.<ext>`

Uploaded images should store a public download URL back into the corresponding menu item.

## Data Model

The current static menu shape in `lib/site.ts` should become the canonical runtime shape used by both public pages and the admin editor.

### Types

```ts
type MenuItem = {
  name: string;
  description: string;
  price: string;
  tags: string[];
  image: string;
};

type MenuSection = {
  name: string;
  note: string;
  items: MenuItem[];
};
```

### Firestore Document Shape

```ts
type MenuContentDocument = {
  sections: MenuSection[];
  updatedAt: number;
};
```

Notes:

- `updatedAt` is for lightweight debugging and visibility
- The public site only needs `sections`
- Extra fields should be ignored rather than required

## Public Data Flow

### Default Render

Public pages should start from the existing hardcoded content in `lib/site.ts`.

This prevents:

- Blank states on first load
- Hard dependency on Firebase for initial render
- Broken pages if the Firestore document does not exist yet

### Live Upgrade

After hydration:

1. Read `site-content/menu` from Firestore
2. If data exists and validates, replace fallback content in page state
3. If data is missing or invalid, keep fallback content
4. If read fails, keep fallback content and fail silently in public UI

### Homepage Signature Picks

The homepage should stop depending on a separate hardcoded `signatures` source.

Recommended derivation:

- Flatten all menu items
- Prefer items tagged `Top Picks`
- Fall back to the first few items if fewer than four top picks exist

This avoids maintaining two menu content sources.

## Admin Data Flow

### Login

1. User opens `/mh-admin`
2. If no Firebase session exists, show email/password form
3. On successful sign-in, load current menu document from Firestore
4. If the document does not exist, seed editor state from the static fallback

### Editing

The admin editor keeps local state while the user edits:

- Section name
- Section note
- Item fields
- Item tags
- Item image

### Saving

When the user clicks Save:

1. Validate local state
2. Write the full `sections` array to Firestore
3. Set `updatedAt` to the current timestamp
4. Show success or error state in the UI

This is a full-document overwrite, not a patch-based write. That is acceptable for this version because:

- Only one admin user is likely active at a time
- The document is small
- Simpler write logic is more maintainable here

### Image Upload

For each item:

1. Admin selects a file
2. Client uploads file directly to Storage
3. Client gets the download URL
4. Editor updates that item’s `image` field locally
5. Final Save writes the updated item URL into Firestore

Upload status should be shown per item so the admin knows whether the photo is still uploading or ready.

## Admin UI Structure

Use one focused editor page, not a multi-route admin area.

### Signed-Out View

- Page title
- Email input
- Password input
- Sign-in button
- Error message area

### Signed-In View

- Header with page title and sign-out button
- Save button
- Global status area: idle, saving, saved, error
- List of sections
- Per-section controls:
  - Edit section name
  - Edit section note
  - Move section up
  - Move section down
  - Delete section
  - Add item
- Per-item controls:
  - Name
  - Description
  - Price
  - Tags
  - Current image preview
  - Upload image button
  - Move item up
  - Move item down
  - Delete item
- Add section button

## Validation

Keep validation minimal and local:

- Section name required
- Item name required
- Price required
- Image required for saved items
- Tags optional but stored as trimmed strings

If validation fails, block save and show clear inline or page-level errors.

## Error Handling

### Public Pages

- Firebase read failure: keep fallback content
- Invalid remote document: keep fallback content
- No public error banner needed

### Admin Page

- Auth failure: show message above form
- Firestore load failure: show retryable editor error
- Storage upload failure: keep old image, show item-level error
- Save failure: keep local edits, show page-level error

## Security Rules

The implementation should assume matching Firebase rules are configured.

### Firestore

- Anyone can read `site-content/menu`
- Only authenticated users can write `site-content/menu`

### Storage

- Anyone can read menu images
- Only authenticated users can upload or overwrite files under `menu/`

This matches the requirement that any logged-in account can act as admin.

## Code Organization

### Firebase Setup

Add a small Firebase client module under `lib/` for:

- app initialization
- auth export
- firestore export
- storage export

Analytics should not be included in this first pass because it is not needed for the admin flow and adds extra client work.

### Content Layer

Add a small menu-content helper module for:

- fallback menu export
- Firestore document parsing
- signature derivation for homepage

This keeps Firebase-specific parsing out of page components.

### UI Split

Add focused components for:

- admin auth form
- admin editor
- public menu loader hook or client wrapper

The current menu page already has a client component, so live data integration should follow that existing pattern rather than introducing a new system.

## Testing

### Automated

- Contract test for Firebase-backed menu document parsing
- Contract test for homepage signature derivation from menu sections
- Source-level test that the hidden admin route exists
- Source-level test that no register UI is exposed

### Manual

1. Open `/mh-admin`
2. Sign in with valid Firebase email/password account
3. Edit an existing item
4. Upload a new photo
5. Save
6. Confirm `/menu` reflects the change after reload
7. Confirm homepage signature picks reflect updated menu data when relevant
8. Sign out
9. Confirm the editor is no longer visible

## Environment Configuration

The provided Firebase web config should move into environment variables exposed to the client through `NEXT_PUBLIC_` keys.

Recommended keys:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

This keeps the project configuration explicit and easier to change across environments.

## Migration Plan

1. Add Firebase SDK dependencies and client config
2. Add menu content loader/parser with static fallback
3. Update public menu page to consume live menu content
4. Update homepage signature picks to derive from live menu content
5. Build hidden admin route with auth form and editor
6. Add Storage upload flow
7. Add tests
8. Verify end-to-end against the Firebase project

## Acceptance Criteria

- Hidden admin route exists at `/mh-admin`
- Email/password sign-in works with Firebase Auth
- No registration UI exists
- Any authenticated Firebase account can access the admin editor
- Admin can edit section and item data
- Admin can upload photos to Firebase Storage
- Save writes directly to Firestore
- Public homepage and `/menu` show updated live data after save
- Static fallback still renders if Firebase data is unavailable
