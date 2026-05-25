import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { useSkillsCatalog } from "@/hooks/useSiteData";

const SkillsSection = () => {
  const { categories, items } = useSkillsCatalog();

  const normalize = (value: string) => value.trim().toLowerCase();
  const dbItemsByCategory = new Map<string, string[]>();

  items.forEach((item) => {
    const category = categories.find((entry) => entry.id === item.category_id);
    if (!category) return;
    const key = normalize(category.name);
    const current = dbItemsByCategory.get(key) || [];
    dbItemsByCategory.set(key, [...current, item.name]);
  });

  return (
    <section id="skills" className="section-padding bg-muted/10 relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-primary/5 -top-20 right-0" />
      <div className="container mx-auto max-w-5xl relative">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="kicker">02 — Tech Stack</span>
          <h2 className="section-heading">
            Tools I <span className="text-gradient">build</span> with.
          </h2>
          <p className="section-sub">All skills are now driven from the database, so anything added in Admin appears here automatically.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.length ? categories.map((category, index) => {
              const dbMatches = dbItemsByCategory.get(normalize(category.name)) || [];
              return (
                <motion.div
                  key={category.id}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <Code2 className="w-4 h-4 text-primary" />
                    <h3 className="font-mono text-xs text-primary tracking-wider uppercase">{category.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dbMatches.length ? dbMatches.map((skill) => (
                      <span key={skill} className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 text-secondary-foreground/80 hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default">
                        {skill}
                      </span>
                    )) : <span className="text-[11px] text-muted-foreground">No skills added yet</span>}
                  </div>
                </motion.div>
              );
            }) : (
              <p className="text-sm text-muted-foreground">No skill categories found yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
