import { motion } from "framer-motion";
import { Code2, Layers, Database, Wrench, Cloud } from "lucide-react";

const skills = [
  { category: "Languages", icon: Code2, items: ["Python", "JavaScript", "React", "Solidity", "C++"] },
  { category: "Frameworks", icon: Layers, items: ["FastAPI", "Streamlit", "TensorFlow", "Pandas", "LangChain", "CrewAI"] },
  { category: "Vector DBs", icon: Database, items: ["Qdrant", "Pinecone", "FAISS", "Supabase"] },
  { category: "Dev Tools", icon: Wrench, items: ["VS Code", "Google AI Studio", "WindSurf", "Lovable"] },
  { category: "Cloud", icon: Cloud, items: ["Microsoft Azure", "AWS"] },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 hover:glow-border transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <group.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-mono text-sm text-primary tracking-wider uppercase">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="bg-muted/50 border border-border/50 px-3 py-1.5 rounded-lg text-sm text-secondary-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
