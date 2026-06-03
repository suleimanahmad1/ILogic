import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";
import { useContactInfo, usePortfolioContent } from "@/hooks/useSiteData";

const FooterSection = () => {
  const contact = useContactInfo();
  const content = usePortfolioContent();

  return (
    <footer className="py-10 px-6 border-t border-border bg-card/10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">About</h4>
          <p className="text-sm">{content.footer_text || "Suleiman Ahmed — Full Stack & AI Engineer building practical, production-ready systems."}</p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/about-dashboard" className="hover:text-primary">About</Link></li>
            <li><a href="#skills" className="hover:text-primary">Skills</a></li>
            <li><a href="#projects" className="hover:text-primary">Projects</a></li>
            <li><Link to="/blogs-dashboard" className="hover:text-primary">Blogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Contact</h4>
          <p className="text-sm">{contact.email}</p>
          <p className="text-sm mt-1">{contact.phone}</p>
          <p className="text-sm mt-1">{contact.address}</p>
          <div className="flex items-center gap-3 mt-3">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground"><Github className="w-4 h-4" /></a>
            <a href="https://www.linkedin.com/in/suleimanahmad/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      <div className="container mx-auto text-center text-xs text-muted-foreground mt-8">
        <p>© 2026 Suleiman Ahmed. Built with passion for AI & innovation.</p>
      </div>
    </footer>
  );
};

export default FooterSection;
