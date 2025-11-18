-- Make image_url column nullable in testimonials table
ALTER TABLE public.testimonials 
ALTER COLUMN image_url DROP NOT NULL;