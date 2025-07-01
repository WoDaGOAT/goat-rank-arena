
-- Phase 1: Critical RLS Policy Implementation
-- Fix athletes table security - currently allows anyone to modify data
DROP POLICY IF EXISTS "Anyone can view athletes" ON public.athletes;
DROP POLICY IF EXISTS "Authenticated users can delete athletes" ON public.athletes;
DROP POLICY IF EXISTS "Authenticated users can insert athletes" ON public.athletes;
DROP POLICY IF EXISTS "Authenticated users can update athletes" ON public.athletes;

-- Create secure policies for athletes table
CREATE POLICY "Public read access to athletes" 
ON public.athletes 
FOR SELECT 
USING (true);

CREATE POLICY "Admin only write access to athletes" 
ON public.athletes 
FOR ALL 
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Fix categories table security - currently missing write policies
CREATE POLICY "Admin only write access to categories" 
ON public.categories 
FOR ALL 
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Fix quiz tables security
DROP POLICY IF EXISTS "Allow public read access to quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Allow public read access to quiz answers" ON public.quiz_answers;
DROP POLICY IF EXISTS "Allow public read access to quizzes" ON public.quizzes;

-- Quiz questions - authenticated users can read, admins can write
CREATE POLICY "Authenticated users can read quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only write access to quiz questions" 
ON public.quiz_questions 
FOR ALL 
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Quiz answers - authenticated users can read, admins can write
CREATE POLICY "Authenticated users can read quiz answers" 
ON public.quiz_answers 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only write access to quiz answers" 
ON public.quiz_answers 
FOR ALL 
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Quizzes - authenticated users can read, admins can write
CREATE POLICY "Authenticated users can read quizzes" 
ON public.quizzes 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin only write access to quizzes" 
ON public.quizzes 
FOR ALL 
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Phase 2: Admin Authorization Hardening
-- Create secure admin verification function
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id AND role = 'admin'
  );
END;
$$;

-- Create function to get user status safely
CREATE OR REPLACE FUNCTION public.get_user_status(p_user_id uuid)
RETURNS user_status
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_status_result user_status;
BEGIN
  SELECT status INTO user_status_result
  FROM profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(user_status_result, 'active'::user_status);
END;
$$;

-- Fix category_comments policies to use secure functions
DROP POLICY IF EXISTS "Allow users to insert comments if not banned" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to update their own comments if not banned" ON public.category_comments;
DROP POLICY IF EXISTS "Allow users to delete their own comments if not banned" ON public.category_comments;

CREATE POLICY "Allow users to insert comments if not banned" 
ON public.category_comments 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND auth.uid() = user_id 
  AND public.get_user_status(auth.uid()) = 'active'
);

CREATE POLICY "Allow users to update their own comments if not banned" 
ON public.category_comments 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND public.get_user_status(auth.uid()) = 'active'
) 
WITH CHECK (
  auth.uid() = user_id 
  AND public.get_user_status(auth.uid()) = 'active'
);

CREATE POLICY "Allow users to delete their own comments if not banned" 
ON public.category_comments 
FOR DELETE 
USING (
  auth.uid() = user_id 
  AND public.get_user_status(auth.uid()) = 'active'
);

-- Add admin override policies for comment management
CREATE POLICY "Allow admins to manage all comments" 
ON public.category_comments 
FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Phase 3: Fix athlete club and competition security
DROP POLICY IF EXISTS "Authenticated users can delete athlete clubs" ON public.athlete_clubs;
DROP POLICY IF EXISTS "Authenticated users can insert athlete clubs" ON public.athlete_clubs;
DROP POLICY IF EXISTS "Authenticated users can update athlete clubs" ON public.athlete_clubs;

CREATE POLICY "Admin only write access to athlete clubs" 
ON public.athlete_clubs 
FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete athlete competitions" ON public.athlete_competitions;
DROP POLICY IF EXISTS "Authenticated users can insert athlete competitions" ON public.athlete_competitions;
DROP POLICY IF EXISTS "Authenticated users can update athlete competitions" ON public.athlete_competitions;

CREATE POLICY "Admin only write access to athlete competitions" 
ON public.athlete_competitions 
FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Add audit logging for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  table_name text,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admin only access to audit log" 
ON public.admin_audit_log 
FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
