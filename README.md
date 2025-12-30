# cme-frontend

CME frontend app for event management — a React + Vite application scaffolded with Tailwind CSS and Redux Toolkit. This repository contains the client-side code for the CME event management UI.

## Quick overview

- Framework: React (v19)
- Bundler / dev server: Vite
- Styling: Tailwind CSS
- State management: Redux Toolkit
- Other notable libraries: ag-grid, react-router-dom, axios, lucide-react, swiper, react-hot-toast

## Requirements

- Node.js 18+ (recommended)
- npm (or yarn/pnpm)

## Getting started

1. Install dependencies
   npm install

2. Start development server
   npm run dev
   - Opens Vite dev server with HMR on the default port (usually 5173).

3. Build for production
   npm run build

4. Preview production build locally
   npm run preview

5. Run ESLint
   npm run lint

## Available npm scripts

- dev: Start Vite dev server
- build: Build production assets with Vite
- preview: Preview production build locally
- lint: Run ESLint across the project

(These are defined in package.json.)

## Project structure (important files & folders)

- index.html — App entry HTML
- package.json — Scripts and dependencies
- vite.config.js — Vite configuration
- postcss.config.js, tailwind.config.js — Tailwind/PostCSS setup
- src/
  - main.jsx — App bootstrap
  - App.jsx — Root app component and router
  - index.css — Global styles (Tailwind entry)
  - assets/ — static assets (images, icons, etc.)
  - components/ — reusable UI components
  - pages/ — route-level page components
  - redux/ — redux slices / store setup
  - services/ — API / data access utilities
  - styles/ — additional shared styles
- public/ — static files served as-is
- .gitignore
- netlify.toml — Netlify configuration (if deploying to Netlify)
- eslint.config.js — ESLint configuration

Note: Some directories are present as placeholders ready to be filled with components, pages, redux slices, and services.

## Configuration & environment

- There is no repository-level .env example included. If your app needs environment variables (API base URL, keys, etc.), add a `.env` or `.env.local` file and ensure it's listed in `.gitignore` as appropriate.
- Tailwind is configured via `tailwind.config.js` and `postcss.config.js`.

## Dependencies (high level)

Key dependencies from package.json:
- react, react-dom
- vite
- @reduxjs/toolkit, react-redux
- tailwindcss, @tailwindcss/postcss
- ag-grid-community, ag-grid-react
- react-router-dom
- axios
- lucide-react
- swiper
- react-hot-toast

Dev dependencies include Vite plugin for React, ESLint, and TypeScript type packages for React.

## Contributing

- Open an issue for feature requests or bug reports.
- Create a branch per feature/fix and submit a pull request.
- Follow existing ESLint rules; run `npm run lint` before submitting.

## Deployment

- The repo contains a `netlify.toml` file — it's prepared for deployment to Netlify. Adjust build settings/redirects as needed.
- Typical build command for deployment: npm run build (output resides in `dist/` when using Vite).

## Troubleshooting

- If dev server fails to start, check Node.js / npm versions and ensure dependencies are installed.
- For Tailwind issues, confirm `index.css` imports Tailwind base/components/utilities and `tailwind.config.js` content paths include your `src` files.

## License

No license specified in the repository. Add a LICENSE file if you want to make the project open-source with a chosen license.

## Contact / Author

Repository: RahulFreeCoder/cme-frontend  
Description: CME frontend app for event management
