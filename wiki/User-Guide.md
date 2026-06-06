# User Guide

This page describes the public and authenticated user experience.

## Public Home Page

The home page displays upcoming CME events loaded through Redux from the events API. Event cards and detail views expose information such as:

- Title and description.
- Specialities and CME categories.
- Date, time, and location.
- CME credits.
- Seat availability.
- Registration fees.
- Schedule and speakers.
- Organizer and contact information.
- Payment details for paid events.
- Additional instructions.

## Event Registration

Users register through the event registration modal.

For free events:

- The UI marks the registration as complimentary.
- Amount is set to `0`.
- Payment mode is set to `Complimentary`.
- Status is set to `Confirmed`.
- A generated transaction ID starts with `FREE-`.

For paid events:

- The user enters amount paid.
- The user selects payment date.
- The user enters a transaction or reference ID.
- The user selects payment mode such as UPI, Bank Transfer, or Cash.
- The registration is submitted with payment status `Pending`.

Registration is submitted to the backend through `submitCMERegistration`, which calls `registerCME`.

## Doctors Page

The doctors page uses `fetchAllUsers` from `src/services/usersApi.js`.

If the backend request fails, sample doctors are returned so the UI can still render.

## Profile Page

The profile page is mounted at:

```text
/profile
```

It uses authenticated user state and user-related components to display profile and payment history information.

## Login and Registration

The navigation login action opens `AuthModal`.

Login:

- Sends email and password to `/api/Auth/user/login`.
- Stores the returned JWT token and user details in Redux auth state.

Registration:

- Splits `name` into `firstName` and `lastName`.
- Sets `username` and `email` to the submitted email.
- Maps `userType` to uppercase `userRole`.
- Posts to `/user/signup`.

## Role-Based Access

Only users with these roles can access organizer screens:

- `ADMIN`
- `ORGANIZER`

If an unauthenticated user or unauthorized role visits an organizer route, the app redirects to `/`.
