
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFeed } from "@/hooks/useFeed";
import FeedItemRenderer from "@/components/feed/FeedItemRenderer";
import { Skeleton } from "@/components/ui/skeleton";

const FeedPreview = () => {
  const navigate = useNavigate();
  const { data: feedItems, isLoading } = useFeed({ limit: 6 });

  return (
    <div className="mt-16">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Recent Activity
          </CardTitle>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
            See what's happening across the WoDaGOAT community - latest rankings, comments, achievements, and more.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full bg-white/10 rounded-lg" />
              ))}
            </div>
          )}
          
          {!isLoading && feedItems && feedItems.length > 0 && (
            <div className="space-y-4">
              {feedItems.slice(0, 4).map(item => (
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
              onClick={() => navigate('/feed')}
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
};

export default FeedPreview;
