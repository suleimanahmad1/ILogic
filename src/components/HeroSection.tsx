import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import { usePortfolioContent } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";

const DEFAULT_INTRO = [
  "Stuck with manual work, slow apps, or AI ideas that never reach production? I turn that into shipped MERN products and real AI features — fast.",
  "From smart chatbots & RAG search to dashboards, APIs, and automation — built to scale, easy to maintain, and ready for your users.",
  "Less guesswork, faster delivery, clearer ROI — Lahore-based, remote-friendly. Let's build what your business actually needs.",
];

const HeroSection = () => {
  const content = usePortfolioContent();
  const profileSource = content.profile_image || profileImg;
  const subtitle = content.hero_subtitle || "Full Stack AI / ML Engineer";

  const introLines = content.hero_intro
    ? content.hero_intro.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 3)
    : DEFAULT_INTRO;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="orb w-[500px] h-[500px] bg-primary/15 -top-32 -left-32" />
      <div className="orb w-[420px] h-[420px] bg-accent/10 bottom-0 right-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-24 max-w-6xl w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* Left — content */}
          <motion.div
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 backdrop-blur-sm mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary/90">Open to opportunities</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-foreground leading-[1.1] mb-2">
              Suleiman{" "}
              <span className="text-gradient">Ahmed</span>
            </h1>

            <p className="text-sm md:text-base text-muted-foreground font-medium mb-4 tracking-wide">
              Founder of <span className="text-primary/90">InferenceLogic</span>
            </p>

            <p className="text-base md:text-lg text-primary/90 font-medium mb-6 flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              {subtitle}
            </p>

            <div className="relative pl-0 lg:pl-5 lg:border-l-2 lg:border-primary/30 space-y-3 mb-8 max-w-xl mx-auto lg:mx-0 text-left">
              {introLines.map((line, i) => (
                <p
                  key={i}
                  className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Button asChild size="sm" className="rounded-full px-5 gap-2">
                <a href="#projects">
                  View projects <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full px-5 border-border/50 bg-card/40">
                <a href="/about-dashboard">Get in touch</a>
              </Button>
            </div>
          </motion.div>

          {/* Right — profile */}
          <motion.div
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]">
              <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/20 blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-card/20 p-2.5 shadow-2xl shadow-black/20 backdrop-blur-md">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted/20">
                  <img
                    src={profileSource}
                    alt="Suleiman Ahmed — Founder of InferenceLogic"
                    className="h-full w-full object-cover scale-[1.12] object-[50%_38%] antialiased"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_92%_90%_at_50%_40%,transparent_58%,hsl(var(--background)/0.15)_72%,hsl(var(--background)/0.55)_100%)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_28px_14px_hsl(var(--background)/0.35)]"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-background/80 via-background/15 to-transparent"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.08]"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#about" className="animate-float inline-block text-primary/60 hover:text-primary transition-colors" aria-label="Scroll to about">
          <ChevronDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
