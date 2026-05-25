-- Pin featured projects & certifications (show first on site)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS projects_is_pinned_created_at_idx
  ON public.projects (is_pinned DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS certifications_is_pinned_created_at_idx
  ON public.certifications (is_pinned DESC, created_at ASC);
