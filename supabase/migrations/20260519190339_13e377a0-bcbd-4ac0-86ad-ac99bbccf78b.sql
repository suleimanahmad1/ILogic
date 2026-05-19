CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  icon TEXT DEFAULT 'Code2',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin can manage skills" ON public.skills FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.skills (category, icon, items, sort_order) VALUES
  ('Languages', 'Code2', ARRAY['Python','JavaScript','React','Solidity','C++'], 1),
  ('Frameworks', 'Layers', ARRAY['FastAPI','Streamlit','TensorFlow','Pandas','LangChain','CrewAI'], 2),
  ('Vector DBs', 'Database', ARRAY['Qdrant','Pinecone','FAISS','Supabase'], 3),
  ('Dev Tools', 'Wrench', ARRAY['VS Code','Google AI Studio','WindSurf','Lovable','Hugging Face','Google Colab'], 4),
  ('Cloud', 'Cloud', ARRAY['Microsoft Azure','AWS'], 5);