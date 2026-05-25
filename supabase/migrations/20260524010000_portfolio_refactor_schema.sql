-- Core single-row settings
CREATE TABLE IF NOT EXISTS public.about_bg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.about_bg ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  address TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute TEXT NOT NULL,
  degree TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  year TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS end_date TEXT;

-- Skills catalog
CREATE TABLE IF NOT EXISTS public.skills_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills_categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.skills_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skills_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills_items ENABLE ROW LEVEL SECURITY;

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  course_name TEXT NOT NULL,
  code TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS course_name TEXT;
ALTER TABLE public.certifications ALTER COLUMN image_url SET NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN course_name SET NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN code SET NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN url SET NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN description SET NOT NULL;

-- Projects (augment existing table)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technology TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_name TEXT;

-- Storage bucket for all uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true)
ON CONFLICT (id) DO NOTHING;

-- Helper to avoid policy duplication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'about_bg' AND policyname = 'Anyone can read about bg') THEN
    CREATE POLICY "Anyone can read about bg" ON public.about_bg FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'about_bg' AND policyname = 'Admin can manage about bg') THEN
    CREATE POLICY "Admin can manage about bg" ON public.about_bg FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_info' AND policyname = 'Anyone can read contact info') THEN
    CREATE POLICY "Anyone can read contact info" ON public.contact_info FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_info' AND policyname = 'Admin can manage contact info') THEN
    CREATE POLICY "Admin can manage contact info" ON public.contact_info FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'education' AND policyname = 'Anyone can read education') THEN
    CREATE POLICY "Anyone can read education" ON public.education FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'education' AND policyname = 'Admin can manage education') THEN
    CREATE POLICY "Admin can manage education" ON public.education FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'skills_categories' AND policyname = 'Anyone can read skill categories') THEN
    CREATE POLICY "Anyone can read skill categories" ON public.skills_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'skills_categories' AND policyname = 'Admin can manage skill categories') THEN
    CREATE POLICY "Admin can manage skill categories" ON public.skills_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'skills_items' AND policyname = 'Anyone can read skill items') THEN
    CREATE POLICY "Anyone can read skill items" ON public.skills_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'skills_items' AND policyname = 'Admin can manage skill items') THEN
    CREATE POLICY "Admin can manage skill items" ON public.skills_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certifications' AND policyname = 'Anyone can read certifications') THEN
    CREATE POLICY "Anyone can read certifications" ON public.certifications FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certifications' AND policyname = 'Admin can manage certifications') THEN
    CREATE POLICY "Admin can manage certifications" ON public.certifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Anyone can read projects') THEN
    CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Admin can manage projects') THEN
    CREATE POLICY "Admin can manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Storage object policies for uploaded images
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read website images') THEN
    CREATE POLICY "Public read website images" ON storage.objects FOR SELECT USING (bucket_id = 'website-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin upload website images') THEN
    CREATE POLICY "Admin upload website images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'website-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin update website images') THEN
    CREATE POLICY "Admin update website images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'website-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin delete website images') THEN
    CREATE POLICY "Admin delete website images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'website-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;
