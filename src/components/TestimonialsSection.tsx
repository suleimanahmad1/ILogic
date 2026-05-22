import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type T = { id: string; name: string; role?: string; company?: string; quote: string; avatar_url?: string };

const fallback: T[] = [
  { id: "1", name: "Ali Raza", role: "Product Manager", company: "Stealth Startup", quote: "Shaheer shipped our RAG pipeline in days, not weeks. Sharp engineer with a real eye for product." },
  { id: "2", name: "Sara Khan", role: "CTO", company: "Nimbus AI", quote: "Reliable, fast, and curious. Best n8n + AI automation work I've seen for a lean team." },
  { id: "3", name: "Daniyal M.", role: "Founder", company: "Loop Labs", quote: "From MVP to production in one sprint. Full-stack chops with serious AI depth." },
];

const TestimonialsSection = () => {
  const [items, setItems] = useState<T[]>(fallback);

  useEffect(() => {
    supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length) setItems(data as T[]);
    });
  }, []);

  return (
    <section id="voices" className="section-padding relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="kicker">05 — Voices</span>
          <h2 className="section-heading">
            What people <span className="text-gradient">say</span>.
          </h2>
          <p className="section-sub">A few words from the people I've shipped with.</p>

          <div className="grid md:grid-cols-3 gap-4">
            {items.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/40 transition-all"
              >
                <Quote className="w-5 h-5 text-primary/50 mb-3" />
                <p className="text-sm text-foreground/90 leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {t.role}{t.role && t.company ? " · " : ""}{t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
