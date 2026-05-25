import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/adminAuth";
import { signOutIfNotAllowed } from "@/lib/allowedAdmin";

export const requireAdminSession = async (): Promise<boolean> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const user =
    session?.user ?? (sessionError ? null : (await supabase.auth.getUser()).data.user);
  if (!user) return false;
  if (!(await signOutIfNotAllowed(user.email))) return false;
  return isAdminUser(user.id);
};
