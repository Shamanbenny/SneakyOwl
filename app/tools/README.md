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
- BiteTrail uses Firebase Google Authentication for the current sign-in smoke test.
- BiteTrail has a Leaflet/OpenStreetMap map preview backed by sample food-entry data.
- The map preview supports individual pins, selected-entry panels, marker clustering, and cluster list panels.

Important distinction:

- The map UI is not throwaway; it is the intended foundation for the real BiteTrail map.
- The current food entries are sample data for design purposes and still need correction before real data integration.
