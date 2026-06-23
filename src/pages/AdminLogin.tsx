import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { Lock } from "lucide-react";
import { requireAdminSession } from "@/lib/requireAdminSession";
import { toast } from "sonner";
import { usePageSeo } from "@/hooks/usePageSeo";

const AdminLogin = () => {
  usePageSeo({ title: "Admin Login", description: "Private admin login.", noindex: true });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b12] text-foreground flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/20 bg-background/40 backdrop-blur-md">
        <div className="container mx-auto max-w-lg px-4 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to website
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center ring-1 ring-primary/25">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Admin access</h1>
              <p className="text-sm text-muted-foreground mt-1">Inference Logix content manager — authorized accounts only.</p>
            </div>
          </div>
          <AuthForm
            onSuccess={async () => {
              if (!(await requireAdminSession())) {
                toast.error("Admin check fail. Supabase SQL Editor mein fix-admin-login.sql chalao.");
                return;
              }
              navigate("/admin");
            }}
          />
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-[11px] text-muted-foreground font-mono">
        Secure admin area · not indexed
      </footer>
    </div>
  );
};

export default AdminLogin;
