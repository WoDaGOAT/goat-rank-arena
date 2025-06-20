
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { FeedItemType } from '@/components/feed/FeedItemRenderer';
import { useEffect } from 'react';

export const useFeed = () => {
  const queryClient = useQueryClient();

  const feedQuery = useQuery<FeedItemType[]>({
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

  // Enhanced realtime listener for feed items
  useEffect(() => {
    console.log('useFeed: Setting up realtime listener for feed items');

    const channel = supabase
      .channel('feed_items_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feed_items',
        },
        (payload) => {
          console.log('useFeed: New feed item received:', payload);
          queryClient.invalidateQueries({ queryKey: ['feedItems'] });
        }
      )
      .subscribe((status) => {
        console.log('useFeed: Feed realtime subscription status:', status);
      });

    return () => {
      console.log('useFeed: Cleaning up feed realtime listener');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return feedQuery;
};
