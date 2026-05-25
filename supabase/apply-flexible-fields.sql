-- Run in Supabase SQL Editor (same as migration 20260526150000_flexible_content_fields.sql)

ALTER TABLE public.education ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.education ALTER COLUMN year DROP NOT NULL;

ALTER TABLE public.certifications ALTER COLUMN image_url DROP NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN code DROP NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN url DROP NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN description DROP NOT NULL;

ALTER TABLE public.projects ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description DROP NOT NULL;
