-- Contact form inbox (About page + Admin)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'contact_messages' AND policyname = 'Anyone can send a message'
  ) THEN
    CREATE POLICY "Anyone can send a message" ON public.contact_messages
      FOR INSERT TO anon, authenticated
      WITH CHECK (
        length(trim(name)) > 0 AND
        length(trim(email)) > 0 AND
        length(trim(message)) > 0
      );
  END IF;
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
