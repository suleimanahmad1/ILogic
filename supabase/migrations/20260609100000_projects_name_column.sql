-- projects.name is required in production; backfill from project_name/title for existing rows.
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS name TEXT;

UPDATE public.projects
SET name = COALESCE(NULLIF(trim(project_name), ''), NULLIF(trim(title), ''))
WHERE name IS NULL OR trim(name) = '';

UPDATE public.projects
SET project_name = COALESCE(NULLIF(trim(project_name), ''), name),
    title = COALESCE(NULLIF(trim(title), ''), name)
WHERE name IS NOT NULL;
