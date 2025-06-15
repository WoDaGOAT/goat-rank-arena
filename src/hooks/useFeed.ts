
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { FeedItemType } from '@/components/feed/FeedItemRenderer';

export const useFeed = () => {
  return useQuery<FeedItemType[]>({
    queryKey: ['feedItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        toast.error('Failed to load the feed.');
        console.error('Error fetching feed items:', error);
        return [];
      }
      return data as FeedItemType[];
    },
  });
};
