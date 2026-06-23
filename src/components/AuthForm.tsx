import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAllowedAdminEmail, UNAUTHORIZED_LOGIN_MESSAGE } from "@/lib/allowedAdmin";
import { getSiteOrigin } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/admin/PasswordInput";
import { toast } from "sonner";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
};

const AuthForm = ({ onSuccess, onCancel }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user ?? data.session?.user ?? (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Login successful, but user session was not created.");
      if (!isAllowedAdminEmail(user.email)) {
        await supabase.auth.signOut();
        throw new Error(UNAUTHORIZED_LOGIN_MESSAGE);
      }
      toast.success("Logged in successfully");
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Pehle apna admin email enter karein.");
      return;
    }
    if (!isAllowedAdminEmail(trimmed)) {
      toast.error("Sirf authorized admin email par reset link bheji ja sakti hai.");
      return;
    }

    setResetLoading(true);
    try {
      const origin = getSiteOrigin() || window.location.origin;
      const redirectTo = `${origin}/admin-reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, { redirectTo });
      if (error) throw error;
      toast.success("Password reset email bhej di gayi. Apna inbox check karein.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send reset email";
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="auth-email">Email</Label>
        <Input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="auth-password">Password</Label>
          <button
            type="button"
            onClick={() => void handleForgotPassword()}
            disabled={resetLoading || loading}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            {resetLoading ? "Sending…" : "Forgot password?"}
          </button>
        </div>
        <PasswordInput
          id="auth-password"
          value={password}
          onChange={setPassword}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={loading || resetLoading} className="flex-1">
          {loading ? "Signing in..." : "Login"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading || resetLoading}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
};

export default AuthForm;
