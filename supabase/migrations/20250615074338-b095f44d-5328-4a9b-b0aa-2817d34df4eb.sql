
-- This migration corrects the foreign key relationships for comments and profiles
-- to enable automatic joins and fix comment posting.

-- On `profiles` table:
-- Link profiles.id to auth.users.id and set up RLS.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'fk_auth_users' AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT fk_auth_users FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to all users" ON public.profiles;
CREATE POLICY "Allow read access to all users" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- On `category_comments` table:
-- Change the user_id foreign key to point to `profiles` table instead of `auth.users`.
-- This is the key change to make comment posting and fetching work correctly.
ALTER TABLE public.category_comments DROP CONSTRAINT IF EXISTS category_comments_user_id_fkey;
ALTER TABLE public.category_comments DROP CONSTRAINT IF EXISTS fk_user;

ALTER TABLE public.category_comments
  ADD CONSTRAINT category_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Note: The RLS policies on category_comments are already correct from a previous migration and do not need changes.
