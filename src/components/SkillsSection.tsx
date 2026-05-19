import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Layers, Database, Wrench, Cloud, Sparkles, Cpu, Brain, Zap, Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ICON_MAP: Record<string, any> = { Code2, Layers, Database, Wrench, Cloud, Sparkles, Cpu, Brain, Zap, Box };

const fallback = [
  { id: "1", category: "Languages", icon: "Code2", items: ["Python", "JavaScript", "React", "Solidity", "C++"] },
  { id: "2", category: "Frameworks", icon: "Layers", items: ["FastAPI", "Streamlit", "TensorFlow", "Pandas", "LangChain", "CrewAI"] },
  { id: "3", category: "Vector DBs", icon: "Database", items: ["Qdrant", "Pinecone", "FAISS", "Supabase"] },
  { id: "4", category: "Dev Tools", icon: "Wrench", items: ["VS Code", "Google AI Studio", "WindSurf", "Lovable", "Hugging Face", "Google Colab"] },
  { id: "5", category: "Cloud", icon: "Cloud", items: ["Microsoft Azure", "AWS"] },
];

const SkillsSection = () => {
  const [skills, setSkills] = useState<any[]>(fallback);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("skills").select("*").order("sort_order");
      if (data && data.length > 0) setSkills(data);
    })();
  }, []);

  return (
    <section id="skills" className="section-padding bg-muted/10 relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-primary/5 -top-20 right-0" />
      <div className="container mx-auto max-w-5xl relative">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="kicker">02 — Tech Stack</span>
          <h2 className="section-heading">
            Tools I <span className="text-gradient">build</span> with.
          </h2>
          <p className="section-sub">A curated set of languages, frameworks, and platforms I reach for daily.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((group, gi) => {
              const Icon = ICON_MAP[group.icon] || Code2;
              return (
                <motion.div
                  key={group.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.08, duration: 0.4 }}
                  className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <Icon className="w-4 h-4 text-primary" />
                    <h3 className="font-mono text-xs text-primary tracking-wider uppercase">{group.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items?.map((skill: string) => (
                      <span key={skill} className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 text-secondary-foreground/80 hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
