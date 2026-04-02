
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
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

-- Contact messages table (visitors can insert, admin can read/delete)
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a message" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin can read messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Portfolio content table (key-value store for about text etc.)
CREATE TABLE public.portfolio_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content" ON public.portfolio_content
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage content" ON public.portfolio_content
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  url TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage projects" ON public.projects
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

CREATE POLICY "Admin can upload resumes" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can download resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Admin can delete resumes" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
