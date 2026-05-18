import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github as GithubIcon, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const openExternal = (e: React.MouseEvent, url: string) => {
  e.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
};

const fallbackProjects = [
  { id: "1", title: "RAG Applications", description: "Retrieval-Augmented Generation systems using LangChain and vector databases", tech_stack: ["LangChain", "FAISS"], url: null, github_url: null, live_url: null },
  { id: "2", title: "Resume Parser", description: "Intelligent document parsing and information extraction pipeline", tech_stack: ["Python", "NLP"], url: null, github_url: null, live_url: null },
  { id: "3", title: "Sentiment Analysis", description: "NLP-powered sentiment classification and analysis tool", tech_stack: ["TensorFlow", "Python"], url: null, github_url: null, live_url: null },
  { id: "4", title: "Road Accident Prediction", description: "ML model predicting road accidents using historical data", tech_stack: ["Scikit-learn"], url: null, github_url: null, live_url: null },
  { id: "5", title: "Customer Support Agent", description: "AI-powered conversational agent for automated customer support", tech_stack: ["CrewAI", "FastAPI"], url: null, github_url: null, live_url: null },
  { id: "6", title: "Image Captioning + Voice", description: "Multi-modal AI combining image captioning with voice synthesis", tech_stack: ["TensorFlow", "gTTS"], url: null, github_url: null, live_url: null },
];

const ProjectsSection = () => {
  const [projects, setProjects] = useState<any[]>(fallbackProjects);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      if (data && data.length > 0) setProjects(data);
    };
    fetch();
  }, []);

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="orb w-[450px] h-[450px] bg-accent/8 top-1/3 -left-32" />
      <div className="container mx-auto max-w-6xl relative">
        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="kicker">03 — Selected Work</span>
          <h2 className="section-heading">
            <span className="text-gradient">Projects</span> & experiments.
          </h2>
          <p className="section-sub">A glimpse into systems I've shipped — from RAG pipelines to multi-modal AI.</p>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {project.image_url && (
                  <div className="aspect-video overflow-hidden bg-muted/20">
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                <h3 className="font-semibold text-foreground mb-2 text-sm">{project.title}</h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{project.description}</p>

                {project.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack.map((t: string) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {project.github_url && (
                    <a href={project.github_url} onClick={(e) => openExternal(e, project.github_url)} className="text-muted-foreground hover:text-primary transition-colors">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} onClick={(e) => openExternal(e, project.live_url)} className="text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {project.url && !project.live_url && (
                    <a href={project.url} onClick={(e) => openExternal(e, project.url)} className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                </div>
              </motion.div>

            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
