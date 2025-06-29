
import FeedItemRenderer from './FeedItemRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeed } from '@/hooks/useFeed';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeedList = () => {
  const { data: feedItems, isLoading, refetch, isFetching } = useFeed();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Activity Feed</h2>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isFetching}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading && Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full bg-white/10 rounded-lg" />
      ))}
      
      {feedItems?.map(item => (
        <FeedItemRenderer key={item.id} item={item} />
      ))}
      
      {feedItems?.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-400">The feed is empty.</p>
          <p className="text-gray-500 text-sm">Start by creating rankings and interacting with the platform to see updates here!</p>
        </div>
      )}
    </div>
  );
};

export default FeedList;
