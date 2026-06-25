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
- `/admin` — lets you pick a new date and submits it via a serverless
  function (`/api/update-date`), which uses Supabase's service role key to
  bypass RLS and write the update.
- The browser never has write access to Supabase directly — only the
  serverless function does, via a key that stays server-side.

⚠️ **No authentication yet.** `/admin` is unlisted but not protected — anyone
who finds the URL can change the date. Fine for now; see "Future work" below.