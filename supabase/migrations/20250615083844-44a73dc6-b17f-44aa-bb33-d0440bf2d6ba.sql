
-- Step 1: Create an ENUM for different feed item types.
CREATE TYPE public.feed_item_type AS ENUM (
    'new_user',
    'new_comment',
    'accepted_friendship'
);

-- Step 2: Create the table to store feed items.
CREATE TABLE public.feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    type public.feed_item_type NOT NULL,
    data JSONB NOT NULL
);

-- Step 3: Enable RLS for feed_items table and allow all users to read.
ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read feed items"
ON public.feed_items
FOR SELECT
USING (true);

-- Step 4: Function and Trigger for new users.
CREATE OR REPLACE FUNCTION public.handle_new_user_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_user',
    jsonb_build_object(
      'user_id', NEW.id,
      'user_name', NEW.full_name,
      'avatar_url', NEW.avatar_url
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_user_created_for_feed
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_feed_item();

-- Step 5: Function and Trigger for new comments.
CREATE OR REPLACE FUNCTION public.handle_new_comment_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  author_profile JSON;
  category_name_text TEXT;
BEGIN
  SELECT json_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
  INTO author_profile
  FROM public.profiles
  WHERE id = NEW.user_id;

  SELECT name INTO category_name_text FROM public.categories WHERE id = NEW.category_id;

  INSERT INTO public.feed_items (type, data)
  VALUES (
    'new_comment',
    jsonb_build_object(
      'author', author_profile,
      'comment_id', NEW.id,
      'comment_text', LEFT(NEW.comment, 100), -- Truncate comment to 100 chars
      'category_id', NEW.category_id,
      'category_name', category_name_text
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_comment_for_feed
AFTER INSERT ON public.category_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_comment_feed_item();

-- Step 6: Function and Trigger for accepted friendships.
CREATE OR REPLACE FUNCTION public.handle_accepted_friendship_feed_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  requester_profile JSON;
  receiver_profile JSON;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status <> 'accepted' THEN
    SELECT json_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO requester_profile
    FROM public.profiles WHERE id = NEW.requester_id;

    SELECT json_build_object('id', id, 'full_name', full_name, 'avatar_url', avatar_url)
    INTO receiver_profile
    FROM public.profiles WHERE id = NEW.receiver_id;

    INSERT INTO public.feed_items (type, data)
    VALUES (
      'accepted_friendship',
      jsonb_build_object(
        'requester', requester_profile,
        'receiver', receiver_profile
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_friendship_accepted_for_feed
AFTER UPDATE ON public.friendships
FOR EACH ROW
EXECUTE FUNCTION public.handle_accepted_friendship_feed_item();
