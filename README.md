# Yongolailan — Official Website

The official site for **Yongolailan** (Carlos José Martínez) — Cuban DJ, producer, and live
electronic performer. Next.js app with a full admin panel, newsletter, and contact form.

- **Public site:** the homepage (`/`) — Home, Catalog, Portfolio, EPK, Photos, Merch, About,
  Contact, Links.
- **Admin panel:** `/admin` (password-protected) — edit and upload everything, show/hide
  sections, run the newsletter, read messages.

## Tech

- **Next.js 14** (App Router, TypeScript)
- **Prisma** ORM — SQLite locally, **Postgres** in production
- **Vercel Blob** for uploads (local dev falls back to `/public/uploads`)
- **Resend** for email (contact form + newsletter)
- **iron-session** for admin auth

## Run it locally

> This machine's network resets IPv6 downloads, so the scripts force IPv4. If you ever run
> `npm`/`prisma`/`next` by hand and a download fails with `ECONNRESET`, prefix it with
> `NODE_OPTIONS=--dns-result-order=ipv4first`.

```bash
npm install
npm run db:push      # create the local SQLite database
npm run db:seed      # load the starting content
npm run dev          # http://localhost:3000  (admin at /admin)
```

Admin password and other secrets live in `.env` (copy from `.env.example`). The default local
admin password is `yongo-admin` — change it for production.

## Useful scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:push` | Sync the schema to the database |
| `npm run db:seed` | Seed starting content (safe to re-run) |
| `npm run db:studio` | Open Prisma Studio to inspect data |

## Deploying

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full step-by-step (GitHub → Vercel → domain).

## Project layout

```
app/                 Next.js routes
  page.tsx           Public homepage (assembles all sections)
  admin/             Admin panel (login, dashboard, content managers, newsletter, messages)
  api/               contact, newsletter, unsubscribe, admin upload
components/site/      Public site sections (Hero, Catalog, EPK, …)
components/admin/     Admin widgets (image upload, fields, sidebar)
lib/                 prisma, session, email, blob, settings, data
prisma/              schema.prisma + seed.ts
public/images/       Site images
_reference/          Original design + planning docs (not deployed)
```
