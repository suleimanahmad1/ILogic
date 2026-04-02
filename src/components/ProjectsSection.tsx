import { motion } from "framer-motion";
import { Brain, FileText, BarChart3, Car, Headphones, MessageSquare } from "lucide-react";

const projects = [
  { name: "RAG Applications", icon: Brain, desc: "Retrieval-Augmented Generation systems using LangChain and vector databases" },
  { name: "Resume Parser", icon: FileText, desc: "Intelligent document parsing and information extraction pipeline" },
  { name: "Sentiment Analysis", icon: BarChart3, desc: "NLP-powered sentiment classification and analysis tool" },
  { name: "Road Accident Prediction", icon: Car, desc: "ML model predicting road accidents using historical data" },
  { name: "Customer Support Agent", icon: MessageSquare, desc: "AI-powered conversational agent for automated customer support" },
  { name: "Image Captioning + Voice", icon: Headphones, desc: "Multi-modal AI combining image captioning with voice synthesis" },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-10" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-lg p-6 group hover:glow-border transition-all duration-300"
              >
                <project.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
