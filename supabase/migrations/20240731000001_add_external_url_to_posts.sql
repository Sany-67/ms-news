-- Add external_url column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Update the realtime publication if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'posts'
  ) THEN
    alter publication supabase_realtime add table posts;
  END IF;
END
$$;