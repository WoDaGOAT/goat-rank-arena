
import FeedItemRenderer from './FeedItemRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeed } from '@/hooks/useFeed';

const FeedList = () => {
  const { data: feedItems, isLoading } = useFeed();

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
