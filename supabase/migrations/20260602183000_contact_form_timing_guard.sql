-- Contact form anti-spam (captcha-free): enforce submit timing window + nonce.
-- Valid window: at least 5 seconds after form start, within 10 minutes.

ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS form_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS submit_nonce TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS contact_messages_submit_nonce_key
  ON public.contact_messages (submit_nonce)
  WHERE submit_nonce IS NOT NULL;

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
