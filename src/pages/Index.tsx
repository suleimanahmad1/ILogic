import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EducationSection from "@/components/EducationSection";
import FooterSection from "@/components/FooterSection";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
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
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <TestimonialsSection />
      <EducationSection />
      <FooterSection />
    </div>
  );
};

export default Index;
