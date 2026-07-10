# SneakyOwl

SneakyOwl is a personal website built with Next.js and the App Router.
It includes a landing page, chess section, and tools section, with a UI composed of reusable
React components and static assets served from `public/`.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ESLint
- Prettier with `prettier-plugin-tailwindcss`

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

Install dependencies from `package.json`:

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` starts the Next.js development server
- `npm run build` creates a production build
- `npm run start` serves the production build locally
- `npm run lint` runs the configured lint checks

## Project Structure

```text
app/
  (landing)/page.tsx    Landing page
  chess/page.tsx        Chess page
  tools/                Useful-tools section, including BiteTrail
  components/           Reusable UI components
  globals.css           Global styles
public/
  reviewImages/         Review images
  sounds/               Audio assets
```

## Deployment Note

This project is currently configured for static export in
[next.config.mjs](./next.config.mjs) with `output: "export"`, which is suitable
for GitHub Pages style deployments.
Review that configuration before changing deployment targets.

## To-do

- [x] Build `/tools` as a useful-tools section for practical day-to-day utilities.
- [x] Add the first tool under `app/tools/bite-trail/` using the BiteTrail name.
- [x] Add Firebase Google auth smoke-test UI for BiteTrail.
- [x] Add a Leaflet-based BiteTrail map preview with OpenStreetMap tiles, sample food entries, selectable pins, cluster list panels, and a detail panel.
- [x] Use `leaflet.markercluster` for the first clustering pass, with a non-cluster fallback if the package chunk fails to load.
- [x] Use realistic OpenStreetMap tiles rather than a dark/black map theme.
- [x] Style BiteTrail markers as teardrop pins: own entries use green accent fill with black border/dot, friend entries use the landing competition blue, and clusters use the inverted black/accent treatment.
- [x] Decide the initial frontend auth provider: Firebase Google Authentication.
- [ ] Confirm the full backend/storage implementation for personal food entries, share codes, watch lists, and revocation. Current direction is Firebase for auth/storage, with the separate Flask/Vercel backend still deferred.
- [ ] Design a personal food-place entry form with place name, cuisine genre, cost per person, optional items bought, whole-number rating out of 10, and comments.
- [ ] Fix the current sample data model/content before wiring real data: ratings should be whole numbers and entries need cuisine genres such as fast food, western, Korean, Japanese, cafe, dessert, etc.
- [ ] Reuse RafflesGo's Leaflet creation pattern for click-to-drop pins, draggable markers, GPS-based placement, and optional manual coordinate syncing.
- [ ] Add friend sharing through QR/link/manual code entry, plus controls to remove watched lists and stop sharing with specific viewers.
- [ ] Add clustered map pins for close-proximity entries with a cluster detail list on click.
- [ ] Resolve remaining product-scope questions in `app/tools/bite-trail/QUESTIONS.md`.
- [x] Document the first-pass tools and BiteTrail plan in `app/tools/`.
