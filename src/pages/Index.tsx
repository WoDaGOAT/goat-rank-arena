
import { Skeleton } from "@/components/ui/skeleton";
import HomepageHeader from "@/components/home/HomepageHeader";
import FeaturedLeaderboard from "@/components/home/FeaturedLeaderboard";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import LoadMoreCategories from "@/components/home/LoadMoreCategories";
import FeedPreview from "@/components/home/FeedPreview";
import { useHomepageCategories } from "@/hooks/useHomepageCategories";

const Index = () => {
  const { data: categoriesData, isLoading, isError } = useHomepageCategories();

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
              {/* Centered leaderboard skeleton */}
              <div className="flex justify-center">
                <Skeleton className="h-[600px] w-full max-w-4xl rounded-lg bg-white/5" />
              </div>
              {/* Categories grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[420px] w-full rounded-lg bg-white/5" />
                ))}
              </div>
            </div>
          )}
          
          {isError && (
            <div className="text-center text-red-400 text-lg space-y-2">
              <p>Could not load categories. Please try again later.</p>
              <p className="text-sm text-red-300">Check the console for more details.</p>
            </div>
          )}
          
          {!isLoading && !isError && categoriesData && (
            <>
              {/* Centered Featured GOAT Footballer Leaderboard */}
              <div className="flex justify-center mb-12">
                <div className="w-full max-w-4xl">
                  <FeaturedLeaderboard goatFootballer={categoriesData.goatFootballer} />
                </div>
              </div>

              {/* Full Width Category Cards Section */}
              <div className="mb-12">
                <CategoriesGrid categories={categoriesData.otherCategories} />
              </div>

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
