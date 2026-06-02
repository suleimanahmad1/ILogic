import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useSiteData";
import { BLOG_INITIAL } from "@/lib/loadMore";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

const BlogsSection = () => {
  const posts = useBlogPosts();
  const preview = posts.slice(0, BLOG_INITIAL);

  return (
    <div id="blogs" className="mt-12 pt-10 border-t border-border/40 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-mono text-xs text-primary mb-2 tracking-wider uppercase flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" /> Blogs
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            Notes on AI, engineering, and building products.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-fit shrink-0 border-border/50">
          <Link to="/blogs-dashboard" className="inline-flex items-center gap-2">
            View all blogs <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {preview.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No blog posts published yet.</p>
      )}

      {posts.length > BLOG_INITIAL ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex justify-center"
        >
          <Button asChild variant="outline" size="sm" className="h-8 text-xs px-4 border-border/50">
            <Link to="/blogs-dashboard">
              More blogs ({posts.length - BLOG_INITIAL} more)
            </Link>
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
};

export default BlogsSection;
