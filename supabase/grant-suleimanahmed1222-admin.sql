-- Run once in Supabase Dashboard → SQL Editor
-- Grants admin to: suleimanahmed1222@gmail.com

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'suleimanahmed1222@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Must return one row with role = admin:
SELECT u.id, u.email, r.role, u.confirmed_at
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id AND r.role = 'admin'
WHERE u.email = 'suleimanahmed1222@gmail.com';
