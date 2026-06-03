import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import FooterSection from "@/components/FooterSection";
import { ArrowLeft, Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useContactInfo, usePortfolioContent } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sanitizeRichText } from "@/lib/richText";
import { usePageSeo } from "@/hooks/usePageSeo";

const INQUIRY_TYPES = ["General inquiry", "AI & ML project", "Full-stack / MERN", "Automation & integrations"];
const MIN_SUBMIT_MS = 5_000;
const MAX_SUBMIT_MS = 10 * 60 * 1_000;

const createSubmitNonce = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
};

const AboutDashboard = () => {
  usePageSeo({
    title: "About & Contact",
    description:
      "Contact Suleiman Ahmad at InferenceLogic for AI, ML, MERN, and n8n automation projects. Get in touch for consulting and engineering work.",
    path: "/about-dashboard",
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", service: INQUIRY_TYPES[0], description: "" });
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [submitNonce, setSubmitNonce] = useState(() => createSubmitNonce());
  const contact = useContactInfo();
  const contentFromDb = usePortfolioContent();
  const aboutHtml = contentFromDb.about_text?.trim();
  const showAboutBody = aboutHtml && !/^<p>\s*no about content/i.test(aboutHtml);

  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.description.trim()) e.description = "Briefly describe your request";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    const elapsedMs = Date.now() - formStartedAt;
    if (elapsedMs < MIN_SUBMIT_MS || elapsedMs > MAX_SUBMIT_MS) {
      toast.error("Please try again.");
      return;
    }

    const message = `phone:${form.phone} | service:${form.service} | description:${form.description}`;
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        message,
        form_started_at: new Date(formStartedAt).toISOString(),
        submit_nonce: submitNonce,
      });
      if (error) throw error;
      setForm({ name: "", phone: "", email: "", service: INQUIRY_TYPES[0], description: "" });
      setFormStartedAt(Date.now());
      setSubmitNonce(createSubmitNonce());
      setErrors({});
      toast.success("Message sent — thank you! We'll be in touch soon.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (/contact_messages/i.test(msg) && /schema cache|does not exist|not find/i.test(msg)) {
        toast.error(
          "Contact form database table is missing. In Supabase → SQL Editor, run the file supabase/apply-contact-messages.sql, then try again."
        );
      } else {
        toast.error(msg || "Failed to submit message");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
          </div>

          <section className="mb-10">
            <div className="rounded-3xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8 mb-8 shadow-lg shadow-black/5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl" />
                  <BrandLogo href={null} showName={false} className="relative" imageClassName="h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-primary/30" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 text-primary text-xs uppercase tracking-[0.28em]">
                    <Sparkles className="w-3.5 h-3.5" /> About
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-1">Inference Logic</h2>
                  <p className="text-sm text-muted-foreground">AI · MERN · Automation for modern teams</p>
                </div>
              </div>
              <h3 className="sr-only">About Inference Logic</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                Inference Logic builds polished AI, automation, and full-stack experiences for modern businesses.
                We focus on practical systems that feel premium, load fast, and turn ideas into reliable products.
              </p>
              {showAboutBody ? (
                <div
                  className="prose prose-invert max-w-none text-sm text-muted-foreground max-w-3xl mt-4"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(aboutHtml) }}
                />
              ) : null}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">01</p>
                <h3 className="font-semibold mb-2">AI solutions</h3>
                <p className="text-sm text-muted-foreground">RAG, automation, and AI assistants designed for production, not just demos.</p>
              </div>
              <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">02</p>
                <h3 className="font-semibold mb-2">Full-stack delivery</h3>
                <p className="text-sm text-muted-foreground">Clean interfaces, dependable APIs, and database-driven workflows with strong UX.</p>
              </div>
              <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">03</p>
                <h3 className="font-semibold mb-2">Business focus</h3>
                <p className="text-sm text-muted-foreground">We shape every build around clarity, conversion, and long-term maintainability.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-semibold mb-3">Get in touch</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <aside className="rounded-xl p-6 bg-gradient-to-br from-primary/6 to-primary/3 border border-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Contact</h4>
                    <p className="text-sm text-muted-foreground">Reach out for project inquiries, collaborations, or just to say hi.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">{contact.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-sm text-primary hover:underline">{contact.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(contact.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {contact.address}
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Responses typically within 24–48 hours. Your message is private and never shared.</p>
              </aside>

              <div className="rounded-xl p-6 bg-card/60 border border-border/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <Input placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Input
                      placeholder="Email address"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <select
                      className="w-full rounded-md border border-border/40 px-3 py-2 bg-background text-sm"
                      value={form.service}
                      onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                    >
                      {INQUIRY_TYPES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Textarea
                      placeholder="Short description of your project or question"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="submit" className="inline-flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send message
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setForm({ name: "", phone: "", email: "", service: INQUIRY_TYPES[0], description: "" });
                        setFormStartedAt(Date.now());
                        setSubmitNonce(createSubmitNonce());
                        setErrors({});
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default AboutDashboard;
