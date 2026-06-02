-- Harden admin write access: only allow writes when am_i_admin() is true.
-- This enforces both admin role + approved admin email checks in one place.

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

DO $$
BEGIN
  -- Public-read + admin-manage tables
  IF to_regclass('public.about_bg') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage about bg" ON public.about_bg;
    CREATE POLICY "Admin can manage about bg" ON public.about_bg
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.contact_info') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage contact info" ON public.contact_info;
    CREATE POLICY "Admin can manage contact info" ON public.contact_info
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.education') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage education" ON public.education;
    CREATE POLICY "Admin can manage education" ON public.education
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.skills_categories') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage skill categories" ON public.skills_categories;
    CREATE POLICY "Admin can manage skill categories" ON public.skills_categories
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.skills_items') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage skill items" ON public.skills_items;
    CREATE POLICY "Admin can manage skill items" ON public.skills_items
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.certifications') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage certifications" ON public.certifications;
    CREATE POLICY "Admin can manage certifications" ON public.certifications
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.projects') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
    CREATE POLICY "Admin can manage projects" ON public.projects
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.success_stories') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage success stories" ON public.success_stories;
    CREATE POLICY "Admin can manage success stories" ON public.success_stories
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.testimonials') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
    CREATE POLICY "Admin can manage testimonials" ON public.testimonials
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  IF to_regclass('public.portfolio_content') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can manage portfolio content" ON public.portfolio_content;
    CREATE POLICY "Admin can manage portfolio content" ON public.portfolio_content
      FOR ALL TO authenticated
      USING (public.am_i_admin())
      WITH CHECK (public.am_i_admin());
  END IF;

  -- Admin-only read/delete tables
  IF to_regclass('public.contact_messages') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can read messages" ON public.contact_messages;
    CREATE POLICY "Admin can read messages" ON public.contact_messages
      FOR SELECT TO authenticated
      USING (public.am_i_admin());

    DROP POLICY IF EXISTS "Admin can delete messages" ON public.contact_messages;
    CREATE POLICY "Admin can delete messages" ON public.contact_messages
      FOR DELETE TO authenticated
      USING (public.am_i_admin());
  END IF;

  IF to_regclass('public.page_views') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Admin can read views" ON public.page_views;
    CREATE POLICY "Admin can read views" ON public.page_views
      FOR SELECT TO authenticated
      USING (public.am_i_admin());
  END IF;

  -- Storage write access
  DROP POLICY IF EXISTS "Admin upload website images" ON storage.objects;
  CREATE POLICY "Admin upload website images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'website-images' AND public.am_i_admin());

  DROP POLICY IF EXISTS "Admin update website images" ON storage.objects;
  CREATE POLICY "Admin update website images" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'website-images' AND public.am_i_admin());

  DROP POLICY IF EXISTS "Admin delete website images" ON storage.objects;
  CREATE POLICY "Admin delete website images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'website-images' AND public.am_i_admin());
END $$;
