import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost as BlogPostType } from "@/hooks/useSiteData";
import { sanitizeRichText } from "@/lib/richText";
import { mapBlogPostRow } from "@/lib/supabaseMappers";

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
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        setPost(data ? mapBlogPostRow(data) : null);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

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

          <span className="kicker flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Article
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">{post.title}</h1>
          <p className="mt-3 font-mono text-xs text-muted-foreground flex items-center gap-2">
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
            className="mt-8 prose prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content || post.excerpt || "") }}
          />
        </article>
      </main>
      <FooterSection />
    </div>
  );
};

export default BlogPost;
