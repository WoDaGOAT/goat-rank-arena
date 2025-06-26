
import React from "react";
import { useParams, Link } from "react-router-dom";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, TrendingUp, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialActions } from "@/components/category/SocialActions";
import CommentSection from "@/components/category/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { useAthletes } from "@/hooks/useAthletes";
import { mapDatabaseAthletesToUIAthletes } from "@/utils/athleteDataMapper";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";
import { Helmet } from "react-helmet-async";

type DbCategory = {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  
  // Check if user has existing ranking for this category
  const { data: userRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(categoryId);
  
  // Fetch category data from Supabase
  const { data: dbCategory, isLoading: isLoadingCategory } = useQuery<DbCategory | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId || "")
        .single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
    enabled: !!categoryId,
  });

  // Fetch submitted rankings count for this category
  const { data: submittedRankingsCount, isLoading: isLoadingRankingsCount } = useQuery({
    queryKey: ['categoryRankingsCount', categoryId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_rankings')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId || "");
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    },
    enabled: !!categoryId,
  });

  // Fetch real athletes from the database
  const { data: dbAthletes, isLoading: isLoadingAthletes } = useAthletes();

  // Transform athletes into leaderboard format with mock ranking data
  const leaderboardAthletes = dbAthletes ? mapDatabaseAthletesToUIAthletes(dbAthletes).map((athlete, index) => ({
    ...athlete,
    rank: index + 1,
    points: Math.max(1000 - (index * 50) + Math.random() * 100, 100), // Mock points with some randomization
    movement: index % 3 === 0 ? "up" as const : index % 3 === 1 ? "down" as const : "neutral" as const,
    imageUrl: athlete.imageUrl // This will now use the real profile_picture_url from the database
  })).sort((a, b) => b.points - a.points) : [];

  const isLoading = isLoadingCategory || isLoadingAthletes || isLoadingRankingsCount;

  if (isLoading) {
     return (
      <>
        <Helmet>
          <title>Loading Category... | Wodagoat</title>
          <meta name="description" content="Loading category details, leaderboards, and community rankings." />
        </Helmet>
        <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <div className="container mx-auto py-4 sm:py-6 md:py-8 flex-grow">
              <Skeleton className="h-10 sm:h-12 w-32 sm:w-48 mb-6 sm:mb-8" />
              <Skeleton className="h-8 sm:h-10 w-3/4 mb-2" />
              <Skeleton className="h-4 sm:h-6 w-1/2 mb-6 sm:mb-8" />
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="w-full lg:w-2/3 xl:w-3/5"><Skeleton className="h-80 sm:h-96 w-full" /></div>
                  <div className="w-full lg:w-1/3 xl:w-2/5 space-y-4 sm:space-y-6"><Skeleton className="h-40 sm:h-48 w-full" /></div>
              </div>
          </div>
        </div>
      </>
    );
  }

  if (!dbCategory) {
    return (
      <>
        <Helmet>
          <title>Category Not Found | Wodagoat</title>
          <meta name="description" content="The category you're looking for doesn't exist or couldn't be loaded. Please return to the homepage to explore other debates." />
        </Helmet>
        <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <div className="container mx-auto py-4 sm:py-6 md:py-8 text-center flex-grow flex items-center justify-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Category Not Found</h1>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">The category you're looking for doesn't exist or couldn't be loaded.</p>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
                <Link to="/">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const socialActions = (
    <SocialActions 
      categoryId={categoryId!} 
    />
  );

  // Determine button state based on user authentication and existing ranking
  const hasExistingRanking = user && userRanking;
  const buttonText = hasExistingRanking ? "View My Ranking" : "Create Ranking";
  const buttonIcon = hasExistingRanking ? Eye : Plus;
  const buttonLink = hasExistingRanking ? `/ranking/${userRanking.id}` : `/category/${categoryId}/rank`;
  const buttonTitle = hasExistingRanking ? "View Your Ranking" : "Create Your Ranking";

  return (
    <>
      <Helmet>
        <title>{`${dbCategory.name} - GOAT Debate | Wodagoat`}</title>
        <meta name="description" content={dbCategory.description || `Join the GOAT debate for ${dbCategory.name}. Create rankings, view leaderboards, and share your opinion with a global community of sports fans.`} />
      </Helmet>
      <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <div className="container mx-auto py-4 sm:py-6 md:py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <Button 
                asChild 
                size="lg"
                className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <Link to="/">
                  <ChevronLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Back to All Categories
                </Link>
              </Button>
            </div>

            <header className="mb-4 sm:mb-6 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">{dbCategory.name}</h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-300">{dbCategory.description}</p>
            </header>

            <div className="mb-6 sm:mb-8">
              <GlobalLeaderboard 
                athletes={leaderboardAthletes} 
                categoryName="Global Leaderboard" 
                submittedRankingsCount={submittedRankingsCount || 0}
                socialActions={socialActions}
              />
            </div>
          </div>
          
          {/* Full-width Comment Section */}
          <div className="mt-6 sm:mt-8">
              <CommentSection categoryId={categoryId!} />
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
            <Button 
              asChild 
              variant="cta" 
              className="rounded-full shadow-2xl hover:scale-105 transition-transform w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center md:w-auto md:px-6 md:py-3 md:h-12"
              disabled={isLoadingUserRanking}
            >
              <Link to={buttonLink} title={buttonTitle}>
                {React.createElement(buttonIcon, { 
                  className: "h-6 w-6 sm:h-7 sm:w-7 md:h-6 md:w-6 md:mr-2 shrink-0" 
                })}
                <span className="hidden md:inline font-semibold">{buttonText}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
