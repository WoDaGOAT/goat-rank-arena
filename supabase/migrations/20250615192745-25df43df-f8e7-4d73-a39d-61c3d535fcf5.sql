
-- Phase 1: User Roles Security
-- Drop old policies if they exist, then create new ones to ensure consistency.
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (is_admin(auth.uid()));

-- The old policy had a period at the end of the name. Drop both possibilities.
DROP POLICY IF EXISTS "Users can view their own roles." ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert new roles" ON public.user_roles;
CREATE POLICY "Admins can insert new roles" ON public.user_roles FOR INSERT WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (is_admin(auth.uid()) AND (auth.uid() != user_id OR role != 'admin'));

DROP POLICY IF EXISTS "Disallow direct updates on roles" ON public.user_roles;
CREATE POLICY "Disallow direct updates on roles" ON public.user_roles FOR UPDATE USING (false);

-- Phase 2: Feed Items Security
-- Enable RLS and add policies for inserting, updating, and deleting feed items.
ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can create feed items" ON public.feed_items;
CREATE POLICY "Authenticated users can create feed items" ON public.feed_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update feed items" ON public.feed_items;
CREATE POLICY "Admins can update feed items" ON public.feed_items FOR UPDATE USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete feed items" ON public.feed_items;
CREATE POLICY "Admins can delete feed items" ON public.feed_items FOR DELETE USING (is_admin(auth.uid()));

-- Phase 3: Notifications Security
-- Drop old policies if they exist, then create/recreate new ones.
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins to insert notifications directly" ON public.notifications;
CREATE POLICY "Allow admins to insert notifications directly" ON public.notifications FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Phase 4: Quiz Attempts Security
-- Enable RLS and add a full set of policies for the quiz_attempts table.
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can update their own quiz attempts" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can delete their own quiz attempts" ON public.quiz_attempts FOR DELETE USING (auth.uid() = user_id);
