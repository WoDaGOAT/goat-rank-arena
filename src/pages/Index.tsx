import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import HomepageHeader from "@/components/home/HomepageHeader";
import FeaturedLeaderboard from "@/components/home/FeaturedLeaderboard";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import LoadMoreCategories from "@/components/home/LoadMoreCategories";
import FeedPreview from "@/components/home/FeedPreview";
import { useHomepageCategories } from "@/hooks/useHomepageCategories";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

const Index = () => {
  const { data: categoriesData, isLoading, isError, error, refetch } = useHomepageCategories();

  // Track homepage visit
  useEffect(() => {
    console.log("🏠 Homepage component mounted");
    analytics.trackPageView('/', 'WoDaGOAT - Greatest Athletes of All Time');
  }, []);

  // Log data state for debugging
  useEffect(() => {
    console.log("📊 Homepage data state:", {
      isLoading,
      isError,
      hasData: !!categoriesData,
      goatFootballerData: categoriesData?.goatFootballer ? 'present' : 'missing',
      otherCategoriesCount: categoriesData?.otherCategories?.length || 0,
      error: error?.message
    });
  }, [categoriesData, isLoading, isError, error]);

  const handleRetry = () => {
    console.log("🔄 User initiated retry");
    refetch();
  };

  return (
    <>
      <HomepageHeader />
      <div
        className="flex flex-col flex-grow"
        style={{ background: "linear-gradient(135deg, rgba(25, 7, 73, 0.6) 0%, rgba(7, 2, 21, 0.6) 100%)" }}
      >
        <div className="container mx-auto px-4 py-12 flex-grow">
          {isLoading && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Loading WoDaGOAT...</h2>
                <p className="text-gray-300">Fetching the greatest athletes of all time</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Featured leaderboard skeleton */}
                <div className="lg:col-span-2">
                  <Skeleton className="h-[600px] w-full rounded-lg bg-white/5" />
                </div>
                {/* Other categories skeleton */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-[420px] w-full rounded-lg bg-white/5" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="flex justify-center">
                <div className="bg-red-500/20 p-4 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Unable to Load Homepage</h2>
                <p className="text-gray-300">
                  We're having trouble loading the homepage content. This might be a temporary issue.
                </p>
                {error?.message && (
                  <details className="mt-4 text-left">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                      Technical Details
                    </summary>
                    <p className="mt-2 text-xs text-red-300 bg-red-900/20 p-3 rounded border">
                      {error.message}
                    </p>
                  </details>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetry}
                  variant="default"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Reload Page
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                If the problem persists, please check your internet connection or try again later.
              </div>
            </div>
          )}
          
          {!isLoading && !isError && categoriesData && (
            <>
              {/* Check if we have any data */}
              {!categoriesData.goatFootballer && categoriesData.otherCategories.length === 0 ? (
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">No Categories Available</h2>
                    <p className="text-gray-300">
                      The category data is currently unavailable. This might indicate a setup issue.
                    </p>
                  </div>
                  <Button
                    onClick={handleRetry}
                    variant="default"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Left side - Featured GOAT Footballer Leaderboard */}
                  {categoriesData.goatFootballer ? (
                    <FeaturedLeaderboard goatFootballer={categoriesData.goatFootballer} />
                  ) : (
                    <div className="lg:col-span-2">
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">GOAT Footballer</h3>
                        <p className="text-gray-300">Coming soon...</p>
                      </div>
                    </div>
                  )}

                  {/* Right side - Other Category Cards */}
                  {categoriesData.otherCategories.length > 0 ? (
                    <CategoriesGrid categories={categoriesData.otherCategories} />
                  ) : (
                    <div className="lg:col-span-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
                          <h3 className="text-lg font-bold text-white mb-2">Categories</h3>
                          <p className="text-gray-300">Loading categories...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Load More Categories Section */}
              <LoadMoreCategories />

              {/* Feed Preview Section */}
              <FeedPreview />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
