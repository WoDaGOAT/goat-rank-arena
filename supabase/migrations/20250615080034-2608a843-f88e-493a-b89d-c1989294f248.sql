
-- Create an ENUM type for friendship status
CREATE TYPE public.friendship_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');

-- Create the friendships table
CREATE TABLE public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status friendship_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_friendship UNIQUE (requester_id, receiver_id),
    CONSTRAINT check_not_self CHECK (requester_id <> receiver_id)
);

-- Add RLS to the new table
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own friendships (requests sent or received)
CREATE POLICY "Users can see their own friendships"
ON public.friendships
FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Policy: Users can create friend requests
CREATE POLICY "Users can create friend requests"
ON public.friendships
FOR INSERT
WITH CHECK (auth.uid() = requester_id);

-- Policy: Users can update the status of requests they received
CREATE POLICY "Users can update friend requests received"
ON public.friendships
FOR UPDATE
USING (auth.uid() = receiver_id);

-- Policy: Users can delete/cancel their friendships
CREATE POLICY "Users can delete their friendships"
ON public.friendships
FOR DELETE
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Add new notification types to the existing enum
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'new_friend_request';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'friend_request_accepted';

-- Function to handle notifications for new friend requests
CREATE OR REPLACE FUNCTION public.handle_new_friend_request_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  requester_name TEXT;
BEGIN
  -- Get requester's name
  SELECT full_name INTO requester_name
  FROM public.profiles
  WHERE id = NEW.requester_id;
  
  -- Create notification for the receiver
  INSERT INTO public.notifications (user_id, type, data)
  VALUES (
    NEW.receiver_id,
    'new_friend_request',
    jsonb_build_object(
      'requester_id', NEW.requester_id,
      'requester_name', COALESCE(requester_name, 'Someone'),
      'friendship_id', NEW.id
    )
  );

  RETURN NEW;
END;
$function$;

-- Trigger for new friend requests
CREATE TRIGGER on_new_friend_request
  AFTER INSERT ON public.friendships
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE PROCEDURE public.handle_new_friend_request_notification();

-- Function to handle notifications for accepted friend requests
CREATE OR REPLACE FUNCTION public.handle_accepted_friend_request_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  receiver_name TEXT;
BEGIN
  -- Get receiver's (the one who accepted) name
  SELECT full_name INTO receiver_name
  FROM public.profiles
  WHERE id = NEW.receiver_id;
  
  -- Create notification for the original requester
  INSERT INTO public.notifications (user_id, type, data)
  VALUES (
    NEW.requester_id,
    'friend_request_accepted',
    jsonb_build_object(
      'receiver_id', NEW.receiver_id,
      'receiver_name', COALESCE(receiver_name, 'Someone'),
      'friendship_id', NEW.id
    )
  );

  RETURN NEW;
END;
$function$;

-- Trigger for accepted friend requests
CREATE TRIGGER on_accepted_friend_request
  AFTER UPDATE ON public.friendships
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status = 'accepted')
  EXECUTE PROCEDURE public.handle_accepted_friend_request_notification();
