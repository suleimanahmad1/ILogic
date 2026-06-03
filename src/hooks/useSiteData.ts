import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { mapBlogPostRow, mapCertificationRow, mapProjectRow } from "@/lib/supabaseMappers";
import { sortByPinned } from "@/lib/sortByPinned";
import type { BlogPost, Certification, Project } from "@/types/site";

export type { BlogPost, Certification, Project } from "@/types/site";

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
};

export type EducationEntry = {
  id: string;
  institute: string;
  degree: string;
  start_date: string | null;
  end_date: string | null;
  year: string | null;
  image_url?: string | null;
  sort_order: number | null;
};

export type SkillCategory = {
  id: string;
  name: string;
  sort_order: number | null;
};

export type SkillItem = {
  id: string;
  category_id: string;
  name: string;
  sort_order: number | null;
};

export type PortfolioContent = Record<string, string>;

export const defaultContactInfo: ContactInfo = {
  email: "suleiman.inferencelogic@gmail.com",
  phone: "+92 325 9199419",
  address: "Lahore, Pakistan",
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("contact_info")
      .select("email, phone, address")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted || !data) return;
        setContactInfo({
          email: data.email || defaultContactInfo.email,
          phone: data.phone || defaultContactInfo.phone,
          address: data.address || defaultContactInfo.address,
        });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return contactInfo;
};

export const useEducationEntries = () => {
  const [items, setItems] = useState<EducationEntry[]>([]);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (!mounted) return;
        setItems(
          (data ?? []).map((row) => ({
            id: row.id,
            institute: row.institute,
            degree: row.degree,
            start_date: row.start_date,
            end_date: row.end_date,
            year: row.year,
            sort_order: row.sort_order,
            image_url: (row as { image_url?: string | null }).image_url ?? null,
          }))
        );
      });

    return () => {
      mounted = false;
    };
  }, []);

  return items;
};

export const useSkillsCatalog = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [items, setItems] = useState<SkillItem[]>([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      supabase.from("skills_categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills_items").select("*").order("sort_order", { ascending: true }),
    ]).then(([categoriesRes, itemsRes]) => {
      if (!mounted) return;
      setCategories((categoriesRes.data || []) as SkillCategory[]);
      setItems((itemsRes.data || []) as SkillItem[]);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, items };
};

export const useCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("certifications")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!mounted) return;
        setCertifications(sortByPinned((data || []).map(mapCertificationRow)));
      });

    return () => {
      mounted = false;
    };
  }, []);

  return certifications;
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!mounted) return;
        setProjects(sortByPinned((data || []).map(mapProjectRow)));
      });

    return () => {
      mounted = false;
    };
  }, []);

  return projects;
};

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!mounted) return;
        setPosts((data || []).map(mapBlogPostRow));
      });

    return () => {
      mounted = false;
    };
  }, []);

  return posts;
};

export const usePortfolioContent = () => {
  const [content, setContent] = useState<PortfolioContent>({});

  useEffect(() => {
    let mounted = true;

    supabase
      .from("portfolio_content")
      .select("key, value")
      .then(({ data }) => {
        if (!mounted) return;
        const map: PortfolioContent = {};
        (data || []).forEach((row: Pick<Tables<"portfolio_content">, "key" | "value">) => {
          map[row.key] = row.value;
        });
        setContent(map);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return content;
};
