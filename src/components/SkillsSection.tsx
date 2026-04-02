import { motion } from "framer-motion";

const skills = [
  { category: "Languages", items: ["Python", "JavaScript", "React", "Solidity", "C++"] },
  { category: "Frameworks", items: ["FastAPI", "Streamlit", "TensorFlow", "Pandas", "LangChain", "CrewAI"] },
  { category: "Vector DBs", items: ["Qdrant", "Pinecone", "FAISS", "Supabase"] },
  { category: "Dev Tools", items: ["VS Code", "Google AI Studio", "WindSurf", "Lovable"] },
  { category: "Cloud", items: ["Microsoft Azure", "AWS"] },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-4xl">
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

          <div className="space-y-8">
            {skills.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1, duration: 0.5 }}
              >
                <h3 className="font-mono text-sm text-primary mb-3 tracking-wider uppercase">{group.category}</h3>
                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="glass px-4 py-2 rounded-full text-sm text-secondary-foreground hover:glow-border transition-all duration-300 cursor-default"
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
