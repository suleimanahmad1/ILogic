-- Public storage bucket for portfolio/admin uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read website images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'website-images');

CREATE POLICY "Admin upload website images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'website-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin update website images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'website-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin delete website images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'website-images' AND public.has_role(auth.uid(), 'admin'::app_role));