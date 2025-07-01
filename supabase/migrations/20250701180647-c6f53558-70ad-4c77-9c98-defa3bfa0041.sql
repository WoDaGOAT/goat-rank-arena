
-- Phase 1: Fix Analytics RLS Policies (Critical)
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin only access to analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admin only access to user_sessions" ON public.user_sessions;

-- Create new policies for analytics_events that allow authenticated users to insert their own data
CREATE POLICY "Allow authenticated users to insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  (user_id IS NULL OR user_id = auth.uid())
);

CREATE POLICY "Allow anonymous analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (
  auth.role() = 'anon' AND user_id IS NULL
);

CREATE POLICY "Users can view their own analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (
  user_id IS NULL OR user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage all analytics events" 
ON public.analytics_events 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create new policies for user_sessions
CREATE POLICY "Allow authenticated users to insert user sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  (user_id IS NULL OR user_id = auth.uid())
);

CREATE POLICY "Allow anonymous user sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (
  auth.role() = 'anon' AND user_id IS NULL
);

CREATE POLICY "Allow upsert of user sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (
  user_id IS NULL OR user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (
  user_id IS NULL OR user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can manage all user sessions" 
ON public.user_sessions 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
