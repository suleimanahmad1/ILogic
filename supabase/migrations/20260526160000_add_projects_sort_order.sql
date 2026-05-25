-- Fix: Could not find 'sort_order' column of 'projects' in the schema cache
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
