# Portfolio Refactor

This workspace now contains the current Vite + React + TypeScript app and a separate modular static refactor under `static-refactor/`.

Current app setup
-----------------

1. Install dependencies.

```bash
npm install
```

2. Run the app locally.

```bash
npm run dev
```

3. Build for production.

```bash
npm run build
```

Supabase setup
--------------

1. Add the fresh anon key to your environment file.

```bash
VITE_SUPABASE_URL=https://wlijvyqypltvkjcnydtz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-fresh-anon-key
```

2. Apply the SQL migrations in `supabase/migrations/`.

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

3. Make sure the public bucket `website-images` exists. The repo now includes a migration that creates it.

Static refactor folder
----------------------

If you want the plain modular version, open `static-refactor/index.html` through a static server and edit these files:

- `static-refactor/css/style.css`
- `static-refactor/js/supabaseClient.js`
- `static-refactor/js/auth.js`
- `static-refactor/js/admin.js`
- `static-refactor/js/main.js`

Useful commands
---------------

```bash
npm run test
npm run build
```

Notes
-----

- Images are uploaded to Supabase Storage only and saved as public URLs in the database.
- Logout stays inside the Admin panel.
- If you see `bucket not found`, apply the `website-images` migration or create the bucket in the Supabase dashboard.

