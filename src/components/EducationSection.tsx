import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

const education = [
  { inst: "Institute For Art & Culture", year: "2022–2026", degree: "BS Computer Science" },
  { inst: "Sheikhupura College of Commerce & Technology", year: "2020–2022", degree: "ICS (Intermediate)" },
  { inst: "Government School Sheikhupura", year: "2018–2020", degree: "Matriculation (CS)" },
];

const certs = [
  { name: "Machine Learning", org: "Innovista Lahore", year: "2025" },
  { name: "n8n AI Automation", org: "Analytics Vidhya", year: "2025" },
  { name: "Gemini Certified Student", org: "Google for Education", year: "2025" },
  { name: "Hafiz-e-Quran", org: "Jamia Nizamia Rizvia", year: "2014–2016" },
];

const EducationSection = () => {
  return (
    <section id="education" className="section-padding bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Education & <span className="text-gradient">Certifications</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-10" />

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-mono text-sm text-primary mb-6 tracking-wider uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Education
              </h3>
              <div className="space-y-6 border-l-2 border-border pl-6 relative">
                {education.map((edu, i) => (
                  <motion.div
                    key={edu.inst}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                    <p className="font-mono text-xs text-primary mb-1">{edu.year}</p>
                    <p className="font-semibold text-foreground">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">{edu.inst}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-sm text-primary mb-6 tracking-wider uppercase flex items-center gap-2">
                <Award className="w-4 h-4" /> Certifications
              </h3>
              <div className="space-y-4">
                {certs.map((cert, i) => (
                  <motion.div
                    key={cert.name}
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="glass rounded-lg p-4 hover:glow-border transition-all duration-300"
                  >
                    <p className="font-semibold text-foreground text-sm">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.org} · {cert.year}</p>
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
