# SneakyOwl

SneakyOwl is a personal website built with Next.js and the App Router.
It includes a landing page and a chess section, with a UI composed of reusable React components
and static assets served from `public/`.

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
  tools/                Planned useful-tools section
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
- [ ] Reuse RafflesGo's Leaflet pattern for click-to-drop pins, draggable markers, GPS-based placement, and saved-marker detail views.
- [ ] Decide whether Firebase or Supabase should power Google auth, personal food entries, share codes, watch lists, and revocation.
- [ ] Design a personal food-place entry form with place name, cost per person, optional items bought, rating out of 10, and comments.
- [ ] Add friend sharing through QR/link/manual code entry, plus controls to remove watched lists and stop sharing with specific viewers.
- [ ] Add clustered map pins for close-proximity entries with a cluster detail list on click.
- [ ] Resolve remaining product-scope questions in `app/tools/bite-trail/QUESTIONS.md`.
- [x] Document the first-pass tools and BiteTrail plan in `app/tools/`.
- [x] Add Firebase Google auth smoke-test UI for BiteTrail.
