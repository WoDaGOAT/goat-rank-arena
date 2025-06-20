
-- Add 'moderator' to the app_role enum
ALTER TYPE public.app_role ADD VALUE 'moderator';

-- Create a function to check if a user is a moderator or admin
CREATE OR REPLACE FUNCTION public.is_moderator_or_admin(p_user_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id AND role IN ('admin', 'moderator')
  );
END;
$$;

-- Create a function specifically to check if user is moderator
CREATE OR REPLACE FUNCTION public.is_moderator(p_user_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id AND role = 'moderator'
  );
END;
$$;

-- Update the comment management function to allow moderators
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
    IF NOT is_moderator_or_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin or moderator to perform this action.';
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

-- Update the delete comment function to allow moderators
CREATE OR REPLACE FUNCTION public.delete_comment_as_admin(p_comment_id uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_moderator_or_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin or moderator to perform this action.';
    END IF;

    DELETE FROM public.category_comments WHERE id = p_comment_id;
END;
$$;

-- Create a moderator-specific function to ban/unban users (optional - only if you want moderators to have this power)
CREATE OR REPLACE FUNCTION public.set_user_status_moderator(p_user_id uuid, p_status user_status)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Allow both admins and moderators to ban/unban users
    IF NOT is_moderator_or_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin or moderator to perform this action.';
    END IF;

    -- Prevent moderators from banning admins
    IF is_admin(p_user_id) AND NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: Moderators cannot ban administrators.';
    END IF;

    UPDATE public.profiles
    SET status = p_status
    WHERE id = p_user_id;
END;
$$;
