
-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;

-- Enable realtime for feed_items table (for real-time feed updates)
ALTER TABLE public.feed_items REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.feed_items;

-- Enable realtime for category_comments table (for real-time comment updates)
ALTER TABLE public.category_comments REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.category_comments;

-- Enable realtime for friendships table (for real-time friendship status updates)
ALTER TABLE public.friendships REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.friendships;
