
-- Drop all potentially existing and conflicting policies to ensure a clean slate.
DROP POLICY IF EXISTS "Allow public read access" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to insert comments if not banned" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to update their own comments if not banned" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to delete their own comments if not banned" ON public.category_comments;
-- Cleanup of older/incorrectly named policies from previous attempts
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.category_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.category_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.category_comments;
DROP POLICY IF EXISTS "Allow public read access to comments" ON public.category_comments;

-- Re-create RLS policies with correct checks for banned status
CREATE POLICY "Allow public read access" ON public.category_comments FOR SELECT USING (true);
CREATE POLICY "Allow users to insert comments if not banned" ON public.category_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.get_user_status(auth.uid()) = 'active');
CREATE POLICY "Allow users to update their own comments if not banned" ON public.category_comments FOR UPDATE USING (auth.uid() = user_id AND public.get_user_status(auth.uid()) = 'active') WITH CHECK (public.get_user_status(auth.uid()) = 'active');
CREATE POLICY "Allow users to delete their own comments if not banned" ON public.category_comments FOR DELETE USING (auth.uid() = user_id AND public.get_user_status(auth.uid()) = 'active');
