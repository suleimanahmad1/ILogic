-- Flexible required/optional fields for admin content.

-- Education: institute + degree required; dates/image optional
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.education ALTER COLUMN year DROP NOT NULL;

-- Certifications: only course_name required
ALTER TABLE public.certifications ALTER COLUMN image_url DROP NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN code DROP NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN url DROP NOT NULL;
ALTER TABLE public.certifications ALTER COLUMN description DROP NOT NULL;

-- Projects: only name + technology required at app level; DB allows nulls
ALTER TABLE public.projects ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description DROP NOT NULL;
