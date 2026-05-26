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

- Node.js 18 or later
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

- [X] Implement Collapsible Card for Projects and Skills on lg: breakpoints and smaller
- [ ] Add Blog Posts & Project Blog Posts page
- [ ] Create detailed Project Blog Posts for completed projects
- [ ] Develop methods to pit Chess Bot versions against one another to get performance results over 1000 games for each comparison
- [ ] Continue optimizing Chess Bot
