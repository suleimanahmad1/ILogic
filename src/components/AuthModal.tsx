import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { requireAdminSession } from "@/lib/requireAdminSession";
import { toast } from "sonner";

const AuthModal = () => {
  const { authOpen, closeAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="sm:max-w-md glass border-border/40">
        <DialogHeader>
          <DialogTitle className="text-xl">Admin Login</DialogTitle>
          <DialogDescription>
            Sign in with the authorized admin email only. Other accounts cannot access this panel.
          </DialogDescription>
        </DialogHeader>
        <AuthForm
          onSuccess={async () => {
            if (!(await requireAdminSession())) {
              toast.error("Admin check fail. Supabase SQL Editor mein fix-admin-login.sql chalao, phir dubara login.");
              return;
            }
            closeAuth();
            navigate("/admin");
          }}
          onCancel={closeAuth}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
