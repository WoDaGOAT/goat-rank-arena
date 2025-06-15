
-- Helper function to check if a user is an admin.
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid)
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
    WHERE user_id = p_user_id AND role = 'admin'
  );
END;
$$;

-- Function to get all users with their profiles and roles, for admin use.
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
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    RETURN QUERY
    SELECT
        u.id as user_id,
        u.email,
        p.full_name,
        p.avatar_url,
        COALESCE(
            (SELECT array_agg(ur.role) FROM user_roles ur WHERE ur.user_id = u.id),
            '{}'::app_role[]
        ) as roles
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    ORDER BY u.created_at DESC;
END;
$$;


-- Function for an admin to delete a user.
CREATE OR REPLACE FUNCTION delete_app_user(p_user_id uuid)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    IF auth.uid() = p_user_id THEN
        RAISE EXCEPTION 'Admins cannot delete their own account.';
    END IF;

    DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;

-- Function for an admin to add a role to a user.
CREATE OR REPLACE FUNCTION add_role_to_user(p_user_id uuid, p_role app_role)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    INSERT INTO user_roles (user_id, role)
    VALUES (p_user_id, p_role)
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Function for an admin to remove a role from a user.
CREATE OR REPLACE FUNCTION remove_role_from_user(p_user_id uuid, p_role app_role)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Forbidden: You must be an admin to perform this action.';
    END IF;

    IF auth.uid() = p_user_id AND p_role = 'admin' THEN
        RAISE EXCEPTION 'Admins cannot remove their own admin role.';
    END IF;

    DELETE FROM user_roles WHERE user_id = p_user_id AND role = p_role;
END;
$$;
