import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Github as GithubIcon, ChevronDown, Sparkles } from "lucide-react";
import profileImg from "@/assets/profile.png";

const openExternal = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
  e.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
};

const contactLinks = [
  { href: "mailto:suleiman.inferencelogic@gmail.com", icon: Mail, label: "Email", external: false },
  { href: "https://wa.me/923259199419", icon: Phone, label: "WhatsApp", external: true },
  { href: "https://www.linkedin.com/in/suleimanahmad/", icon: Linkedin, label: "LinkedIn", external: true },
  { href: "https://github.com/", icon: GithubIcon, label: "GitHub", external: true },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="orb w-[500px] h-[500px] bg-primary/15 -top-32 -left-32" />
      <div className="orb w-[420px] h-[420px] bg-accent/10 bottom-0 right-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center gap-7 py-24">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary">Available for work</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl -z-10" />
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-1 ring-primary/40 ring-offset-4 ring-offset-background">
            <img src={profileImg} alt="Suleiman Ahmed" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 leading-[0.95]">
            <span className="text-foreground">Suleiman</span>{" "}
            <span className="text-gradient">Ahmed</span>
          </h1>
          <p className="text-base md:text-lg font-mono text-muted-foreground tracking-wide flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Full Stack AI / ML Engineer
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono tracking-wide">Lahore, Pakistan</span>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={link.external ? (e) => openExternal(e, link.href) : undefined}
              aria-label={link.label}
              className="group flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-all px-3.5 py-2 rounded-full border border-border/50 hover:border-primary/50 bg-card/40 backdrop-blur-sm hover:bg-primary/5"
            >
              <link.icon className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{link.label}</span>
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
          <ChevronDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
