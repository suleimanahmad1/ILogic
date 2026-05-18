import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const education = [
  { inst: "Institute For Art & Culture", year: "2022–2026", degree: "BS Computer Science" },
  { inst: "Sheikhupura College of Commerce & Technology", year: "2020–2022", degree: "ICS (Intermediate)" },
  { inst: "Government School Sheikhupura", year: "2018–2020", degree: "Matriculation (CS)" },
];

const fallbackCerts = [
  { id: "1", name: "Machine Learning", organization: "Innovista Lahore", year: "2025", code: null, url: null },
  { id: "2", name: "n8n AI Automation", organization: "Analytics Vidhya", year: "2025", code: null, url: null },
  { id: "3", name: "Gemini Certified Student", organization: "Google for Education", year: "2025", code: null, url: null },
  { id: "4", name: "Hafiz-e-Quran", organization: "Jamia Nizamia Rizvia", year: "2014–2016", code: null, url: null },
];

const openExternal = (e: React.MouseEvent, url: string) => {
  e.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
};

const EducationSection = () => {
  const [certs, setCerts] = useState<any[]>(fallbackCerts);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("certificates").select("*").order("sort_order");
      if (data && data.length > 0) setCerts(data);
    };
    fetch();
  }, []);

  return (
    <section id="education" className="section-padding bg-muted/20">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Education & <span className="text-gradient">Certifications</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary/60 rounded-full mb-10" />

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-mono text-xs text-primary mb-5 tracking-wider uppercase flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </h3>
              <div className="space-y-5 border-l border-border/60 pl-5 relative">
                {education.map((edu, i) => (
                  <motion.div
                    key={edu.inst}
                    initial={{ x: -15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/30 border border-primary" />
                    <p className="font-mono text-[10px] text-primary/80 mb-0.5">{edu.year}</p>
                    <p className="font-medium text-foreground text-sm">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.inst}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs text-primary mb-5 tracking-wider uppercase flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Certifications
              </h3>
              <div className="space-y-3">
                {certs.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm p-3.5 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm">{cert.name}</p>
                        <p className="text-[11px] text-muted-foreground">{cert.organization} · {cert.year}</p>
                        {cert.description && (
                          <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed">{cert.description}</p>
                        )}
                        {cert.code && (
                          <p className="text-[10px] font-mono text-primary/70 mt-1">Code: {cert.code}</p>
                        )}
                      </div>

                      {cert.url && (
                        <a href={cert.url} onClick={(e) => openExternal(e, cert.url)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;
