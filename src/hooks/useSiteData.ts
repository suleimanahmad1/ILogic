import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sortByPinned } from "@/lib/sortByPinned";

const db = supabase as any;

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
  image_url: string | null;
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

export type SuccessStory = {
  id: string;
  name: string;
  business: string;
  text: string;
  photo: string | null;
  rating: number | null;
};

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

export type PortfolioContent = Record<string, string>;

export const defaultContactInfo: ContactInfo = {
  email: "suleiman.inferencelogic@gmail.com",
  phone: "+92 325 9199419",
  address: "Lahore, Pakistan",
};

const fallbackStories: SuccessStory[] = [
  {
    id: "1",
    name: "Ali Raza",
    business: "Product Manager, Stealth Startup",
    text: "Shaheer shipped our RAG pipeline in days, not weeks. Sharp engineer with a real eye for product.",
    photo: null,
    rating: 5,
  },
  {
    id: "2",
    name: "Sara Khan",
    business: "CTO, Nimbus AI",
    text: "Reliable, fast, and curious. Best n8n + AI automation work I've seen for a lean team.",
    photo: null,
    rating: 5,
  },
  {
    id: "3",
    name: "Daniyal M.",
    business: "Founder, Loop Labs",
    text: "From MVP to production in one sprint. Full-stack chops with serious AI depth.",
    photo: null,
    rating: 5,
  },
];

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    let mounted = true;

    db.from("contact_info").select("*").limit(1).then(({ data }: any) => {
      if (!mounted) return;
      const row = data?.[0];
      if (row) {
        setContactInfo({
          email: row.email || defaultContactInfo.email,
          phone: row.phone || defaultContactInfo.phone,
          address: row.address || defaultContactInfo.address,
        });
      }
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

    db.from("education").select("*").order("sort_order", { ascending: true }).then(({ data }: any) => {
      if (!mounted) return;
      setItems(data || []);
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
      db.from("skills_categories").select("*").order("sort_order", { ascending: true }),
      db.from("skills_items").select("*").order("sort_order", { ascending: true }),
    ]).then(([categoriesRes, itemsRes]: any[]) => {
      if (!mounted) return;
      setCategories(categoriesRes.data || []);
      setItems(itemsRes.data || []);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { categories, items };
};

export const useSuccessStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>(fallbackStories);

  useEffect(() => {
    let mounted = true;

    db.from("success_stories").select("*").order("id", { ascending: false }).then(({ data }: any) => {
      if (!mounted) return;
      if (data && data.length) setStories(data);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return stories;
};

export const useCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    let mounted = true;

    db.from("certifications").select("*").order("created_at", { ascending: true }).then(({ data }: any) => {
      if (!mounted) return;
      setCertifications(sortByPinned(data || []));
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

    db.from("projects").select("*").order("created_at", { ascending: true }).then(({ data }: any) => {
      if (!mounted) return;
      setProjects(sortByPinned(data || []));
    });

    return () => {
      mounted = false;
    };
  }, []);

  return projects;
};

export const usePortfolioContent = () => {
  const [content, setContent] = useState<PortfolioContent>({});

  useEffect(() => {
    let mounted = true;

    db.from("portfolio_content").select("*").then(({ data }: any) => {
      if (!mounted) return;
      const map: Record<string, string> = {};
      data?.forEach((row: any) => {
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
