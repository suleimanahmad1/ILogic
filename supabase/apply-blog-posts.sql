-- Run in Supabase SQL Editor if blog_posts table is missing.

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published posts" ON public.blog_posts;
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin can read all posts" ON public.blog_posts;
CREATE POLICY "Admin can read all posts" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (public.am_i_admin());

DROP POLICY IF EXISTS "Admin can manage posts" ON public.blog_posts;
CREATE POLICY "Admin can manage posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.am_i_admin())
  WITH CHECK (public.am_i_admin());
