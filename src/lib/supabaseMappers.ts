import type { Tables } from "@/integrations/supabase/types";
import { parseBlogAuthorName } from "@/lib/blogAuthor";
import type { BlogPost, Certification, Project } from "@/types/site";

export const mapCertificationRow = (row: Tables<"certifications">): Certification => ({
  id: row.id,
  image: row.image_url,
  name: row.course_name,
  code: row.code,
  url: row.url,
  description: row.description,
  is_pinned: row.is_pinned,
  created_at: row.created_at,
});

export const mapProjectRow = (row: Tables<"projects">): Project => ({
  id: row.id,
  image: row.image_url,
  name: row.name || row.project_name || row.title,
  description: row.description,
  role: row.technology,
  github: row.github_url,
  live: row.live_url,
  is_pinned: row.is_pinned,
  created_at: row.created_at,
});

export const mapBlogPostRow = (row: Tables<"blog_posts">): BlogPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  cover_url: row.cover_url,
  author_name: parseBlogAuthorName(row),
  is_pinned: row.is_pinned,
  sort_order: row.sort_order,
  tags: row.tags,
  published: row.published,
  created_at: row.created_at,
  updated_at: row.updated_at,
});
