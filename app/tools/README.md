# Tools Page Plan

This folder is reserved for a future `/tools` section on SneakyOwl: a collection of practical, day-to-day utilities that visitors can open directly from the portfolio.

## Goals

- Add a first-class `/tools` route with the same dark visual language as the rest of SneakyOwl.
- Present tools as usable apps, not marketing pages.
- Keep each larger tool in its own route folder so state, components, docs, and backend integration notes do not leak into unrelated sections.
- Reuse shared navigation and UI conventions from `app/components/shared/` where possible.

## Proposed Structure

```text
app/tools/
  page.tsx                  Tools index route, once implemented
  README.md                 Planning notes for the tools section
  food-map/
    README.md               Product plan and todo list for the first tool
    ARCHITECTURE.md         Map/auth/database/sharing design notes
    QUESTIONS.md            Clarifications to resolve before implementation
```

## Initial Tool

The first planned tool is currently using the working slug `food-map`. The final product name is undecided; see `food-map/QUESTIONS.md` for naming options.
