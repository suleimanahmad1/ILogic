import { motion } from "framer-motion";
import { Brain, FileText, BarChart3, Car, Headphones, MessageSquare, ExternalLink } from "lucide-react";

const projects = [
  { name: "RAG Applications", icon: Brain, desc: "Retrieval-Augmented Generation systems using LangChain and vector databases", url: "" },
  { name: "Resume Parser", icon: FileText, desc: "Intelligent document parsing and information extraction pipeline", url: "" },
  { name: "Sentiment Analysis", icon: BarChart3, desc: "NLP-powered sentiment classification and analysis tool", url: "" },
  { name: "Road Accident Prediction", icon: Car, desc: "ML model predicting road accidents using historical data", url: "" },
  { name: "Customer Support Agent", icon: MessageSquare, desc: "AI-powered conversational agent for automated customer support", url: "" },
  { name: "Image Captioning + Voice", icon: Headphones, desc: "Multi-modal AI combining image captioning with voice synthesis", url: "" },
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
            {projects.map((project, i) => {
              const CardContent = (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <project.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    {project.url && (
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
                </>
              );

              return (
                <motion.div
                  key={project.name}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass rounded-lg p-6 group hover:glow-border transition-all duration-300 block h-full"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div className="glass rounded-lg p-6 group hover:glow-border transition-all duration-300 h-full">
                      {CardContent}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
