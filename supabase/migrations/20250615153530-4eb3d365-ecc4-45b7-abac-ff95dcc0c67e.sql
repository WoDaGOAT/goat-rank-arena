
-- Function to get all users with their profiles and roles, for admin use.
-- This version handles potential NULLs in profile data and ensures correct type casting.
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE(
    user_id uuid,
    email text,
    full_name text,
    avatar_url text,
    roles app_role[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Ensure only admins can call this function
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    -- Return the list of users with their associated data
    RETURN QUERY
    SELECT
        u.id as user_id,
        u.email::text, -- Explicitly cast email from varchar to text to match return type
        COALESCE(p.full_name, 'N/A'), -- Provide a default value if full_name is null
        COALESCE(p.avatar_url, ''),   -- Provide a default value if avatar_url is null
        COALESCE(
            (SELECT array_agg(ur.role) FROM user_roles ur WHERE ur.user_id = u.id),
            '{}'::app_role[]
        ) as roles
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    ORDER BY u.created_at DESC;
END;
$$;
