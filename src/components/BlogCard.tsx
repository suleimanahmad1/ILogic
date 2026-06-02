import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/hooks/useSiteData";
import { richTextToPlain } from "@/lib/richText";

const formatBlogDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

type BlogCardProps = {
  post: BlogPost;
  index?: number;
};

const BlogCard = ({ post, index = 0 }: BlogCardProps) => (
  <motion.article
    initial={{ y: 16, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06, duration: 0.35 }}
  >
    <Link
      to={`/blogs/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/35 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {post.cover_url ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-border/30 bg-muted/15">
          <img
            src={post.cover_url}
            alt=""
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] text-primary/70 tracking-wider uppercase flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {formatBlogDate(post.created_at)}
        </p>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
      <h3 className="mt-2 font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      {post.excerpt ? (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">{richTextToPlain(post.excerpt)}</p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">Read the full article.</p>
      )}
      {post.tags && post.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/40 bg-background/50 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  </motion.article>
);

export default BlogCard;
