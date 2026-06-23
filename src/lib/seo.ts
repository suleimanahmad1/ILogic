export const SITE_NAME = "Inference Logix";
export const SITE_OWNER = "Suleiman Ahmad";
export const DEFAULT_TITLE = "Inference Logix — AI & Full Stack Engineer";
export const DEFAULT_DESCRIPTION =
  "Suleiman Ahmad (Inference Logix) — AI & full-stack engineer. RAG pipelines, n8n automation, MERN apps, and production-ready intelligent systems.";
export const DEFAULT_KEYWORDS =
  "Inference Logix, Suleiman Ahmad, AI engineer, full stack developer, machine learning, RAG, LangChain, n8n automation, MERN stack, React developer, portfolio";

export const getSiteOrigin = (): string => {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv?.trim()) return fromEnv.trim().replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
};

export type PageSeoOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

const upsertJsonLd = (data: Record<string, unknown> | Record<string, unknown>[] | undefined) => {
  const id = "page-jsonld";
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  const script = existing ?? document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
};

const resolveImageUrl = (image: string | null | undefined, origin: string): string => {
  if (!image) return origin ? `${origin}/favicon.png` : "/favicon.png";
  if (/^https?:\/\//i.test(image)) return image;
  return origin ? `${origin}${image.startsWith("/") ? image : `/${image}`}` : image;
};

export const setPageSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = "website",
  noindex = false,
  jsonLd,
}: PageSeoOptions) => {
  const origin = getSiteOrigin();
  const pathname =
    path ?? (typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/");
  const canonical = origin ? `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}` : pathname;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = resolveImageUrl(image, origin);

  document.title = fullTitle;
  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", DEFAULT_KEYWORDS);
  upsertMeta("name", "author", SITE_OWNER);
  upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:image", imageUrl);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", fullTitle);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", imageUrl);
  upsertCanonical(canonical);
  upsertJsonLd(jsonLd);
};

export const homePageJsonLd = (origin: string) => [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: origin || undefined,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Person", name: SITE_OWNER },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_OWNER,
    jobTitle: "AI & Full Stack Engineer",
    url: origin || undefined,
    worksFor: { "@type": "Organization", name: SITE_NAME },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "RAG",
      "LangChain",
      "n8n",
      "React",
      "Node.js",
      "MERN Stack",
      "Full Stack Development",
    ],
  },
];

export const blogArticleJsonLd = (
  post: { title: string; slug: string; excerpt: string | null; content: string | null; cover_url: string | null; author_name: string | null; created_at: string },
  description: string,
  origin: string
) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description,
  image: post.cover_url ? resolveImageUrl(post.cover_url, origin) : undefined,
  datePublished: post.created_at,
  author: { "@type": "Person", name: post.author_name || SITE_OWNER },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: origin ? `${origin}/blogs/${post.slug}` : undefined,
});
