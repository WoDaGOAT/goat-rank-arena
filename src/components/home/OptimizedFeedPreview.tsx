
import { memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFeed } from "@/hooks/useFeed";
import FeedItemRenderer from "@/components/feed/FeedItemRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";

const OptimizedFeedPreview = memo(() => {
  const navigate = useNavigate();
  const { data: feedItems, isLoading, refetch, isFetching } = useFeed({ limit: 4 }); // Only show 4 items in preview

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleViewAll = useCallback(() => {
    navigate('/feed');
  }, [navigate]);

  return (
    <div className="mt-16">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Recent Activity
              </CardTitle>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                See what's happening across the WoDaGOAT community - latest rankings, comments, achievements, and more.
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={isFetching}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full bg-white/10 rounded-lg" />
              ))}
            </div>
          )}
          
          {!isLoading && feedItems && feedItems.length > 0 && (
            <div className="space-y-4">
              {feedItems.map(item => (
                <FeedItemRenderer key={item.id} item={item} />
              ))}
            </div>
          )}
          
          {!isLoading && feedItems && feedItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/60 text-lg">No recent activity yet.</p>
              <p className="text-white/40 text-sm mt-2">
                Be the first to create rankings and engage with the community!
              </p>
            </div>
          )}
          
          <div className="text-center pt-6">
            <Button 
              onClick={handleViewAll}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
            >
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

OptimizedFeedPreview.displayName = 'OptimizedFeedPreview';

export default OptimizedFeedPreview;
