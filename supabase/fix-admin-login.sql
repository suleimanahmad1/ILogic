-- Run in Supabase SQL Editor if login works but Admin panel says "role missing".
-- Safe to run multiple times.

CREATE OR REPLACE FUNCTION public.am_i_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

GRANT EXECUTE ON FUNCTION public.am_i_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, anon;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can read own roles'
  ) THEN
    CREATE POLICY "Users can read own roles" ON public.user_roles
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;
