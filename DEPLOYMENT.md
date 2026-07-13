# Deploying Yongolailan to Vercel

A plain-language, step-by-step guide to take this site live at **yongolailan.xyz**.
Most of the technical steps I (Claude) can run for you — this doc is the map, and the
record of what goes where.

## What you'll need (all free to start)

- **GitHub** account (you already have `carlosjmg`, repo `yongolailan.xyz`).
- **Vercel** account — sign up at vercel.com with your GitHub (free "Hobby" plan).
- **Resend** account — sign up at resend.com for email (free tier ~3,000/month).
- Your **Namecheap** login (for the domain's DNS).

You never paste passwords into the chat. API keys go into Vercel's settings or the local `.env`.

---

## Step 1 — Put the code on GitHub

```bash
git add .
git commit -m "Initial site, admin, and newsletter"
git branch -M main
git remote add origin https://github.com/carlosjmg/yongolailan.xyz.git   # already set
git push -u origin main
```

The first push will ask you to sign in to GitHub (a browser window or a device code).

---

## Step 2 — Switch the database to Postgres

Local development uses a simple file database (SQLite). Production needs Postgres. In
`prisma/schema.prisma`, change:

```prisma
datasource db {
  provider = "sqlite"        // ← change to "postgresql"
  url      = env("DATABASE_URL")
}
```

Commit and push that change. (I'll do this with you at deploy time.)

---

## Step 3 — Import into Vercel + add storage

1. On **vercel.com** → **Add New… → Project** → import `carlosjmg/yongolailan.xyz`.
2. Framework preset: **Next.js** (auto-detected). Don't deploy yet — first add storage:
3. Project → **Storage** → **Create Database → Postgres** → accept. This automatically adds
   a `DATABASE_URL` environment variable to the project.
4. Project → **Storage** → **Create → Blob** → accept. This adds `BLOB_READ_WRITE_TOKEN`.

---

## Step 4 — Environment variables

In Vercel → Project → **Settings → Environment Variables**, add these (Production + Preview):

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | A strong password you choose (this logs you into `/admin`). |
| `SESSION_SECRET` | A long random string (32+ chars). Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | `https://yongolailan.xyz` |
| `CONTACT_TO_EMAIL` | `yongolailan.official@gmail.com` (where contact messages are emailed) |
| `EMAIL_FROM` | `Yongolailan <onboarding@resend.dev>` (change to your domain once verified) |
| `RESEND_API_KEY` | From Step 6. |

`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` were added automatically in Step 3.

---

## Step 5 — Create the database tables and starting content

Once `DATABASE_URL` exists, run **once** (I can do this for you, pointed at the production URL):

```bash
npx prisma db push     # creates all the tables
npm run db:seed        # loads the catalog, links, awards, etc.
```

---

## Step 6 — Email (Resend)

1. On **resend.com** → **API Keys** → create one → copy it into `RESEND_API_KEY` in Vercel.
2. (Optional, better deliverability) **Domains → Add** `yongolailan.xyz`, add the DNS records
   it shows you at Namecheap, then change `EMAIL_FROM` to something like
   `Yongolailan <hello@yongolailan.xyz>`. Until then, `onboarding@resend.dev` works.

---

## Step 7 — Connect the domain (Namecheap)

1. Vercel → Project → **Settings → Domains** → add `yongolailan.xyz` **and** `www.yongolailan.xyz`.
2. Vercel shows the records to create. At **Namecheap → Domain List → Manage → Advanced DNS**:
   - **A record** — Host `@` → `76.76.21.21` (Vercel shows the exact IP).
   - **CNAME** — Host `www` → `cname.vercel-dns.com`.
   - Remove any conflicting existing `@`/`www` records (e.g. parking page).
3. Wait for DNS to propagate and SSL to issue (usually minutes, up to a few hours). Vercel
   shows a green check when ready.

---

## Step 8 — Final checks (on the live URL)

- [ ] Home page and every section load; images look right.
- [ ] Log in at `/admin` with your `ADMIN_PASSWORD`.
- [ ] Add a test release with a cover image → it appears on the site.
- [ ] Submit the contact form → the message arrives in your inbox and shows in **Messages**.
- [ ] Subscribe with the newsletter form → the subscriber shows in **Newsletter**.
- [ ] HTTPS padlock is green.

---

## Updating the site later

- **Content** (music, art, videos, games, photos, links, text, show/hide): just use `/admin`.
  Changes are live immediately.
- **Design/code changes:** edit locally, `git push` — Vercel redeploys automatically.
