import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, ExternalLink, Pin } from "lucide-react";
import { useCertifications, useEducationEntries } from "@/hooks/useSiteData";
import { LIST_INITIAL, LIST_LOAD_STEP } from "@/lib/loadMore";
import { Button } from "@/components/ui/button";
import PortfolioDetailDialog, { type DetailLink } from "@/components/PortfolioDetailDialog";
import BlogsSection from "@/components/BlogsSection";
import { richTextToPlain } from "@/lib/richText";

type CertItem = {
  id: string;
  name: string;
  organization: string;
  year: string;
  code: string | null;
  url: string | null;
  description: string | null;
  image_url: string | null | undefined;
  is_pinned?: boolean | null;
};

const openExternal = (e: React.MouseEvent, url: string) => {
  e.preventDefault();
  e.stopPropagation();
  window.open(url, "_blank", "noopener,noreferrer");
};

const EducationSection = () => {
  const education = useEducationEntries();
  const certs = useCertifications();
  const [visibleCertCount, setVisibleCertCount] = useState(LIST_INITIAL);
  const [selectedCert, setSelectedCert] = useState<CertItem | null>(null);

  const formatEducationDate = (startDate: string | null, endDate: string | null, year: string | null) => {
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    if (startDate) return startDate;
    if (endDate) return endDate;
    if (year) return year;
    return "";
  };

  const addedCerts = useMemo(
    () =>
      certs.map((cert) => ({
        id: cert.id,
        name: cert.name,
        organization: "Certification",
        year: "",
        code: cert.code,
        url: cert.url,
        description: cert.description,
        image_url: cert.image,
        is_pinned: cert.is_pinned,
      })),
    [certs]
  );

  const visibleCerts = addedCerts.slice(0, visibleCertCount);
  const hasMoreCerts = visibleCertCount < addedCerts.length;

  const certLinks = (cert: CertItem): DetailLink[] =>
    cert.url ? [{ label: "Verify certificate", href: cert.url, variant: "external" }] : [];

  const certMeta = (cert: CertItem) => {
    const rows: { label: string; value: string }[] = [];
    if (cert.organization) rows.push({ label: "Issuer", value: cert.organization });
    if (cert.code) rows.push({ label: "Credential ID", value: cert.code });
    if (cert.year) rows.push({ label: "Year", value: cert.year });
    return rows;
  };

  return (
    <section id="education" className="section-padding bg-muted/10 relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-primary/5 bottom-0 right-0" />
      <div className="container mx-auto max-w-5xl relative">
        <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="kicker">04 — Education</span>
          <h2 className="section-heading">
            Learning, <span className="text-gradient">always</span>.
          </h2>
          <p className="section-sub">Click a certification to view full details.</p>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-mono text-xs text-primary mb-5 tracking-wider uppercase flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </h3>
              <div className="space-y-5 border-l border-border/60 pl-5 relative">
                {education.length ? education.map((edu, i) => (
                  <motion.div
                    key={edu.id}
                    initial={{ x: -15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    <div className="absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/30 border border-primary" />
                    {edu.image_url ? (
                      <img src={edu.image_url} alt={edu.institute} className="mb-2 h-14 w-14 rounded-lg object-cover border border-border/40" />
                    ) : null}
                    {formatEducationDate(edu.start_date, edu.end_date, edu.year) ? (
                      <p className="font-mono text-[10px] text-primary/80 mb-0.5">{formatEducationDate(edu.start_date, edu.end_date, edu.year)}</p>
                    ) : null}
                    <p className="font-medium text-foreground text-sm">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.institute}</p>
                  </motion.div>
                )) : <p className="text-sm text-muted-foreground">No education entries added yet.</p>}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-xs text-primary mb-5 tracking-wider uppercase flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Certifications
              </h3>
              <div className="space-y-3">
                {visibleCerts.length ? visibleCerts.map((cert, i) => (
                  <motion.div
                    key={cert.id}
                    role="button"
                    tabIndex={0}
                    initial={{ x: 15, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    onClick={() => setSelectedCert(cert)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCert(cert);
                      }
                    }}
                    className={`rounded-lg border backdrop-blur-sm p-3.5 hover:border-primary/30 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                      cert.is_pinned ? "border-primary/40 bg-card/50" : "border-border/40 bg-card/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground text-sm">{cert.name}</p>
                          {cert.is_pinned ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-primary">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{cert.organization}</p>
                        {cert.image_url ? (
                          <img src={cert.image_url} alt={cert.name} className="mt-2 w-full max-h-32 rounded-lg object-contain bg-muted/20" />
                        ) : null}
                        {cert.code ? <p className="text-[11px] text-muted-foreground mt-2 line-clamp-1">Code: {cert.code}</p> : null}
                        {cert.description ? (
                          <p className="text-[11px] text-muted-foreground/80 mt-1 leading-relaxed line-clamp-2">{richTextToPlain(cert.description)}</p>
                        ) : (
                          <p className="text-[10px] text-primary/60 mt-2 font-mono">Click to read more</p>
                        )}
                      </div>

                      {cert.url && (
                        <a
                          href={cert.url}
                          onClick={(e) => openExternal(e, cert.url!)}
                          className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 mt-0.5"
                          aria-label="Open certificate link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )) : <p className="text-sm text-muted-foreground">No certifications added yet.</p>}

                {hasMoreCerts ? (
                  <div className="pt-1 flex justify-center md:justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-4 border-border/50 bg-card/30 hover:border-primary/40"
                      onClick={() => setVisibleCertCount((n) => Math.min(n + LIST_LOAD_STEP, addedCerts.length))}
                    >
                      Load more ({addedCerts.length - visibleCertCount} left)
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <BlogsSection />
        </motion.div>
      </div>

      <PortfolioDetailDialog
        open={!!selectedCert}
        onOpenChange={(open) => !open && setSelectedCert(null)}
        kind="certification"
        pinned={!!selectedCert?.is_pinned}
        title={selectedCert?.name || ""}
        subtitle={selectedCert?.organization || null}
        imageUrl={selectedCert?.image_url}
        description={selectedCert?.description}
        meta={selectedCert ? certMeta(selectedCert) : []}
        links={selectedCert ? certLinks(selectedCert) : []}
      />
    </section>
  );
};

export default EducationSection;
