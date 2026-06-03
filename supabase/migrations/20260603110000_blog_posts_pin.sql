ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS blog_posts_is_pinned_created_at_idx
  ON public.blog_posts (is_pinned DESC, created_at ASC);
