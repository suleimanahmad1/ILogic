import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import FooterSection from "@/components/FooterSection";
import BlogCard from "@/components/BlogCard";
import { useBlogPosts } from "@/hooks/useSiteData";
import { BLOG_INITIAL, BLOG_LOAD_STEP } from "@/lib/loadMore";
import { Button } from "@/components/ui/button";
import { usePageSeo } from "@/hooks/usePageSeo";

const BlogsDashboard = () => {
  usePageSeo({
    title: "Blog — AI, RAG & Full Stack",
    description:
      "Read Inference Logix articles on AI engineering, RAG pipelines, n8n workflows, React, and shipping production software.",
    path: "/blogs-dashboard",
  });

  const posts = useBlogPosts();
  const [visibleCount, setVisibleCount] = useState(BLOG_INITIAL);
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <Link
            to="/#education"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <span className="kicker flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Blogs
            </span>
            <h1 className="section-heading mt-2">
              All <span className="text-gradient">articles</span>
            </h1>
            <p className="section-sub max-w-2xl">
              Insights on AI, full-stack development, and shipping real products.
            </p>
          </motion.div>

          {visiblePosts.length ? (
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visiblePosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-muted-foreground">No blog posts published yet.</p>
          )}

          {hasMore ? (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs px-5 border-border/50 bg-card/30 hover:border-primary/40"
                onClick={() => setVisibleCount((n) => Math.min(n + BLOG_LOAD_STEP, posts.length))}
              >
                Load more ({posts.length - visibleCount} left)
              </Button>
            </div>
          ) : null}
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default BlogsDashboard;
