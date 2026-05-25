import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/adminAuth";

export const requireAdminSession = async (): Promise<boolean> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    return isAdminUser(user.id);
  }
  return isAdminUser(session.user.id);
};
