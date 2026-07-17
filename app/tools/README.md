# Tools Page

This folder contains the `/tools` section on SneakyOwl: a collection of practical,
day-to-day utilities that visitors can open directly from the portfolio.

## Goals

- Maintain a first-class `/tools` route with the same dark visual language as the rest of SneakyOwl.
- Present tools as usable apps, not marketing pages.
- Keep each larger tool in its own route folder so state, components, docs, and backend integration notes do not leak into unrelated sections.
- Reuse shared navigation and UI conventions from `app/components/shared/` where possible.

## Structure

```text
app/tools/
  page.tsx                  Tools index route
  README.md                 Planning notes for the tools section
  bite-trail/
    page.tsx                BiteTrail route
    README.md               Product plan and todo list for the first tool
    ARCHITECTURE.md         Map/auth/database/sharing design notes
    QUESTIONS.md            Remaining clarifications to resolve before full implementation
```

## Current Tool

The first tool is `BiteTrail`, available at `/tools/bite-trail`.

Current implementation status:

- `/tools` renders a tools index that links to BiteTrail.
- `/tools/bite-trail` has the BiteTrail landing/auth layout.
- `/profile` has the shared profile and tool-preferences surface backed by Firebase Auth and Firestore.
- `/profile` supports permanent account deletion after an exact Gmail-address
  confirmation, case-insensitive with surrounding whitespace ignored; it
  removes the Firebase Authentication account and Firestore account data, then
  signs the user out and returns to `/tools/bite-trail`.
- BiteTrail uses Firebase Google Authentication for the current sign-in smoke test.
- BiteTrail combines Firestore place/visit data with its static global sample source for the map.
- The map renders one pin per place, aggregates only visible visits for filtering, supports marker clustering, and shows fully expanded visit records in the selected-place panel.
- Successful new-place and visit saves refresh the visible Firestore data automatically; external changes are not yet streamed in realtime.
- The shared Profile page supports local per-user Hide/Show controls for
  watched lists; Stop watching remains a Firestore-backed relationship change.
- Shared error notifications include a copy-to-clipboard control for debugging;
  user-facing auth and backend errors are sanitized before display.

Important distinction:

- The map UI is not throwaway; it is the intended foundation for the real BiteTrail map.
- Static sample entries remain a fallback/source for globally available data, while user-created places and visits persist in Firestore.

## Shared Profile Direction

Profile is a reusable authenticated account surface for BiteTrail and future tools. It owns shared user preferences and tool-independent account information rather than becoming a BiteTrail-specific settings page. Firebase Auth remains the identity source; Firestore stores the shared user profile document, while BiteTrail stores its own preferences and `hasCompletedTutorial` state under `tools/bite-trail/users/{uid}`.
