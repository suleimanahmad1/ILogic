import { ExternalLink, Github, Globe, Pin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sanitizeRichText } from "@/lib/richText";

export type DetailLink = {
  label: string;
  href: string;
  variant?: "github" | "live" | "external";
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  meta?: { label: string; value: string }[];
  links?: DetailLink[];
  kind?: "project" | "certification";
  pinned?: boolean;
};

const LinkIcon = ({ variant }: { variant?: DetailLink["variant"] }) => {
  if (variant === "github") return <Github className="w-4 h-4" />;
  if (variant === "live") return <Globe className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
};

const PortfolioDetailDialog = ({
  open,
  onOpenChange,
  title,
  subtitle,
  imageUrl,
  description,
  meta = [],
  links = [],
  kind = "project",
  pinned = false,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl gap-0 overflow-hidden border-border/40 bg-background/95 p-0 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:rounded-2xl">
      <div className="relative border-b border-border/30 bg-gradient-to-br from-primary/10 via-card/80 to-accent/5 px-6 pt-6 pb-5 pr-14">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary">
            <Sparkles className="w-3 h-3" />
            {kind === "certification" ? "Certification" : "Project"}
          </span>
          {pinned ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono text-primary">
              <Pin className="w-3 h-3" /> Pinned
            </span>
          ) : null}
        </div>
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-2xl font-semibold tracking-tight pr-0">{title}</DialogTitle>
          {subtitle ? (
            <DialogDescription className="text-sm text-primary/90 font-medium">{subtitle}</DialogDescription>
          ) : null}
        </DialogHeader>
      </div>

      <div className="max-h-[min(70vh,520px)] overflow-y-auto px-6 py-5 space-y-5">
        {imageUrl ? (
          <div className="relative rounded-2xl border border-border/30 bg-muted/15 overflow-hidden mx-auto max-w-[320px]">
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-[1] pointer-events-none" />
            <div className={kind === "certification" ? "aspect-square flex items-center justify-center p-4" : "flex items-center justify-center p-4 min-h-[12rem]"}>
              <img
                src={imageUrl}
                alt={title}
                className={cn(
                  "relative z-0 w-full object-contain rounded-lg",
                  kind === "certification" ? "h-full max-h-full" : "max-h-[min(45vh,360px)]"
                )}
              />
            </div>
          </div>
        ) : null}

        {meta.length > 0 ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            {meta.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-border/30 bg-card/40 px-4 py-3 hover:border-primary/25 transition-colors"
              >
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">{row.label}</dt>
                <dd className="text-sm text-foreground mt-1 break-words leading-snug">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="rounded-xl border border-border/25 bg-card/30 px-4 py-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary/70 mb-2">Overview</p>
          {description?.trim() ? (
            <div
              className="rich-text-content text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
            />
          ) : (
            <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed">No description added yet.</p>
          )}
        </div>

        {links.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/20">
            {links.map((link) => (
              <Button
                key={link.href}
                variant="outline"
                size="sm"
                className="rounded-full gap-2 border-border/40 bg-background/50 hover:border-primary/40 hover:bg-primary/5"
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <LinkIcon variant={link.variant} />
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </DialogContent>
  </Dialog>
);

export default PortfolioDetailDialog;
