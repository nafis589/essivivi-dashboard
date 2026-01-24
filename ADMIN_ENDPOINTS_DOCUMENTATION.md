# Admin Endpoints Documentation

## Base URL
```
http://localhost:8001/api
```

---

## 1. Create Admin User

**Endpoint:** `POST /auth/admin-users/`

**Request Body:**
```json
{
  "email": "admin@essivivi.com",
  "name": "Admin Name",
  "password": "SecurePassword123",
  "confirm_password": "SecurePassword123",
  "role": "super_admin",
  "status": "actif"
}
```

**Parameters:**
- `email` (required): Valid email address
- `name` (required): Admin full name
- `password` (required): Minimum 8 characters
- `confirm_password` (required): Must match password
- `role` (required): One of `super_admin`, `gestionnaire`, `superviseur`
- `status` (optional): `actif` or `inactif` (default: `actif`)

**Response (201 Created):**
```json
{
  "id": "5dce99c7-9d1a-44df-9db3-e7b5140d474f",
  "user_id": "8dfbfa02-a7df-4b39-b9af-4ede9238e3e0",
  "user_email": "admin@essivivi.com",
  "name": "Admin Name",
  "role": "super_admin",
  "status": "actif",
  "last_connection": null,
  "created_at": "2026-01-24T10:30:00Z",
  "updated_at": "2026-01-24T10:30:00Z",
  "message": "Admin created successfully. Can login with provided credentials."
}
```

**Error Response (400):**
```json
{
  "email": ["A user with this email already exists."],
  "confirm_password": ["Passwords do not match."],
  "password": ["Ensure this field has at least 8 characters."]
}
```

---

## 2. List All Admins

**Endpoint:** `GET /auth/admin-users/`

**Query Parameters:**
- `search` (optional): Search by name, email, or role
- `ordering` (optional): Sort by `created_at`, `name`, `role`, `status` (prefix with `-` for descending)

**Example:** `/auth/admin-users/?search=gestionnaire&ordering=-created_at`

**Response (200 OK):**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "5dce99c7-9d1a-44df-9db3-e7b5140d474f",
      "user_id": "8dfbfa02-a7df-4b39-b9af-4ede9238e3e0",
      "user_email": "super@essivivi.com",
      "name": "Super Admin",
      "role": "super_admin",
      "status": "actif",
      "last_connection": "2026-01-24T10:15:00Z",
      "created_at": "2026-01-24T09:00:00Z",
      "updated_at": "2026-01-24T09:00:00Z"
    },
    {
      "id": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
      "user_id": "b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7",
      "user_email": "gestionnaire@essivivi.com",
      "name": "Gestionnaire",
      "role": "gestionnaire",
      "status": "actif",
      "last_connection": null,
      "created_at": "2026-01-24T10:30:00Z",
      "updated_at": "2026-01-24T10:30:00Z"
    }
  ]
}
```

---

## 3. Get Single Admin

**Endpoint:** `GET /auth/admin-users/{admin_id}/`

**Path Parameters:**
- `admin_id` (required): UUID of the admin

**Response (200 OK):**
```json
{
  "id": "5dce99c7-9d1a-44df-9db3-e7b5140d474f",
  "user_id": "8dfbfa02-a7df-4b39-b9af-4ede9238e3e0",
  "user_email": "super@essivivi.com",
  "name": "Super Admin",
  "role": "super_admin",
  "status": "actif",
  "last_connection": "2026-01-24T10:15:00Z",
  "created_at": "2026-01-24T09:00:00Z",
  "updated_at": "2026-01-24T09:00:00Z"
}
```

**Error Response (404):**
```json
{
  "detail": "Not found."
}
```

---

## 4. Update Admin

**Endpoint:** `PUT /auth/admin-users/{admin_id}/`

**Path Parameters:**
- `admin_id` (required): UUID of the admin

**Request Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "role": "gestionnaire",
  "status": "inactif"
}
```

**Response (200 OK):**
```json
{
  "id": "5dce99c7-9d1a-44df-9db3-e7b5140d474f",
  "user_id": "8dfbfa02-a7df-4b39-b9af-4ede9238e3e0",
  "user_email": "super@essivivi.com",
  "name": "Updated Name",
  "role": "gestionnaire",
  "status": "inactif",
  "last_connection": "2026-01-24T10:15:00Z",
  "created_at": "2026-01-24T09:00:00Z",
  "updated_at": "2026-01-24T11:00:00Z"
}
```

---

## 5. Delete Admin

**Endpoint:** `DELETE /auth/admin-users/{admin_id}/`

**Path Parameters:**
- `admin_id` (required): UUID of the admin

**Response (204 No Content)**
Empty response on success

**Error Response (404):**
```json
{
  "detail": "Not found."
}
```

---

## 6. Admin Login

**Endpoint:** `POST /auth/login/`

**Request Body:**
```json
{
  "email": "admin@essivivi.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "8dfbfa02-a7df-4b39-b9af-4ede9238e3e0",
    "email": "admin@essivivi.com",
    "first_name": "Admin",
    "last_name": "Name",
    "user_type": "admin",
    "is_verified": true,
    "is_active": true
  }
}
```

**Error Response (401):**
```json
{
  "non_field_errors": ["Unable to log in with provided credentials."]
}
```

---

## Authentication

All admin endpoints except `/auth/login/` require Bearer token authentication:

```
Authorization: Bearer {access_token}
```

---

## Admin Roles

| Role | Description |
|------|-------------|
| `super_admin` | Full system access, can manage all admins |
| `gestionnaire` | Manager, can manage clients and agents |
| `superviseur` | Supervisor, can view reports and deliveries |

---

## Admin Status

| Status | Description |
|--------|-------------|
| `actif` | Active admin account |
| `inactif` | Inactive admin account |

---

## Common Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (success with no response body) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid credentials) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |
