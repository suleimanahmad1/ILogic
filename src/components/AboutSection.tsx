import { motion } from "framer-motion";

const cards = [
  { title: "AI & Data", desc: "Python, RAG, CrewAI, LangChain — with Vector DBs like Qdrant, FAISS, and Pinecone." },
  { title: "Full Stack", desc: "Scalable web architectures using FastAPI and React with modern tooling." },
  { title: "Automation", desc: "End-to-end workflows using n8n, Supabase, and Azure AI Foundry." },
];

const AboutSection = () => (
  <section id="about" className="section-padding relative">
    <div className="container mx-auto max-w-5xl">
      <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <span className="kicker">01 — About</span>
        <h2 className="section-heading">
          Engineering <span className="text-gradient">intelligent</span> systems.
        </h2>
        <p className="section-sub">
          AI & Full Stack Engineer with 3+ years building intelligent, automated systems — bridging sophisticated AI backends with intuitive interfaces.
        </p>


        <div className="grid md:grid-cols-3 gap-4">
          {cards.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/40 hover:bg-card/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
              <span className="font-mono text-[10px] text-primary/60 tracking-widest">0{i + 1}</span>
              <h3 className="text-foreground font-semibold text-base mt-2 mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  </section>
);

export default AboutSection;
