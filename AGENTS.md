# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router site. Route entry points live in `app/`, with the landing route under `app/(landing)/` and the chess route under `app/chess/`. All reusable components now live under `app/components/`; do not create or reuse a top-level `components/` directory. If third-party generators or new modules create files there, move the app-owned components into `app/components/` and keep the root-level folder reserved only until you decide how to reconcile those additions.

Component folders are organized by route ownership first, then by shared concern:
- `app/components/landing/`: landing-page-only modules such as hero, timeline, reviews, project, and skills sections
- `app/components/chess/`: chess-route-only modules
- `app/components/shared/navigation/`: shared navigation chrome such as `NavBar`, `Dock`, and menu primitives
- `app/components/shared/display/`: shared visual/text effect components
- `app/components/shared/feedback/`: shared skeletons, tooltips, and similar feedback helpers
- `app/components/shared/ui/`: low-level UI primitives

When adding a new component, place it in the narrowest folder that matches its real usage instead of defaulting to a flat `app/components/` file. Prefer extracting reusable component patterns into `app/components/...` instead of repeating Tailwind styling in every new module; React reuse is part of the project direction, so common UI should become a named component once it appears in more than one place or is likely to become a site pattern. Put shared global styling in `app/globals.css`, and keep highly interactive visual treatments such as profile or showcase cards in dedicated components instead of inlining them into route files. Static assets belong in `public/`, including profile imagery at the top level, review images in `public/reviewImages/`, and audio in `public/sounds/`.

Use `/design-component` as the local visual reference before adding or restyling important UI. Its route lives at `app/design-component/page.tsx` and its scoped CSS reference lives at `app/design-component/design-component.module.css`. Treat that page as the current source of truth for button schemes, navigation chrome, tagging treatments, filter chips, form inputs, core color tokens, font sizing/letter-spacing decisions, and responsive container breakpoints. If a future styling decision changes an important element, update this design reference in the same change so the next agent can match the site consistently. When changing the `/design-component` page, put styling in `app/design-component/design-component.module.css` and reference it from `page.tsx` with CSS module classes; avoid inline `style`, Tailwind utility strings, color literals, layout values, or other presentation rules in `page.tsx` unless a runtime-only value makes CSS impossible. If an exception is truly needed, keep it minimal and document why in the same change. When adding a common UI component, also document it in `/design-component` with representative states and usage variants instead of leaving future agents to infer it from scattered route code.

The project currently uses two distinct tagging treatments in the project sections, and both should be represented in `/design-component` before they are reused or restyled:
- Flowing menu tags: circular logo-style tags used inside flowing menu/project preview interactions.
- Card tags: compact text-based tags used inside project cards and metadata rows.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Use `npm run dev` for local development, `npm run build` to create the production build, and `npm run start` to serve that build locally. Run `npm run lint` before opening a PR; it is the main automated validation currently configured. Because the app contains pointer-driven UI and custom responsive layouts, also manually verify `/` and `/chess` in both desktop and mobile widths when making visible changes. `next.config.mjs` is set for static export, so review that file carefully before deployment-related changes.

## Coding Style & Naming Conventions
Use TypeScript with strict typing and 2-space indentation, matching the existing files. Prefer React function components with PascalCase names such as `ChessPage.tsx`; keep route folder names lowercase to match URLs. Use double quotes and semicolons consistently. Styling is primarily Tailwind utility classes in JSX plus shared rules in `app/globals.css`; add plain CSS there when an effect depends on custom properties, masks, or other effects that would be awkward to express in utilities alone. Prettier with `prettier-plugin-tailwindcss` is installed, so keep class ordering formatter-friendly.

## Color System & Design Direction
The site is dark-only. Do not add light mode branches, `dark:` overrides, or duplicate light/dark assets unless the user explicitly asks for theme support again.

The shared palette lives in `app/globals.css` as CSS custom properties under `:root`. Reuse those tokens instead of introducing ad hoc hex values into components:
- `--site-bg`: main page background
- `--site-bg-elevated`: raised panel/card background
- `--site-bg-chrome`: darker shared chrome surface for the dock shell, closed hamburger button, and expanded staggered menu
- `--site-bg-chrome-layer`: secondary dark chrome layer for stacked menu/drawer transitions when a slightly different dark surface is needed without introducing accent colors
- `--site-bg-strong`: dock, menu, and chip background
- `--site-bg-soft`: form controls and inset surfaces
- `--site-text`, `--site-text-strong`, `--site-text-muted`, `--site-text-faint`: primary text scale
- `--site-border`, `--site-border-strong`, `--site-divider`: border and separator colors
- `--site-accent`, `--site-accent-strong`, `--site-accent-soft`: primary emerald accent scale
- `--site-accent-teal`, `--site-accent-cyan`: secondary accent options used in the timeline

Current design direction:
- Prefer flat dark surfaces over glossy or glassy treatments.
- Avoid gradients on core UI surfaces such as nav, menus, cards, buttons, panels, and separators. The design direction for this site is intentionally less modern and more restrained.
- When passing colors into JS-driven visual components such as ReactBits menus, feed them from the shared CSS variables instead of repeating literal hex values in component files.
- If a new shared color is needed, add it to the root token list first and then consume it semantically.

## Testing Guidelines
There is no committed automated test suite yet. For now, treat `npm run lint` plus manual checks of `/` and `/chess` as the minimum gate. When you add tests, keep them close to the feature they cover and use clear names such as `ComponentName.test.tsx`.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit messages like `Add call to /chess_v1-2`, `Fix Chess Version options`, and `Update ChessVersionInfo.tsx`. Follow that pattern: start with a verb, keep the subject concise, and scope one logical change per commit. PRs should include a brief description, linked issue when applicable, and screenshots or short recordings for visible UI changes.

## Configuration Notes
The project uses the `@/*` TypeScript path alias if you need it. Remote images are limited in `next.config.mjs`, so update that allowlist when introducing new external image sources.

## Responsive Layout Notes
The site’s Tailwind breakpoints are defined in `tailwind.config.ts`:
- `xs`: `320px`
- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`
- `xxl`: `1600px`

For the main page containers, the layout is effectively sized around:
- `<640`: `300px` wide, with a tighter `230px` case under `320px`
- `sm`: `560px`
- `md`: `680px`
- `lg`: `910px`
- `xl`: `1160px`
- `xxl`: `1480px`

These container widths are reflected in `app/components/chess/ChessPage.tsx` and the landing route composition in `app/(landing)/page.tsx`.
If the question is where the layout meaningfully switches into the main desktop split, that starts at `lg` (`1024px`).

## Atomic Claude Symbol Graph

This repository uses Atomic CLI's code graph to navigate source symbols and their relationships. The graph helps locate connected implementation paths; read the referenced source and tests for definitive behavior. The graph is an index, not generated wiki documentation, and it does not verify runtime behavior. This setup does not install the native Claude Code bundle.

The repo-local graph is stored in `.claude/.atomic-index/atomic.db` and ignored by Git. Keep the generated database local; the repo config and this guidance are the shareable setup.

Run these commands from the repository root. On this machine, Atomic is installed at `$HOME/.local/bin/atomic`; if it is already on your `PATH`, set `ATOMIC=atomic` instead. The global `--no-update-check` flag goes before the command.

```sh
ATOMIC="$HOME/.local/bin/atomic"

# Scaffold repo-local Atomic configuration once, if it is not present
"$ATOMIC" --no-update-check repo init

# Build the graph for the first time or rebuild it fully
"$ATOMIC" --no-update-check code index

# Check whether the index exists and whether source changes are pending
"$ATOMIC" --no-update-check code status

# Refresh the index incrementally after source changes
"$ATOMIC" --no-update-check code sync

# Search indexed symbols and source references
"$ATOMIC" --no-update-check code search "report submission"

# Gather graph-linked context for a behavior or feature flow
"$ATOMIC" --no-update-check code explore "How does report submission work?"

# Find callers or the impact radius of a symbol
"$ATOMIC" --no-update-check code callers submitReport --depth 2
"$ATOMIC" --no-update-check code impact submitReport --depth 2
```

Run `code sync` after edits before relying on graph results. Use `code index` when a full rebuild is needed.
