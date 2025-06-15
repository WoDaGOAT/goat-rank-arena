
-- Create the category_comments table
CREATE TABLE public.category_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.category_comments(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_category_comments_category_id ON public.category_comments(category_id);
CREATE INDEX idx_category_comments_user_id ON public.category_comments(user_id);
CREATE INDEX idx_category_comments_parent_comment_id ON public.category_comments(parent_comment_id);

-- Enable RLS for comments
ALTER TABLE public.category_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access for comments
CREATE POLICY "Allow public read access to comments"
ON public.category_comments
FOR SELECT
USING (true);

-- Policy: Allow users to insert their own comments
CREATE POLICY "Users can insert their own comments"
ON public.category_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
ON public.category_comments
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.category_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Create an enum for notification types
CREATE TYPE public.notification_type AS ENUM ('new_comment_reply', 'new_category');

-- Create the notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add an index on user_id for faster lookups
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Add RLS to the notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (e.g., mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to create notifications for all users about a new category
CREATE OR REPLACE FUNCTION public.handle_new_category_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, data)
  SELECT
    id,
    'new_category',
    jsonb_build_object(
      'category_id', NEW.id,
      'category_name', NEW.name
    )
  FROM auth.users;
  RETURN NEW;
END;
$$;

-- Trigger to call the function after a new category is inserted
CREATE TRIGGER on_new_category_created
AFTER INSERT ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_category_notification();

-- Function to create a notification for a new comment reply
CREATE OR REPLACE FUNCTION public.handle_new_comment_reply_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  parent_comment_author_id UUID;
  replying_user_name TEXT;
  category_name_text TEXT;
BEGIN
  -- Only proceed if it's a reply
  IF NEW.parent_comment_id IS NOT NULL THEN
    -- Get parent comment author
    SELECT user_id INTO parent_comment_author_id
    FROM public.category_comments
    WHERE id = NEW.parent_comment_id;

    -- Get replying user's name from profiles table
    SELECT full_name INTO replying_user_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Get category name
    SELECT name INTO category_name_text
    FROM public.categories
    WHERE id = NEW.category_id;

    -- Create notification for parent comment's author if it's not a self-reply
    IF parent_comment_author_id IS NOT NULL AND parent_comment_author_id != NEW.user_id THEN
      INSERT INTO public.notifications (user_id, type, data)
      VALUES (
        parent_comment_author_id,
        'new_comment_reply',
        jsonb_build_object(
          'category_id', NEW.category_id,
          'category_name', category_name_text,
          'comment_id', NEW.id,
          'parent_comment_id', NEW.parent_comment_id,
          'replying_user_id', NEW.user_id,
          'replying_user_name', COALESCE(replying_user_name, 'Someone')
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to call the function after a new comment is inserted
CREATE TRIGGER on_new_comment_reply
AFTER INSERT ON public.category_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_comment_reply_notification();
