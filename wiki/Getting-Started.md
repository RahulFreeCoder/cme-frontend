# Getting Started

This page explains how to run the CME frontend locally.

## Requirements

- Node.js 18 or newer.
- npm.
- Access to the backend API if you want live data.

## Install Dependencies

From the repository root:

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Vite starts a local development server, usually at:

```text
http://localhost:5173
```

## Build Production Assets

```bash
npm run build
```

The production build is written to `dist/`.

## Preview Production Build

```bash
npm run preview
```

## Run Linting

```bash
npm run lint
```

## NPM Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production assets |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment Notes

The API base URL is currently hardcoded in `src/services/axiosinstance.js`.

For production-grade configuration, move backend URLs into Vite environment variables such as:

```text
VITE_API_BASE_URL=https://example.com
```

Then read them from:

```js
import.meta.env.VITE_API_BASE_URL
```

## Common Local Issues

### Dependencies fail to install

Check Node and npm versions:

```bash
node --version
npm --version
```

Use Node 18 or newer.

### Tailwind styles do not render

Confirm the app imports the global CSS from `src/main.jsx`, and that Tailwind/PostCSS config files exist at the repository root.

### API returns no data

The events and users services include fallback sample data in some places. If live API requests fail, the UI may still render sample events or doctors.
