
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import FeedItemRenderer, { FeedItemType } from './FeedItemRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const FeedList = () => {
  const { data: feedItems, isLoading } = useQuery<FeedItemType[]>({
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

  return (
    <div className="space-y-4">
      {isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full bg-white/10 rounded-lg" />)}
      {feedItems?.map(item => <FeedItemRenderer key={item.id} item={item} />)}
      {feedItems?.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-gray-400">The feed is empty.</p>
            <p className="text-gray-500 text-sm">Start by interacting with the platform to see updates here!</p>
          </div>
      )}
    </div>
  );
};

export default FeedList;
