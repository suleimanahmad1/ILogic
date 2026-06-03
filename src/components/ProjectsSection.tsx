import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github as GithubIcon, Globe, Pin } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import type { Project } from "@/types/site";
import { LIST_INITIAL, LIST_LOAD_STEP } from "@/lib/loadMore";
import { Button } from "@/components/ui/button";
import PortfolioDetailDialog, { type DetailLink } from "@/components/PortfolioDetailDialog";
import { richTextToPlain } from "@/lib/richText";

type MappedProject = Project & {
  title: string;
  image_url: string | null;
  technology: string;
  tech: string;
  github_url: string | null;
  live_url: string | null;
};

const openExternal = (e: React.MouseEvent, url: string) => {
  e.preventDefault();
  e.stopPropagation();
  window.open(url, "_blank", "noopener,noreferrer");
};

const ProjectsSection = () => {
  const projects = useProjects();
  const [visibleCount, setVisibleCount] = useState(LIST_INITIAL);
  const [selected, setSelected] = useState<MappedProject | null>(null);

  const mappedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        title: project.name || "Untitled Project",
        image_url: project.image,
        technology: project.role || "",
        tech: project.role || "",
        github_url: project.github,
        live_url: project.live,
      })),
    [projects]
  );

  const visibleProjects = mappedProjects.slice(0, visibleCount);
  const hasMore = visibleCount < mappedProjects.length;

  const projectLinks = (project: MappedProject): DetailLink[] => {
    const links: DetailLink[] = [];
    if (project.github_url) links.push({ label: "GitHub", href: project.github_url, variant: "github" });
    if (project.live_url) links.push({ label: "Live demo", href: project.live_url, variant: "live" });
    return links;
  };

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="orb w-[450px] h-[450px] bg-accent/8 top-1/3 -left-32" />
      <div className="container mx-auto max-w-6xl relative">
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="kicker">03 — Selected Work</span>
          <h2 className="section-heading">
            <span className="text-gradient">Projects</span> & experiments.
          </h2>
          <p className="section-sub">Click any project to read full details.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProjects.length ? visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                role="button"
                tabIndex={0}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                onClick={() => setSelected(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(project);
                  }
                }}
                className={`group relative rounded-2xl border backdrop-blur-sm overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  project.is_pinned ? "border-primary/40 bg-card/50" : "border-border/40 bg-card/30"
                }`}
              >
                <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
                {project.is_pinned ? (
                  <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono text-primary">
                    <Pin className="w-3 h-3" /> Pinned
                  </span>
                ) : null}
                {project.image_url && (
                  <div className="min-h-[10rem] max-h-56 flex items-center justify-center overflow-hidden bg-muted/20 p-2">
                    <img src={project.image_url} alt={project.title || "Project"} className="max-w-full max-h-52 w-auto object-contain" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] text-primary/60 tracking-widest">#{String(index + 1).padStart(2, "0")}</span>
                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      {project.github_url && (
                        <a href={project.github_url} onClick={(e) => openExternal(e, project.github_url!)} aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} onClick={(e) => openExternal(e, project.live_url!)} aria-label="Live demo" className="text-muted-foreground hover:text-primary transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 text-base group-hover:text-primary transition-colors">{project.title}</h3>
                  {project.technology ? <p className="text-[11px] text-primary/80 mb-2">Technology: {project.technology}</p> : null}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{richTextToPlain(project.description) || "Tap to view details."}</p>
                  <p className="text-[10px] text-primary/60 mt-2 font-mono">Click to read more</p>
                </div>
              </motion.div>
            )) : (
              <p className="text-sm text-muted-foreground">No projects added yet.</p>
            )}
          </div>

          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs px-4 border-border/50 bg-card/30 hover:border-primary/40"
                onClick={() => setVisibleCount((n) => Math.min(n + LIST_LOAD_STEP, mappedProjects.length))}
              >
                Load more ({mappedProjects.length - visibleCount} left)
              </Button>
            </div>
          ) : null}
        </motion.div>
      </div>

      <PortfolioDetailDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        kind="project"
        pinned={!!selected?.is_pinned}
        title={selected?.title || ""}
        subtitle={selected?.technology ? `Technology: ${selected.technology}` : selected?.tech || null}
        imageUrl={selected?.image_url}
        description={selected?.description}
        meta={selected?.tech ? [{ label: "Stack", value: selected.tech }] : []}
        links={selected ? projectLinks(selected) : []}
      />
    </section>
  );
};

export default ProjectsSection;
