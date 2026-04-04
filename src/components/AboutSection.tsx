import { motion } from "framer-motion";

const cards = [
  { title: "AI & Data", desc: "Python, RAG, CrewAI, LangChain — with Vector DBs like Qdrant, FAISS, and Pinecone." },
  { title: "Full Stack", desc: "Scalable web architectures using FastAPI and React with modern tooling." },
  { title: "Automation", desc: "End-to-end workflows using n8n, Supabase, and Azure AI Foundry." },
];

const AboutSection = () => (
  <section id="about" className="section-padding">
    <div className="container mx-auto max-w-4xl">
      <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient">About</span> Me
        </h2>
        <div className="w-12 h-0.5 bg-primary/60 rounded-full mb-8" />

        <p className="text-base text-secondary-foreground/80 leading-relaxed mb-10 max-w-2xl">
          AI & Full Stack Engineer with 3+ years of experience building intelligent, automated systems — bridging sophisticated AI backends with intuitive interfaces.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all duration-300"
            >
              <h3 className="text-primary font-mono font-medium text-sm mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
