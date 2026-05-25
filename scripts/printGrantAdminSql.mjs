const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/printGrantAdminSql.mjs your@email.com");
  process.exit(1);
}

const safe = email.replace(/'/g, "''");
console.log(`
-- Paste into Supabase Dashboard → SQL Editor → Run

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = '${safe}'
ON CONFLICT (user_id, role) DO NOTHING;

SELECT u.email, r.role
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
WHERE u.email = '${safe}';
`);
