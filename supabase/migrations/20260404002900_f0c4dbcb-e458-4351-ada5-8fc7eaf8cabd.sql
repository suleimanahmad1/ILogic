
-- Add github_url and live_url to projects
ALTER TABLE public.projects ADD COLUMN github_url text DEFAULT NULL;
ALTER TABLE public.projects ADD COLUMN live_url text DEFAULT NULL;

-- Create certificates table
CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  organization text NOT NULL,
  year text NOT NULL,
  code text DEFAULT NULL,
  url text DEFAULT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read certificates"
ON public.certificates FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin can manage certificates"
ON public.certificates FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
