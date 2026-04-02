import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import profileImg from "@/assets/profile.png";
import heroBg from "@/assets/hero-bg.jpg";

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

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden glow-border"
        >
          <img src={profileImg} alt="Suleiman Ahmed" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="text-gradient">Suleiman</span>{" "}
            <span className="text-foreground">Ahmed</span>
          </h1>
          <p className="text-xl md:text-2xl font-mono text-muted-foreground mb-6">
            Full Stack AI/ML Engineer
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
        >
          <a href="mailto:suleimanahmed1222@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
            <Mail className="w-4 h-4 text-primary" /> suleimanahmed1222@gmail.com
          </a>
          <a href="tel:03024522705" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
            <Phone className="w-4 h-4 text-primary" /> 0302-4522705
          </a>
          <span className="flex items-center gap-2 glass px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4 text-primary" /> Lahore, Pakistan
          </span>
          <a href="https://www.linkedin.com/in/suleimanahmad" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors glass px-4 py-2 rounded-full">
            <Linkedin className="w-4 h-4 text-primary" /> LinkedIn
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <a href="#about" className="animate-float inline-block text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
