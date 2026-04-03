import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import profileImg from "@/assets/profile.png";
import heroBg from "@/assets/hero-bg.jpg";

const HuggingFaceIcon = () => (
  <svg viewBox="0 0 120 120" className="w-4 h-4 text-primary" fill="currentColor">
    <path d="M60 0C26.9 0 0 26.9 0 60s26.9 60 60 60 60-26.9 60-60S93.1 0 60 0zm0 110C32.4 110 10 87.6 10 60S32.4 10 60 10s50 22.4 50 50-22.4 50-50 50z"/>
    <circle cx="40" cy="50" r="6"/>
    <circle cx="80" cy="50" r="6"/>
    <path d="M40 75c0 0 10 15 20 15s20-15 20-15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 md:gap-12">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden glow-border flex-shrink-0"
        >
          <img src={profileImg} alt="Suleiman Ahmed" className="w-full h-full object-cover" />
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              <span className="text-gradient">Suleiman</span>{" "}
              <span className="text-foreground">Ahmed</span>
            </h1>
            <p className="text-xl md:text-2xl font-mono text-muted-foreground">
              Full Stack AI/ML Engineer
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground"
          >
            <a href="mailto:suleiman.inferencelogic@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
              <Mail className="w-4 h-4 text-primary" /> suleiman.inferencelogic@gmail.com
            </a>
            <a href="https://wa.me/923259199419" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
              <Phone className="w-4 h-4 text-primary" /> 0325-9199419
            </a>
            <span className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-primary" /> Lahore, Pakistan
            </span>
            <a href="https://www.linkedin.com/in/suleimanahmad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
              <Linkedin className="w-4 h-4 text-primary" /> LinkedIn
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
              <Github className="w-4 h-4 text-primary" /> GitHub
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#about" className="animate-float inline-block text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
