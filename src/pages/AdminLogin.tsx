import { useNavigate, Link } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import FooterSection from "@/components/FooterSection";
import { Lock, ArrowLeft } from "lucide-react";
import { requireAdminSession } from "@/lib/requireAdminSession";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="glass rounded-2xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-full flex items-start">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to site
              </Link>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground text-center">Use your existing admin account only.</p>
          </div>
          <AuthForm
            onSuccess={async () => {
              if (!(await requireAdminSession())) {
                toast.error("Admin check fail. Supabase → SQL Editor → fix-admin-login.sql run karo.");
                return;
              }
              navigate("/admin");
            }}
          />
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default AdminLogin;
