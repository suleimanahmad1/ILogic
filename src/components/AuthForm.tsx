import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
};

const AuthForm = ({ onSuccess, onCancel }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user ?? data.session?.user ?? (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Login successful, but user session was not created.");
      toast.success("Logged in successfully");
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="auth-email">Email</Label>
        <Input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
      </div>

      <div>
        <Label htmlFor="auth-password">Password</Label>
        <Input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Signing in..." : "Login"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
