# Organizer Guide

Organizer screens are available under:

```text
/organizer
```

Access is limited to users with `ADMIN` or `ORGANIZER` role.

## My CME

Route:

```text
/organizer
```

Component:

```text
src/components/orginizer/MyCme.jsx
```

The My CME screen loads organizer-specific events with:

```text
GET /api/CME/cme?organizerEmail={email}
```

Capabilities:

- View organizer-owned CME events in AG Grid.
- Search by title, ID, or speciality.
- Sort and filter grid columns.
- Edit a CME in `EditCmeModal`.
- Delete a CME after confirmation.

Delete endpoint:

```text
DELETE /api/CME/admin/cme/{cmeId}/delete
```

## Add CME

Route:

```text
/organizer/add
```

Component:

```text
src/components/orginizer/AddCme.jsx
```

The Add CME workflow is a multi-step event creation form.

Steps:

1. Basic Info
2. Date & Location
3. Capacity & Credits
4. Fees
5. Schedule
6. Organizer & Contact
7. Payment
8. Additional Info
9. Review

Create endpoint:

```text
POST /api/CME/admin/cme/add
```

Update endpoint:

```text
PUT /api/CME/admin/cme/{cmeId}/update
```

## CME Form Data

The form captures:

- `title`
- `description`
- `speciality`
- `cmeCategories`
- `startDate`
- `endDate`
- `startTime`
- `endTime`
- `location`
- `registrationFees`
- `credits`
- `totalSeats`
- `schedule`
- `organizer`
- `contact`
- `paymentDetails`
- `additionalInformation`
- `isActive`

In add mode, `cmeId` is removed from the payload so the backend can generate it.

## Registrations

Route:

```text
/organizer/registrations
```

Component:

```text
src/components/orginizer/Registrations.jsx
```

The screen allows organizers to select a CME and review participants.

Registration lookup endpoint:

```text
GET /api/CMERegistration/GetCMERegistrationByUserByCME?cmeId={cmeId}
```

Capabilities:

- View participants for a selected CME.
- Search within registrations.
- Mark attendance as present or pending.
- Assign or edit certificate details after a participant is marked present.

Attendance update endpoint:

```text
PUT /api/CMERegistration/UpdateCMERegistration
```

Certificate update endpoint:

```text
PATCH /api/CMERegistration/UpdateCMERegistration
```

There is also a `saveCertificate` helper targeting:

```text
PATCH /api/CMERegistration/UpdateCertificate
```

## Payments

Route:

```text
/organizer/payments
```

Component:

```text
src/components/orginizer/Payments.jsx
```

The payments screen loads registration records for a selected CME and flattens the first `paymentDetails` entry into grid columns.

Capabilities:

- View payment transaction ID, participant email, amount, payment mode, and payment status.
- Search payments.
- View confirmed revenue total.
- Mark payments as `Confirmed`, `Rejected`, or `Reversal`.

Payment status update endpoint:

```text
PUT /api/CMERegistration/UpdateCMERegistration
```

Status update payload includes:

```json
{
  "cmeId": "CME-2025-001",
  "emailId": "doctor@example.com",
  "transactionId": "UPI-123",
  "status": "Confirmed"
}
```
