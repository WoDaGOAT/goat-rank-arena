
-- Add proper RLS policies for category_comments table
DROP POLICY IF EXISTS "Allow public read access" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to insert comments if not banned" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to update their own comments if not banned" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to delete their own comments if not banned" ON public.category_comments;

-- Create new RLS policies with proper authentication checks
CREATE POLICY "Public can read comments" ON public.category_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON public.category_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.category_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.category_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Ensure the table has RLS enabled
ALTER TABLE public.category_comments ENABLE ROW LEVEL SECURITY;
