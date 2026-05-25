-- Idempotent upsert for a single Admin-added project
-- Run this in Supabase SQL editor or include as a migration.

-- Ensure unique constraint on project_name exists so ON CONFLICT works
CREATE UNIQUE INDEX IF NOT EXISTS projects_project_name_idx ON projects (project_name);

WITH payload AS (
  SELECT
    'hello'::text AS project_name,
    'hello'::text AS title,
    'hello hello'::text AS description,
    'fastapi,tensorflow'::text AS tech_csv,
    'https://wliiyvqypltvkjcnydtz.supabase.co/storage/v1/object/public/website-images/admin-177967493'::text AS image_url,
    ''::text AS github_url,
    ''::text AS live_url
)
INSERT INTO projects (
  project_name,
  title,
  description,
  technology,
  tech_stack,
  image_url,
  github_url,
  live_url,
  sort_order
)
SELECT
  project_name,
  title,
  description,
  tech_csv AS technology,
  string_to_array(tech_csv, ',') AS tech_stack,
  image_url,
  github_url,
  live_url,
  COALESCE((SELECT max(sort_order) FROM projects), 0) + 1
FROM payload
ON CONFLICT (project_name) DO UPDATE
  SET title = EXCLUDED.title,
      description = EXCLUDED.description,
      technology = EXCLUDED.technology,
      tech_stack = EXCLUDED.tech_stack,
      image_url = EXCLUDED.image_url,
      github_url = EXCLUDED.github_url,
      live_url = EXCLUDED.live_url;
