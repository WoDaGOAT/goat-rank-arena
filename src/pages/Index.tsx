import { Skeleton } from "@/components/ui/skeleton";
import HomepageHeader from "@/components/home/HomepageHeader";
import FeaturedLeaderboard from "@/components/home/FeaturedLeaderboard";
import CategoriesGrid from "@/components/home/CategoriesGrid";
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
          )}
          
          {isError && (
            <div className="text-center text-red-400 text-lg space-y-2">
              <p>Could not load categories. Please try again later.</p>
              <p className="text-sm text-red-300">Check the console for more details.</p>
            </div>
          )}
          
          {!isLoading && !isError && categoriesData && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left side - Featured GOAT Footballer Leaderboard */}
              <FeaturedLeaderboard goatFootballer={categoriesData.goatFootballer} />

              {/* Right side - Other Category Cards */}
              <CategoriesGrid categories={categoriesData.otherCategories} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
