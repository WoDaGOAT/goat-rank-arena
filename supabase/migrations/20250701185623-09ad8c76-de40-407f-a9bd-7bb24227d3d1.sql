
-- Fix the foreign key relationship for category_comments to use profiles table
-- First, let's check if we have the correct foreign key constraint
ALTER TABLE public.category_comments DROP CONSTRAINT IF EXISTS category_comments_user_id_fkey;

-- Add the correct foreign key constraint to profiles table
ALTER TABLE public.category_comments 
ADD CONSTRAINT category_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_category_comments_user_id ON public.category_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Fix any other tables that might have similar issues
-- Check ranking_comments
ALTER TABLE public.ranking_comments DROP CONSTRAINT IF EXISTS ranking_comments_user_id_fkey;
ALTER TABLE public.ranking_comments 
ADD CONSTRAINT ranking_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check user_rankings
ALTER TABLE public.user_rankings DROP CONSTRAINT IF EXISTS user_rankings_user_id_fkey;
ALTER TABLE public.user_rankings 
ADD CONSTRAINT user_rankings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check quiz_attempts
ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_user_id_fkey;
ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT quiz_attempts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check user_badges
ALTER TABLE public.user_badges DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey;
ALTER TABLE public.user_badges 
ADD CONSTRAINT user_badges_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check friendships
ALTER TABLE public.friendships DROP CONSTRAINT IF EXISTS friendships_requester_id_fkey;
ALTER TABLE public.friendships DROP CONSTRAINT IF EXISTS friendships_receiver_id_fkey;
ALTER TABLE public.friendships 
ADD CONSTRAINT friendships_requester_id_fkey 
FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.friendships 
ADD CONSTRAINT friendships_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Check notifications
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
