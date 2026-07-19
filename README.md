# Retirement Countdown

A small site that counts down to a retirement date stored in Supabase, with a
simple admin page to update that date.

## Stack

- **Vite + React + TypeScript** — frontend
- **Supabase** — stores the retirement date (Postgres + RLS)
- **Vercel** — hosting + serverless function for writes

## How it works

- `/` — fetches the current retirement date from Supabase (public, read-only)
  and renders a live countdown.
- `/admin` — requires Supabase Auth login via Google.
- Authenticated admins submit date changes through the serverless function
  (`/api/update-date`).
- The browser never has write access to Supabase directly — only the
  serverless function does, via a key that stays server-side.

## Authentication and authorization

Admin writes are now protected by both frontend and backend checks:

- Frontend (`/admin`):
  - User must be signed in with Supabase Auth (Google OAuth).
  - User email must match the configured admin email in the app code.
  - Request includes the user's access token as a Bearer token.
- Backend (`/api/update-date`):
  - Verifies the Bearer token with Supabase (`auth.getUser(token)`).
  - Compares authenticated user email to `ADMIN_EMAIL` env var.
  - Only then updates `retirement_settings` using the service role client.

This means hidden-route access alone is no longer enough to update the date.

## Environment variables

Set these for local development and deployment:

- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.
- `ADMIN_EMAIL` should match the Google account allowed to update the date.

## Local development

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build production assets
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build