import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isAllowedAdminEmail } from "@/lib/allowedAdmin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/admin/PasswordInput";
import { usePageSeo } from "@/hooks/usePageSeo";

const AdminResetPassword = () => {
  usePageSeo({ title: "Reset Admin Password", description: "Set a new admin password.", noindex: true });

  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async (email: string | undefined) => {
      if (!mounted) return;
      setAllowed(isAllowedAdminEmail(email));
      setReady(true);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session?.user) {
        void check(session?.user?.email);
      }
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) void check(session.user.email);
      else if (mounted) {
        setAllowed(false);
        setReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password kam az kam 6 characters ka ho.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords match nahi kar rahe.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password update ho gaya. Ab login karein.");
      await supabase.auth.signOut();
      navigate("/admin-login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Password update fail");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b12] text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-foreground flex flex-col">
      <header className="relative z-10 border-b border-border/20 bg-background/40 backdrop-blur-md">
        <div className="container mx-auto max-w-lg px-4 py-4 flex justify-end">
          <Link to="/admin-login" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
            ← Back to login
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-8 shadow-2xl shadow-black/30">
          {!allowed ? (
            <div className="text-center space-y-4">
              <h1 className="text-xl font-semibold">Reset link invalid or expired</h1>
              <p className="text-sm text-muted-foreground">
                Email se naya reset link mangen ya admin login par wapas jayen.
              </p>
              <Button asChild className="w-full">
                <Link to="/admin-login">Go to admin login</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center ring-1 ring-primary/25">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">New password</h1>
                  <p className="text-sm text-muted-foreground mt-1">Apna naya admin password set karein.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New password</Label>
                  <PasswordInput
                    id="new-password"
                    value={password}
                    onChange={setPassword}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <PasswordInput
                    id="confirm-password"
                    value={confirm}
                    onChange={setConfirm}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving…" : "Update password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminResetPassword;
