import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Post = { id: string; title: string; slug: string; excerpt?: string; cover_url?: string; tags?: string[]; created_at: string };

const BlogSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,cover_url,tags,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { setPosts((data as Post[]) || []); setLoading(false); });
  }, []);

  return (
    <section id="writing" className="section-padding relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="kicker">04 — Writing</span>
          <h2 className="section-heading">
            Notes on <span className="text-gradient">AI & automation</span>.
          </h2>
          <p className="section-sub">Short essays on building with AI, n8n workflows, and shipping product.</p>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/50 bg-card/20 p-10 text-center">
              <PenLine className="w-5 h-5 text-primary/60 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">First post coming soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {posts.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-5 hover:border-primary/40 transition-all"
                >
                  {p.cover_url && (
                    <img src={p.cover_url} alt={p.title} className="rounded-lg mb-4 aspect-video object-cover w-full" />
                  )}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-base leading-snug">{p.title}</h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                  {p.excerpt && <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.excerpt}</p>}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70 font-mono">
                    <span>{new Date(p.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    {p.tags?.slice(0, 2).map(t => <span key={t} className="text-primary/70">#{t}</span>)}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
