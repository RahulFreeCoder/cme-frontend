# Contributing

This page describes recommended contribution practices for the CME frontend.

## Local Workflow

1. Create a feature or fix branch.
2. Install dependencies with `npm install`.
3. Run the app with `npm run dev`.
4. Make focused changes.
5. Run `npm run lint`.
6. Run `npm run build` for larger changes or before deployment.
7. Open a pull request.

## Code Style

- Follow existing React component patterns.
- Prefer feature folders that already exist in `src/components`.
- Keep API calls in `src/services` or Redux thunks when possible.
- Keep route-level composition in `src/pages` and `src/App.jsx`.
- Use Redux Toolkit for shared async state.
- Use local component state for form-only state.
- Use Lucide React icons where icons are needed.
- Keep Tailwind class usage consistent with existing components.

## Adding Routes

Add routes in:

```text
src/App.jsx
```

For protected routes, wrap the component with:

```jsx
<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]}>
  <YourComponent />
</ProtectedRoute>
```

## Adding API Calls

Use the shared Axios instance for main backend calls:

```text
src/services/axiosinstance.js
```

Recommended pattern:

```js
export async function fetchSomething() {
  const { data } = await axiosInstance.get("/api/example");
  return data;
}
```

Then call that service from a Redux async thunk or a feature component.

## Adding Organizer Features

Organizer features usually belong under:

```text
src/components/orginizer/
```

When adding screens that need a selected CME, reuse organizer event IDs from Redux where practical.

## Pull Request Checklist

- The UI still works on mobile and desktop.
- Protected routes redirect correctly for unauthenticated users.
- API errors show useful feedback.
- Free and paid registration flows still submit the expected payloads.
- Organizer grids still load, search, and paginate.
- `npm run lint` passes.
- `npm run build` passes for release-ready changes.

## Known Improvement Areas

- Move hardcoded API base URLs into environment variables.
- Consolidate the separate users API client with the main API configuration if the backend permits it.
- Rename `orginizer` to `organizer` across the project when there is time for a coordinated import update.
- Add automated tests for auth, event registration, and organizer payment/attendance flows.
- Add a repository-level `.env.example`.
