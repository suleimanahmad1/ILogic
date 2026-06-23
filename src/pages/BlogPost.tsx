import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, User, Pin } from "lucide-react";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost as BlogPostType } from "@/hooks/useSiteData";
import { sanitizeRichText } from "@/lib/richText";
import { blogPostSelect } from "@/lib/blogAuthor";
import { mapBlogPostRow } from "@/lib/supabaseMappers";
import { richTextToPlain } from "@/lib/richText";
import { blogArticleJsonLd, getSiteOrigin, setPageSeo } from "@/lib/seo";

const formatBlogDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let mounted = true;

    const finish = (data: Parameters<typeof mapBlogPostRow>[0] | null) => {
      if (!mounted) return;
      setPost(data ? mapBlogPostRow(data) : null);
      setLoading(false);
    };

    supabase
      .from("blog_posts")
      .select(blogPostSelect)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (!error) {
          finish(data);
          return;
        }
        if (!/author_name|is_pinned|sort_order|column/i.test(error.message)) {
          finish(null);
          return;
        }
        const fallback = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        finish(fallback.error ? null : fallback.data);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const plain = richTextToPlain(post.excerpt || post.content || "");
    const description = plain.slice(0, 160) || `Article by ${post.author_name || "Suleiman Ahmad"} on Inference Logix.`;
    setPageSeo({
      title: post.title,
      description,
      path: `/blogs/${post.slug}`,
      image: post.cover_url,
      type: "article",
      jsonLd: blogArticleJsonLd(post, description, getSiteOrigin()),
    });
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blogs-dashboard" className="text-primary hover:underline text-sm">
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="section-padding">
        <article className="container mx-auto max-w-3xl">
          <Link
            to="/blogs-dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All blogs
          </Link>

          <span className="kicker flex items-center gap-2 flex-wrap">
            <BookOpen className="w-3.5 h-3.5" /> Article
            {post.is_pinned ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            ) : null}
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">{post.title}</h1>
          {post.author_name ? (
            <p className="mt-3 text-base text-foreground/90 inline-flex items-center gap-2">
              <User className="w-4 h-4 text-primary shrink-0" />
              <span>{post.author_name}</span>
            </p>
          ) : null}
          <p className="mt-2 font-mono text-xs text-muted-foreground inline-flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatBlogDate(post.created_at)}
          </p>

          {post.cover_url ? (
            <div className="mt-8 rounded-2xl border border-border/30 overflow-hidden bg-muted/15">
              <img src={post.cover_url} alt="" className="w-full max-h-[420px] object-cover" />
            </div>
          ) : null}

          {post.tags && post.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/40 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div
            className="mt-8 rich-text-content max-w-none text-muted-foreground leading-relaxed [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-border/30"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content || post.excerpt || "") }}
          />
        </article>
      </main>
      <FooterSection />
    </div>
  );
};

export default BlogPost;
