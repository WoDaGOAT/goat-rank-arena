
-- Create a new ENUM type for user status
CREATE TYPE public.user_status AS ENUM ('active', 'banned');

-- Add a 'status' column to the 'profiles' table to track if a user is active or banned
ALTER TABLE public.profiles
ADD COLUMN status public.user_status NOT NULL DEFAULT 'active';

-- Create a function for admins to set a user's status (e.g., to 'banned')
CREATE OR REPLACE FUNCTION public.set_user_status(p_user_id uuid, p_status public.user_status)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    UPDATE public.profiles
    SET status = p_status
    WHERE id = p_user_id;
END;
$$;

-- Helper function to safely check a user's status, for use in RLS policies.
CREATE OR REPLACE FUNCTION public.get_user_status(p_user_id uuid)
RETURNS public.user_status
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_status public.user_status;
BEGIN
  SELECT status INTO user_status
  FROM public.profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(user_status, 'active'); -- Default to active if profile not found
END;
$$;

-- Enable Row Level Security on the comments table to enforce bans and ownership
ALTER TABLE public.category_comments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies to the comments table
CREATE POLICY "Allow public read access" ON public.category_comments FOR SELECT USING (true);
CREATE POLICY "Allow users to insert comments if not banned" ON public.category_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.get_user_status(auth.uid()) = 'active');
CREATE POLICY "Allow users to update their own comments if not banned" ON public.category_comments FOR UPDATE USING (auth.uid() = user_id AND public.get_user_status(auth.uid()) = 'active');
CREATE POLICY "Allow users to delete their own comments if not banned" ON public.category_comments FOR DELETE USING (auth.uid() = user_id AND public.get_user_status(auth.uid()) = 'active');

-- Create a function for admins to get all comments for the new management page
CREATE OR REPLACE FUNCTION public.get_all_comments_for_admin()
RETURNS TABLE(
    comment_id uuid,
    comment_text text,
    created_at timestamp with time zone,
    user_id uuid,
    user_full_name text,
    user_avatar_url text,
    user_status public.user_status,
    category_id uuid,
    category_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    RETURN QUERY
    SELECT
        cc.id as comment_id,
        cc.comment as comment_text,
        cc.created_at,
        cc.user_id,
        p.full_name as user_full_name,
        p.avatar_url as user_avatar_url,
        COALESCE(p.status, 'active'::public.user_status) as user_status,
        cc.category_id,
        c.name as category_name
    FROM public.category_comments cc
    LEFT JOIN public.profiles p ON cc.user_id = p.id
    LEFT JOIN public.categories c ON cc.category_id = c.id
    ORDER BY cc.created_at DESC;
END;
$$;

-- Create a function for admins to delete any comment
CREATE OR REPLACE FUNCTION public.delete_comment_as_admin(p_comment_id uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    DELETE FROM public.category_comments WHERE id = p_comment_id;
END;
$$;

