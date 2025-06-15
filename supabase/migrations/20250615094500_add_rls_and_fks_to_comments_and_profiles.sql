
-- Fix for category_comments table
ALTER TABLE public.category_comments
  ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE;

ALTER TABLE public.category_comments
  ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories (id) ON DELETE CASCADE;

ALTER TABLE public.category_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.category_comments FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert their own comments" ON public.category_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own comments" ON public.category_comments FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own comments" ON public.category_comments FOR DELETE
  USING (auth.uid() = user_id);


-- Fix for profiles table
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_auth_users FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

