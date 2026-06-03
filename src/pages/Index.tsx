import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { DEFAULT_DESCRIPTION, getSiteOrigin, homePageJsonLd, setPageSeo } from "@/lib/seo";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    setPageSeo({
      title: "AI & Full Stack Engineer Portfolio",
      description: DEFAULT_DESCRIPTION,
      path: "/",
      jsonLd: homePageJsonLd(getSiteOrigin()),
    });
  }, []);

  useEffect(() => {
    // Log a page view (best-effort, ignore errors)
    if (sessionStorage.getItem("pv_logged")) return;
    sessionStorage.setItem("pv_logged", "1");
    supabase.from("page_views").insert({
      path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).then(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <h1 className="sr-only">InferenceLogic — Suleiman Ahmad, AI and Full Stack Engineer</h1>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <FooterSection />
    </div>
  );
};

export default Index;
