import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient">About</span> Me
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />

          <p className="text-lg text-secondary-foreground leading-relaxed mb-8">
            I am an AI & Full Stack Engineer with 3+ years of experience in building intelligent, automated systems. I specialize in bridging the gap between sophisticated AI backends and intuitive user interfaces.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "AI & Data",
                desc: "Expert in Python, RAG, CrewAI, and LangChain, with hands-on experience in Vector DBs like Qdrant, FAISS, and Pinecone.",
              },
              {
                title: "Full Stack",
                desc: "Proficient in designing scalable web architectures using FastAPI (Backend) and React (Frontend).",
              },
              {
                title: "Automation",
                desc: "Skilled in end-to-end workflows using n8n, Supabase, and Azure AI Foundry to drive business impact.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="glass rounded-lg p-6 hover:glow-border transition-all duration-300"
              >
                <h3 className="text-primary font-mono font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
