
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS description TEXT;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Admin upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'::app_role));
