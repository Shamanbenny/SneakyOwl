# SneakyOwl

SneakyOwl is a personal website built with Next.js and the App Router. It includes a landing page, an about page, and a chess section, with a UI composed of reusable React components and static assets served from `public/`.

## Tech Stack

- Next.js 15
- React 18
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
  page.tsx              Home page
  about/page.tsx        About page
  chess/page.tsx        Chess page
  components/           Reusable UI components
  globals.css           Global styles
public/
  reviewImages/         Review images
  sounds/               Audio assets
```

## Deployment Note

This project is currently configured for static export in [next.config.mjs](./next.config.mjs) with `output: "export"`, which is suitable for GitHub Pages style deployments. Review that configuration before changing deployment targets.

## To-do

- [ ] Create a Project display segment and link to it for the COMPLETED PROJECTS bento cell.
