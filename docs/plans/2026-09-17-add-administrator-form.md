# Add administrator form

## Goal

Allow only superadministrators to create an active administrator from the administrator management page.

## Scope

1. Add a Nuxt server endpoint that forwards authenticated `POST /api/users` requests to the backend.
2. Add a superadministrator-only modal form to `/admin/administrators` for fullname, username, email, phone number, address, and password.
3. Force `role: "administrator"` in the client request; do not expose a role selector or any path to create a superadministrator.
4. Refresh the administrator table and show an outcome toast after creation.

## Verification

- Build the Nuxt application.
- Inspect the server route for cookie-derived authorization forwarding and status propagation.
- Confirm the page only renders the create button/modal for `isSuperadministrator`.
