-- Seed public content so the client can render everything from the database.
-- Idempotent: safe to run multiple times.

-- About background for the dedicated dashboard only
INSERT INTO public.about_bg (image_url)
SELECT 'https://placehold.co/1600x900/png?text=Inference+Logic+About'
WHERE NOT EXISTS (SELECT 1 FROM public.about_bg);

-- Education entries
INSERT INTO public.education (institute, degree, start_date, end_date, year, sort_order)
SELECT * FROM (
  VALUES
    ('Institute For Art & Culture', 'BS Computer Science', '2022', '2026', '2022 - 2026', 1),
    ('Sheikhupura College of Commerce & Technology', 'ICS (Intermediate)', '2020', '2022', '2020 - 2022', 2),
    ('Government School Sheikhupura', 'Matriculation (CS)', '2018', '2020', '2018 - 2020', 3)
) AS seed(institute, degree, start_date, end_date, year, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.education e
  WHERE e.institute = seed.institute
    AND e.degree = seed.degree
    AND e.year = seed.year
);

-- Skills categories
INSERT INTO public.skills_categories (name, sort_order)
SELECT * FROM (
  VALUES
    ('Languages', 1),
    ('Frameworks', 2),
    ('Vector DBs', 3),
    ('Dev Tools', 4),
    ('Cloud', 5)
) AS seed(name, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.skills_categories c WHERE c.name = seed.name
);

-- Skills items
INSERT INTO public.skills_items (category_id, name, sort_order)
SELECT c.id, seed.skill_name, seed.sort_order
FROM public.skills_categories c
JOIN (
  VALUES
    ('Languages', 'Python', 1),
    ('Languages', 'JavaScript', 2),
    ('Languages', 'React', 3),
    ('Languages', 'Solidity', 4),
    ('Languages', 'C++', 5),
    ('Frameworks', 'FastAPI', 1),
    ('Frameworks', 'Streamlit', 2),
    ('Frameworks', 'TensorFlow', 3),
    ('Frameworks', 'Pandas', 4),
    ('Frameworks', 'LangChain', 5),
    ('Frameworks', 'CrewAI', 6),
    ('Vector DBs', 'Qdrant', 1),
    ('Vector DBs', 'Pinecone', 2),
    ('Vector DBs', 'FAISS', 3),
    ('Vector DBs', 'Supabase', 4),
    ('Dev Tools', 'VS Code', 1),
    ('Dev Tools', 'Google AI Studio', 2),
    ('Dev Tools', 'WindSurf', 3),
    ('Dev Tools', 'Lovable', 4),
    ('Dev Tools', 'Hugging Face', 5),
    ('Dev Tools', 'Google Colab', 6),
    ('Cloud', 'Microsoft Azure', 1),
    ('Cloud', 'AWS', 2)
) AS seed(category_name, skill_name, sort_order)
  ON c.name = seed.category_name
WHERE NOT EXISTS (
  SELECT 1 FROM public.skills_items i
  WHERE i.category_id = c.id AND i.name = seed.skill_name
);

-- Projects
INSERT INTO public.projects (
  project_name,
  title,
  technology,
  tech_stack,
  github_url,
  live_url,
  url,
  description,
  image_url,
  sort_order
)
SELECT * FROM (
  VALUES
    ('RAG Applications', 'RAG Applications', 'LangChain, FAISS', ARRAY['LangChain', 'FAISS']::text[], NULL, NULL, NULL, 'Retrieval-Augmented Generation systems using LangChain and vector databases', 'https://placehold.co/1200x800/png?text=RAG+Applications', 1),
    ('Resume Parser', 'Resume Parser', 'Python, NLP', ARRAY['Python', 'NLP']::text[], NULL, NULL, NULL, 'Intelligent document parsing and information extraction pipeline', 'https://placehold.co/1200x800/png?text=Resume+Parser', 2),
    ('Sentiment Analysis', 'Sentiment Analysis', 'TensorFlow, Python', ARRAY['TensorFlow', 'Python']::text[], NULL, NULL, NULL, 'NLP-powered sentiment classification and analysis tool', 'https://placehold.co/1200x800/png?text=Sentiment+Analysis', 3),
    ('Road Accident Prediction', 'Road Accident Prediction', 'Scikit-learn', ARRAY['Scikit-learn']::text[], NULL, NULL, NULL, 'ML model predicting road accidents using historical data', 'https://placehold.co/1200x800/png?text=Road+Accident+Prediction', 4),
    ('Customer Support Agent', 'Customer Support Agent', 'CrewAI, FastAPI', ARRAY['CrewAI', 'FastAPI']::text[], NULL, NULL, NULL, 'AI-powered conversational agent for automated customer support', 'https://placehold.co/1200x800/png?text=Customer+Support+Agent', 5),
    ('Image Captioning + Voice', 'Image Captioning + Voice', 'TensorFlow, gTTS', ARRAY['TensorFlow', 'gTTS']::text[], NULL, NULL, NULL, 'Multi-modal AI combining image captioning with voice synthesis', 'https://placehold.co/1200x800/png?text=Image+Captioning+%2B+Voice', 6)
) AS seed(project_name, title, technology, tech_stack, github_url, live_url, url, description, image_url, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p WHERE COALESCE(p.project_name, p.title) = seed.project_name
);

-- Certifications
INSERT INTO public.certifications (
  course_name,
  name,
  code,
  url,
  description,
  image_url,
  sort_order
)
SELECT * FROM (
  VALUES
    ('Machine Learning', 'Machine Learning', 'ML-001', 'https://example.com', 'Machine learning foundations and practical model-building skills.', 'https://placehold.co/1200x800/png?text=Machine+Learning', 1),
    ('n8n AI Automation', 'n8n AI Automation', 'N8N-002', 'https://example.com', 'Workflow automation with n8n for AI-driven integrations and pipelines.', 'https://placehold.co/1200x800/png?text=n8n+AI+Automation', 2),
    ('Gemini Certified Student', 'Gemini Certified Student', 'GEM-003', 'https://example.com', 'Gemini-focused learning and AI tooling certificate.', 'https://placehold.co/1200x800/png?text=Gemini+Certified+Student', 3),
    ('Hafiz-e-Quran', 'Hafiz-e-Quran', 'QUR-004', 'https://example.com', 'Memorization achievement with discipline and consistency.', 'https://placehold.co/1200x800/png?text=Hafiz-e-Quran', 4)
) AS seed(course_name, name, code, url, description, image_url, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.certifications c WHERE c.course_name = seed.course_name AND c.code = seed.code
);
