import { supabase } from "@/integrations/supabase/client";

/** Default owner email — override with VITE_ALLOWED_ADMIN_EMAILS (comma-separated). */
export const DEFAULT_ALLOWED_ADMIN_EMAIL = "suleimanahmed1222@gmail.com";

export const getAllowedAdminEmails = (): string[] => {
  const raw = import.meta.env.VITE_ALLOWED_ADMIN_EMAILS as string | undefined;
  const list = (raw?.trim() ? raw.split(",") : [DEFAULT_ALLOWED_ADMIN_EMAIL])
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(list)];
};

export const isAllowedAdminEmail = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
};

/** Signs out immediately if email is not on the allow list. Returns true when allowed. */
export const signOutIfNotAllowed = async (email: string | undefined | null): Promise<boolean> => {
  if (isAllowedAdminEmail(email)) return true;
  await supabase.auth.signOut();
  return false;
};

export const UNAUTHORIZED_LOGIN_MESSAGE =
  "Only the authorized admin account can sign in. Contact the site owner if you need access.";
