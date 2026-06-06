# CME Frontend Wiki

Welcome to the CME frontend wiki. This repository contains the React client for a Continuing Medical Education event portal. The app helps doctors and students discover CME events, register for free or paid sessions, and lets organizers manage events, registrations, attendance, certificates, and payments.

## Quick Links

- [Getting Started](Getting-Started)
- [Project Architecture](Project-Architecture)
- [User Guide](User-Guide)
- [Organizer Guide](Organizer-Guide)
- [API Reference](API-Reference)
- [State Management](State-Management)
- [Deployment](Deployment)
- [Contributing](Contributing)

## Application Summary

The frontend is built with React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, AG Grid, Lucide icons, and PWA support through `vite-plugin-pwa`.

Primary user journeys:

- Browse upcoming CME events.
- View event details, fees, venue, speakers, schedule, seats, credits, and payment instructions.
- Register for free events immediately.
- Submit payment details for paid event registration.
- View doctor listings and user profile information.
- Log in or register through the authentication modal.
- Access organizer-only dashboards for CME management.

Primary organizer journeys:

- Create multi-step CME event records.
- Edit and delete organizer-owned CMEs.
- View event registrations.
- Mark participants present or pending.
- Assign certificate details after attendance.
- Review payments and update payment status.

## Important Repository Paths

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Root routing and shared app shell |
| `src/pages/` | Route-level pages |
| `src/components/` | Reusable UI and feature components |
| `src/components/events/` | Public event detail and registration UI |
| `src/components/orginizer/` | Organizer dashboard screens |
| `src/components/users/` | User profile and payment history UI |
| `src/redux/` | Redux store, slices, and async thunks |
| `src/services/` | API client and endpoint wrappers |
| `public/` | Static assets, manifest, and redirects |
| `netlify.toml` | Netlify SPA redirect configuration |

## Current Backend

The main API client points to:

```text
https://pravinwadeusa-001-site1.stempurl.com
```

Most CME, auth, and registration calls use this base URL. The doctors/users API currently uses a separate client with:

```text
https://pravinwadeusa-001-site1.stempurl.com/apii
```

See [API Reference](API-Reference) for details.
