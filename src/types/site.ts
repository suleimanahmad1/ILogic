export type Certification = {
  id: string;
  image: string | null;
  name: string;
  code: string | null;
  url: string | null;
  description: string | null;
  is_pinned?: boolean | null;
  created_at?: string | null;
};

export type Project = {
  id: string;
  image: string | null;
  name: string;
  description: string | null;
  role: string | null;
  github: string | null;
  live: string | null;
  is_pinned?: boolean | null;
  created_at?: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  author_name: string | null;
  is_pinned?: boolean | null;
  sort_order?: number | null;
  tags: string[] | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};
