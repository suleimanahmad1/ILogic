-- Let logged-in clients check admin status via RPC (bypasses user_roles RLS).
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, anon;

-- Users must be able to read their own role row (fallback if RPC unavailable).
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
