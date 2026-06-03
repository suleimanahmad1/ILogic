ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS projects_is_pinned_created_at_idx
  ON public.projects (is_pinned DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS certifications_is_pinned_created_at_idx
  ON public.certifications (is_pinned DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS blog_posts_is_pinned_created_at_idx
  ON public.blog_posts (is_pinned DESC, created_at ASC);
