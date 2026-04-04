import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Github as GithubIcon, ChevronDown } from "lucide-react";
import profileImg from "@/assets/profile.png";
import heroBg from "@/assets/hero-bg.jpg";

const openExternal = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
  e.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
};

const contactLinks = [
  { href: "mailto:suleiman.inferencelogic@gmail.com", icon: Mail, label: "suleiman.inferencelogic@gmail.com", external: false },
  { href: "https://wa.me/923259199419", icon: Phone, label: "0325-9199419", external: true },
  { href: "https://www.linkedin.com/in/suleimanahmad/", icon: Linkedin, label: "LinkedIn", external: true },
  { href: "https://github.com/", icon: GithubIcon, label: "GitHub", external: true },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/90 to-background" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-2 ring-primary/30 ring-offset-4 ring-offset-background"
        >
          <img src={profileImg} alt="Suleiman Ahmed" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3">
            <span className="text-gradient">Suleiman</span>{" "}
            <span className="text-foreground">Ahmed</span>
          </h1>
          <p className="text-lg md:text-xl font-mono text-muted-foreground tracking-wide">
            Full Stack AI/ML Engineer
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span>Lahore, Pakistan</span>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 text-sm"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={link.external ? (e) => openExternal(e, link.href) : undefined}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-full border border-border/40 hover:border-primary/40 bg-card/30 backdrop-blur-sm"
            >
              <link.icon className="w-4 h-4 text-primary" />
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#about" className="animate-float inline-block text-primary/60 hover:text-primary transition-colors">
          <ChevronDown className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
