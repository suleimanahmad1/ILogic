import { supabase } from "@/integrations/supabase/client";
import { isAllowedAdminEmail } from "@/lib/allowedAdmin";

export const isAdminUser = async (userId: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  let email: string | undefined;
  if (!session?.user) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) return false;
    email = user.email;
  } else if (session.user.id !== userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) return false;
    email = user.email;
  } else {
    email = session.user.email;
  }

  if (!isAllowedAdminEmail(email)) return false;

  const { data: amAdmin, error: amAdminError } = await supabase.rpc("am_i_admin");
  if (!amAdminError && amAdmin === true) return true;
  if (!amAdminError && amAdmin === false) return false;

  const { data: viaRpc, error: rpcError } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (!rpcError && viaRpc === true) return true;
  if (!rpcError && viaRpc === false) return false;

  const { data: row, error: selectError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (selectError) {
    console.warn("isAdminUser:", amAdminError?.message ?? rpcError?.message ?? selectError.message);
    return false;
  }

  return row?.role === "admin";
};
