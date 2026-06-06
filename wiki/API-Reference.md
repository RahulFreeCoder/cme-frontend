# API Reference

This page lists the frontend API calls currently used by the repository.

## Base Clients

Main Axios client:

```text
src/services/axiosinstance.js
```

Base URL:

```text
https://pravinwadeusa-001-site1.stempurl.com
```

Users API client:

```text
src/services/usersApi.js
```

Base URL:

```text
https://pravinwadeusa-001-site1.stempurl.com/apii
```

## Authentication

### Login

```text
POST /api/Auth/user/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Frontend response mapping:

```js
{
  status: response.status,
  token: response.data.jwttoken,
  user: response.data.user
}
```

### Signup

```text
POST /user/signup
```

Payload fields:

- `id`
- `username`
- `password`
- `prefix`
- `firstName`
- `lastName`
- `specialization`
- `email`
- `mobile`
- `userRole`
- `resetPasswordToken`

## CME Events

### Fetch Upcoming Events

```text
GET /api/CME/cme?startDateFrom={isoDate}
```

Used by:

```text
src/services/eventsApi.js
```

If the request fails, the service returns local sample CME events.

### Fetch Organizer Events

```text
GET /api/CME/cme?organizerEmail={email}
```

Used by:

```text
src/components/orginizer/MyCme.jsx
```

### Create CME

```text
POST /api/CME/admin/cme/add
```

Used by `AddCme` in add mode.

### Update CME

```text
PUT /api/CME/admin/cme/{cmeId}/update
```

Used by `AddCme` in edit mode.

### Delete CME

```text
DELETE /api/CME/admin/cme/{cmeId}/delete
```

Used by the My CME grid delete action.

### Event Stats

```text
GET /events/stats
```

If the request fails, the frontend uses:

```json
{
  "totalEvents": 6,
  "registered": 0,
  "upcoming": 6
}
```

## CME Registration

### Register for CME

```text
POST /api/CMERegistration/registerCME
```

Paid event payload shape:

```json
{
  "cmeId": "CME-2025-001",
  "emailId": "doctor@example.com",
  "paymentDetails": [
    {
      "amount": 5000,
      "date": "2026-06-06T00:00:00.000Z",
      "status": "Pending",
      "modeOfPayment": "UPI",
      "transactionId": "UPI-82937",
      "message": ""
    }
  ]
}
```

Free event payload shape:

```json
{
  "cmeId": "CME-2025-001",
  "emailId": "doctor@example.com",
  "paymentDetails": [
    {
      "amount": 0,
      "date": "2026-06-06T00:00:00.000Z",
      "status": "Confirmed",
      "modeOfPayment": "Complimentary",
      "transactionId": "FREE-1760000000000",
      "message": "Complimentary Registration"
    }
  ]
}
```

### Get Registrations By CME

```text
GET /api/CMERegistration/GetCMERegistrationByUserByCME?cmeId={cmeId}
```

Used by both registrations and payments dashboards.

### Update Registration

```text
PUT /api/CMERegistration/UpdateCMERegistration
```

Used for:

- Attendance updates.
- Payment status updates.

### Patch Registration

```text
PATCH /api/CMERegistration/UpdateCMERegistration
```

Used for certificate details in the registrations dashboard.

### Update Certificate

```text
PATCH /api/CMERegistration/UpdateCertificate
```

Defined in the registrations component as a certificate helper.

## Users

### Fetch All Users

```text
GET /User/GetAllUsers
```

Base URL for this request is:

```text
https://pravinwadeusa-001-site1.stempurl.com/apii
```

If the request fails, the frontend returns local sample doctor data.
