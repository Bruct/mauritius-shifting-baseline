# Mauritius Shifting Baseline — Setup Guide

## Prerequisites
- Node.js 18+ (https://nodejs.org)
- A Supabase account (https://supabase.com) — free tier is sufficient
- A Mapbox account (https://mapbox.com) — free tier is sufficient

---

## Step 1 — Install dependencies

```bash
cd mauritius-shifting-baseline
npm install
```

---

## Step 2 — Set up Supabase

1. Go to https://supabase.com and create a new project
2. Name it `mauritius-shifting-baseline`
3. Wait for the project to initialize (takes ~1 minute)
4. Go to **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Run the database migrations

In the Supabase dashboard, go to **SQL Editor** and run each migration file in order:

1. `supabase/migrations/0001_extensions.sql`
2. `supabase/migrations/0002_tables.sql`
3. `supabase/migrations/0003_rls_policies.sql`
4. `supabase/migrations/0004_indexes.sql`

### Seed demo data (optional but recommended)

Run `supabase/seed.sql` in the SQL Editor to populate demo testimonies, locations, and species.

### Create Storage bucket

In Supabase dashboard → **Storage**:
1. Create bucket named `testimony-media`
2. Set as **private** (authenticated access)
3. Add policy: Allow public SELECT on objects in published testimonies
4. Add policy: Allow authenticated INSERT for own files

### Create your first admin user

After running the app and creating an account, run this in SQL Editor:
```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
```

---

## Step 3 — Set up Mapbox

1. Go to https://mapbox.com and create a free account
2. Go to **Account → Access Tokens**
3. Copy your **Default public token** → `NEXT_PUBLIC_MAPBOX_TOKEN`

---

## Step 4 — Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 5 — Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 6 — Deploy to Vercel (optional)

```bash
npm install -g vercel
vercel
```

Add the same environment variables in the Vercel dashboard → Project Settings → Environment Variables.

Don't forget to update `NEXT_PUBLIC_APP_URL` to your production URL, and add it to Supabase's allowed redirect URLs:
- Supabase Dashboard → Authentication → URL Configuration → Add `https://your-app.vercel.app`

---

## Project Structure

```
mauritius-shifting-baseline/
├── app/[locale]/           # Pages (Next.js App Router with i18n)
├── components/
│   ├── layout/             # Header, Footer, LocaleSwitcher
│   ├── map/                # Mapbox map components
│   ├── testimony/          # Testimony cards, detail, audio player
│   ├── submission/         # Multi-step testimony submission form
│   ├── species/            # Species encyclopedia
│   └── admin/              # Admin review dashboard
├── lib/
│   ├── supabase/           # Database client & types
│   ├── mapbox/             # Map configuration
│   ├── validations/        # Zod schemas
│   └── constants/          # Mauritius-specific constants
├── messages/               # i18n translations (EN, FR, Kreol)
├── supabase/
│   ├── migrations/         # Database schema
│   └── seed.sql            # Demo data
└── styles/                 # Global CSS
```

---

## Adding a new user role as admin

To make a user an admin (after they sign up):
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

---

## Languages

The app supports three languages:
- **English** (`/en/...`)
- **French** (`/fr/...`)
- **Mauritian Kreol** (`/mfe/...`)

Translation files are in `messages/`. The Kreol translations may need review by a native speaker.
