# Supabase Migrations

## Running migrations

### Option 1 — Supabase Dashboard (recommended for solo/small teams)

1. Open your project at https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Paste the contents of the migration file you want to run
4. Click **Run**

### Option 2 — Supabase CLI

```bash
# Install CLI if needed
npm install -g supabase

# Link to your remote project (one-time setup)
supabase link --project-ref <your-project-ref>

# Push all pending migrations
supabase db push
```

## Migration files

| File | Description |
|------|-------------|
| `20260323_add_user_profiles.sql` | Adds `auth_user_id` column to `creators` and creates the `user_profiles` table with RLS policies |

## Notes

- The full initial schema lives in `schema.sql` at the repo root. Run that first on a fresh database.
- After running migrations, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` to exit demo mode.
