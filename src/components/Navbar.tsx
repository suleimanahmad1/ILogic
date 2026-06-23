import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Shield } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/adminAuth";
import BrandLogo from "@/components/BrandLogo";

const links = [
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "About", href: "/about-dashboard", id: "about", route: true },
  { label: "Education", href: "#education", id: "education" },
  { label: "Blogs", href: "/blogs-dashboard", id: "blogs", route: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const openAdmin = async () => {
    if (!user) {
      navigate("/admin-login");
      return;
    }
    if (!(await isAdminUser(user.id))) {
      toast.error("Admin verify fail. Supabase par fix-admin-login.sql chalao.");
      return;
    }
    navigate("/admin");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "py-5"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <BrandLogo href="/" showName />

        <div className="hidden md:flex items-center gap-4">
          {links.map((l) =>
            l.id === "about" || (l as { route?: boolean }).route ? (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm font-mono transition-colors relative ${active === l.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {l.label}
                {active === l.id && <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-primary" />}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-mono transition-colors relative ${
                  active === l.id ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {l.label}
                {active === l.id && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-primary" />
                )}
              </a>
            )
          )}

          <button
            onClick={() => void openAdmin()}
            className="inline-flex items-center justify-center rounded-full border border-border/40 p-1.5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Safeguard"
            title="Safeguard"
          >
            <Shield className="w-3 h-3" />
          </button>

          <button
            onClick={toggle}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggle} className="text-foreground" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => void openAdmin()}
            className="inline-flex items-center justify-center rounded-full border border-border/40 p-1.5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Safeguard"
            title="Safeguard"
          >
            <Shield className="w-3 h-3" />
          </button>
          <button className="text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass mt-2 mx-6 rounded-lg p-4 flex flex-col gap-4">
          {links.map((l) =>
            l.id === "about" || (l as { route?: boolean }).route ? (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-mono transition-colors ${active === l.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-mono transition-colors ${active === l.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {l.label}
              </a>
            )
          )}
          <button
            onClick={() => {
              setMenuOpen(false);
              if (user) void openAdmin();
              else navigate("/admin-login");
            }}
            className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors text-left inline-flex items-center gap-2"
          >
            <Shield className="w-3.5 h-3.5" /> Safeguard
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
