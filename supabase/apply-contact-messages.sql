-- Run in Supabase Dashboard → SQL Editor (fixes "contact_messages not in schema cache")

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  form_started_at TIMESTAMPTZ,
  submit_nonce TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS form_started_at TIMESTAMPTZ;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS submit_nonce TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS contact_messages_submit_nonce_key
  ON public.contact_messages (submit_nonce)
  WHERE submit_nonce IS NOT NULL;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;
  CREATE POLICY "Anyone can send a message" ON public.contact_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (
      length(trim(name)) > 0 AND
      length(trim(email)) > 0 AND
      length(trim(message)) > 0 AND
      form_started_at IS NOT NULL AND
      form_started_at >= (now() - interval '10 minutes') AND
      form_started_at <= (now() - interval '5 seconds') AND
      submit_nonce IS NOT NULL AND
      length(trim(submit_nonce)) >= 16
    );

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Admin can read messages'
  ) THEN
    CREATE POLICY "Admin can read messages" ON public.contact_messages
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Admin can delete messages'
  ) THEN
    CREATE POLICY "Admin can delete messages" ON public.contact_messages
      FOR DELETE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;
