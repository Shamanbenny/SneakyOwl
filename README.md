# SneakyOwl

SneakyOwl is a personal website built with Next.js and the App Router.
It includes a landing page, chess section, and tools section, with a UI composed of reusable
React components and static assets served from `public/`.

## Tech Stack

- Next.js 15 with the App Router and static export configuration
- React 19 and TypeScript
- Tailwind CSS
- Firebase Authentication with Google sign-in
- Cloud Firestore with client-side access protected by Firestore Security Rules
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

The frontend is currently configured for static export in
[next.config.mjs](./next.config.mjs) with `output: "export"`. The separate
`sneakyowl-flask/` project contains the Vercel Flask API for privileged workflows.

## Deploying Firestore Rules

From the root repo directory, deploy the Firestore Security Rules with:

```bash
npm install -g firebase-tools
firebase deploy --only firestore:rules,firestore:indexes --project sneakyowl-firebase
```

The Firebase CLI uses [firebase.json](./firebase.json) to locate
[firestore.rules](./firestore.rules) and [firestore.indexes.json](./firestore.indexes.json).

## To-do

- [x] Build `/tools` as a useful-tools section for practical day-to-day utilities.
- [x] Add the first tool under `app/tools/bite-trail/` using the BiteTrail name.
- [x] Add Firebase Google auth smoke-test UI for BiteTrail.
- [x] Add a Leaflet-based BiteTrail map preview with OpenStreetMap tiles, sample food entries, selectable pins, cluster list panels, and a detail panel.
- [x] Use `leaflet.markercluster` for the first clustering pass, with a non-cluster fallback if the package chunk fails to load.
- [x] Use realistic OpenStreetMap tiles rather than a dark/black map theme.
- [x] Style BiteTrail markers as compact circles: own entries use green accent fill with black border/dot, friend entries use the landing competition blue, and clusters use the inverted black/accent treatment.
- [x] Decide the initial frontend auth provider: Firebase Google Authentication.
- [x] Use Firebase Auth plus direct Firestore SDK access for simple owner-scoped BiteTrail configuration and append-only visit writes, protected by Firestore Security Rules.
- [x] Use the separate Flask/Vercel backend for authorised live-visit retrieval and coordinated workflows such as display-name propagation, visit deletion, friend coordination, BiteTrail cleanup, and account deletion.
- [x] Design and implement a personal food-place entry form with place name, cuisine genre, cost per person, optional items bought, whole-number rating out of 10, and comments.
- [x] Expand the sample data with repeated owners, multiple cuisine categories, normal clusters, and a deliberately inseparable maximum-zoom cluster.
- [x] Reuse RafflesGo's Leaflet creation pattern for click-to-drop pins, draggable markers, GPS-based placement, and manual coordinate syncing.
- [x] Add friend sharing through a QR/link flow, plus controls to hide or stop watching lists.
- [x] Add clustered map pins for close-proximity entries with a cluster detail list on click.
- [x] Model repeated visits as one shared place with visible-visit averages and individual visit details.
- [x] Build a reusable authenticated profile page for BiteTrail and future tools, backed by Firebase Auth and a user-scoped Firestore profile document.
- [x] Add Gmail-confirmed account deletion that removes account data, deletes the Firebase Auth user, signs out, and returns to BiteTrail.
- [ ] Add a non-destructive "Report store closure" signal that indicates closure likelihood without closing a place for everyone.
- [ ] Add staged BiteTrail loading states so the map, filters, and View entries panel render before long async backend calls finish; show a spinner in the View entries panel while its data is pending.
- [ ] Define and enforce the exact required and optional value validation rules for the new-entry form.
- [ ] Lock the new-entry form while submitting; after a successful response, close the form and reset its values, and after a failed response, reopen the form for correction or retry.
- [ ] Add a GitHub Action that fetches SneakyOwl visits into a separate branch as static JSON every day, then use that file for unregistered users on page load instead of querying Firestore.
- [ ] Update BiteTrail's responsive design across the map, filters, View entries panel, and new-entry form.
- [ ] Resolve remaining product-scope questions in `app/tools/bite-trail/QUESTIONS.md`.
- [x] Document the first-pass tools and BiteTrail plan in `app/tools/`.
