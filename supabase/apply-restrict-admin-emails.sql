-- Paste in Supabase SQL Editor (production) to lock admin login to your email only.

CREATE OR REPLACE FUNCTION public.am_i_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = auth.uid()
      AND lower(trim(u.email)) = ANY (
        ARRAY[
          lower(trim('suleimanahmed1222@gmail.com'))
        ]::text[]
      )
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );
$$;

GRANT EXECUTE ON FUNCTION public.am_i_admin() TO authenticated;

DELETE FROM public.user_roles ur
WHERE ur.role = 'admin'::public.app_role
  AND NOT EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE u.id = ur.user_id
      AND lower(trim(u.email)) = lower(trim('suleimanahmed1222@gmail.com'))
  );
