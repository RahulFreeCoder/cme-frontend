# State Management

The application uses Redux Toolkit for global state. The store is configured in:

```text
src/redux/store.js
```

## Store Slices

| Slice | Path | Purpose |
| --- | --- | --- |
| Auth | `src/redux/auth/authSlice.js` | Login, logout, token, current user |
| Events | `src/redux/events/eventsSlice.js` | Upcoming CME events and event stats |
| CME Registration | `src/redux/events/cmeRegistrationSlice.js` | Registration submission state |
| Users | `src/redux/users/usersSlice.js` | Doctor/user listing state |
| Organizer | `src/redux/organizer/OrganizerSlice.js` | Organizer CME IDs shared by dashboard screens |

## Auth State

The app treats a user as authenticated when a token exists:

```js
const isAuthenticated = !!token;
```

Protected routes require both:

- `token`
- `user`

Organizer routes also require `user.userRole` to match an allowed role.

## Events State

`getUpcomingEvents` is an async thunk that calls:

```text
fetchUpcomingEvents(startDateFrom)
```

Events state includes:

```js
{
  events: [],
  stats: {
    totalEvents: 0,
    registered: 0,
    upcoming: 0
  },
  loading: false,
  error: null
}
```

The app dispatches `getUpcomingEvents(now)` from `src/App.jsx` when the root app mounts.

## Organizer Shared State

`MyCme` loads the current organizer's CME records and dispatches CME IDs into organizer state. `Registrations` and `Payments` then use those IDs, combined with global event data, to build their event selectors.

This means organizer dashboard selectors depend on both:

- `state.organizer.cmeIds`
- `state.events.events`

## Registration Submission State

`PaymentForm` dispatches a registration thunk with the selected event and payment details.

The UI reacts to:

- `submitting`
- `successMessage`
- `errorMessage`

When registration succeeds, the modal displays a success state.

## Implementation Notes

- Keep API normalization in services or thunks, not deep inside presentation components.
- When adding new dashboard screens, prefer reusing existing organizer state for CME selection.
- When adding new role-protected routes, update `ROLES` in `src/pages/constants.js` and wrap routes with `ProtectedRoute`.
