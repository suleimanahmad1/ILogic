-- Fix missing tables, drop success_events, improve RLS, seed content.

-- Ensure role enum and helper exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can read own roles'
  ) THEN
    CREATE POLICY "Users can read own roles" ON public.user_roles
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Admin can read roles'
  ) THEN
    CREATE POLICY "Admin can read roles" ON public.user_roles
      FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Contact messages (About dashboard form + Admin inbox)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Anyone can send a message'
  ) THEN
    CREATE POLICY "Anyone can send a message" ON public.contact_messages
      FOR INSERT TO anon, authenticated
      WITH CHECK (
        length(trim(name)) > 0 AND
        length(trim(email)) > 0 AND
        length(trim(message)) > 0
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Admin can read messages'
  ) THEN
    CREATE POLICY "Admin can read messages" ON public.contact_messages
      FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Admin can delete messages'
  ) THEN
    CREATE POLICY "Admin can delete messages" ON public.contact_messages
      FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Page views (homepage analytics)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'page_views' AND policyname = 'Anyone can log a view'
  ) THEN
    CREATE POLICY "Anyone can log a view" ON public.page_views
      FOR INSERT TO anon, authenticated WITH CHECK (length(trim(path)) > 0);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'page_views' AND policyname = 'Admin can read views'
  ) THEN
    CREATE POLICY "Admin can read views" ON public.page_views
      FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Success stories (About dashboard testimonials)
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business TEXT,
  text TEXT NOT NULL,
  photo TEXT,
  rating INT DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'success_stories' AND policyname = 'Anyone can read success stories'
  ) THEN
    CREATE POLICY "Anyone can read success stories" ON public.success_stories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'success_stories' AND policyname = 'Admin can manage success stories'
  ) THEN
    CREATE POLICY "Admin can manage success stories" ON public.success_stories
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Portfolio content keys used by the app
INSERT INTO public.portfolio_content (key, value)
SELECT * FROM (
  VALUES
    ('hero_subtitle', 'Full Stack AI / ML Engineer'),
    ('footer_text', 'Suleiman Ahmed — Full Stack & AI Engineer building practical, production-ready systems.'),
    ('about_text', '<p>AI & Full Stack Engineer with 3+ years building intelligent, automated systems.</p>'),
    ('services', 'AI,MERN,Automation')
) AS seed(key, value)
ON CONFLICT (key) DO NOTHING;

-- Seed testimonials when empty
INSERT INTO public.success_stories (name, business, text, photo, rating)
SELECT * FROM (
  VALUES
    ('Ali Raza', 'Product Manager, Stealth Startup', 'Shaheer shipped our RAG pipeline in days, not weeks. Sharp engineer with a real eye for product.', NULL::text, 5),
    ('Sara Khan', 'CTO, Nimbus AI', 'Reliable, fast, and curious. Best n8n + AI automation work I''ve seen for a lean team.', NULL::text, 5),
    ('Daniyal M.', 'Founder, Loop Labs', 'From MVP to production in one sprint. Full-stack chops with serious AI depth.', NULL::text, 5)
) AS seed(name, business, text, photo, rating)
WHERE NOT EXISTS (SELECT 1 FROM public.success_stories LIMIT 1);

-- Seed certifications when empty (matches seed migration)
INSERT INTO public.certifications (course_name, name, code, url, description, image_url, sort_order)
SELECT * FROM (
  VALUES
    ('Machine Learning', 'Machine Learning', 'ML-001', 'https://example.com', 'Machine learning foundations and practical model-building skills.', 'https://placehold.co/1200x800/png?text=Machine+Learning', 1),
    ('n8n AI Automation', 'n8n AI Automation', 'N8N-002', 'https://example.com', 'Workflow automation with n8n for AI-driven integrations and pipelines.', 'https://placehold.co/1200x800/png?text=n8n+AI+Automation', 2),
    ('Gemini Certified Student', 'Gemini Certified Student', 'GEM-003', 'https://example.com', 'Gemini-focused learning and AI tooling certificate.', 'https://placehold.co/1200x800/png?text=Gemini+Certified+Student', 3),
    ('Hafiz-e-Quran', 'Hafiz-e-Quran', 'QUR-004', 'https://example.com', 'Memorization achievement with discipline and consistency.', 'https://placehold.co/1200x800/png?text=Hafiz-e-Quran', 4)
) AS seed(course_name, name, code, url, description, image_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.certifications LIMIT 1);

-- Remove success_events feature
DROP TABLE IF EXISTS public.success_events CASCADE;
