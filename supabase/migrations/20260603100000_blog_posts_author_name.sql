-- Manual author name per blog post (typed in admin).

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_name TEXT;

COMMENT ON COLUMN public.blog_posts.author_name IS 'Display author name; set manually in admin.';
