# Project Architecture

The CME frontend is a single-page React application built with Vite. Routing, authentication state, CME event state, organizer state, and registration state are handled on the client.

## Technology Stack

| Area | Library |
| --- | --- |
| UI framework | React 19 |
| Build tool | Vite |
| Routing | React Router |
| State management | Redux Toolkit and React Redux |
| HTTP client | Axios |
| Styling | Tailwind CSS |
| Data grids | AG Grid Community |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Carousel | Swiper |
| PWA | vite-plugin-pwa and Workbox |

## Route Map

Routes are defined in `src/App.jsx`.

| Route | Component | Access |
| --- | --- | --- |
| `/` | `Home` | Public |
| `/doctors` | `Doctors` | Public |
| `/profile` | `UserProfile` | Public route, profile data depends on auth state |
| `/organizer` | `OrganizerDashboard` with `MyCme` index | `ADMIN`, `ORGANIZER` |
| `/organizer/add` | `AddCme` | `ADMIN`, `ORGANIZER` |
| `/organizer/registrations` | `Registrations` | `ADMIN`, `ORGANIZER` |
| `/organizer/payments` | `Payments` | `ADMIN`, `ORGANIZER` |

Organizer routes are wrapped with `ProtectedRoute`.

## Authentication Flow

Login is handled by `src/redux/auth/authService.js`.

- `loginApi` posts email/password to `/api/Auth/user/login`.
- The response is normalized to `token` and `user`.
- `ProtectedRoute` checks both `token` and `user`.
- Role authorization uses `user.userRole`.

Supported role constants are:

```js
ADMIN
ORGANIZER
DOCTOR
STUDENT
```

## Application Shell

`src/App.jsx` renders:

- `Navbar`
- `AuthModal`
- route content
- global `Toaster`
- `BottomNav` for authenticated users

On app load, it dispatches `getUpcomingEvents(now)` to populate event state.

## API Layer

The shared Axios instance lives at `src/services/axiosinstance.js` and sets:

- `baseURL`
- `Content-Type: application/json`
- `Accept: */*`

Feature-specific APIs are split across:

- `src/services/eventsApi.js`
- `src/services/cmeRegistrationApi.js`
- `src/services/usersApi.js`
- `src/redux/auth/authService.js`

## UI Component Organization

| Folder | Responsibility |
| --- | --- |
| `components/events` | CME cards, detail sections, registration modal, fees, payment form |
| `components/orginizer` | Organizer CME list, creation/editing flow, registrations, payments |
| `components/users` | User profile, user info card, payment history |
| `components/ui` | Shared UI primitives and small reusable widgets |
| `components/constants` | Text and constants for feature components |

## Naming Note

The organizer folder is currently named `src/components/orginizer`. Keep imports consistent unless the folder is intentionally renamed across the project.
