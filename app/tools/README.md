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
- `/profile` has the shared profile and tool-preferences preview; it currently uses local mock values only.
- BiteTrail uses Firebase Google Authentication for the current sign-in smoke test.
- BiteTrail has a Leaflet/OpenStreetMap map foundation backed by grouped sample place/visit data.
- The map renders one pin per place, aggregates only visible visits for filtering, supports marker clustering, and shows fully expanded visit records in the selected-place panel.

Important distinction:

- The map UI is not throwaway; it is the intended foundation for the real BiteTrail map.
- The current place/visit records are sample data for design purposes; Firebase persistence is not implemented yet.

## Shared Profile Direction

Profile should become a reusable authenticated account surface for BiteTrail and future tools. It should own shared user preferences and tool-independent account information rather than becoming a BiteTrail-specific settings page. Firebase Auth remains the identity source; Firestore should store the user profile document and future tool preferences under the authenticated user ID.
