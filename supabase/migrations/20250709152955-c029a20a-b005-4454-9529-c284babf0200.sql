
-- Add batch_year column to team_members table
ALTER TABLE public.team_members 
ADD COLUMN batch_year TEXT NOT NULL DEFAULT '2024-25';

-- Update existing members to be in 2024-25 batch
UPDATE public.team_members 
SET batch_year = '2024-25' 
WHERE batch_year IS NULL OR batch_year = '';

-- Create index for better performance when filtering by batch
CREATE INDEX idx_team_members_batch_year ON public.team_members(batch_year);
