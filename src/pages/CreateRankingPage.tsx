
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";
import { useAuth } from "@/contexts/AuthContext";
import RankingEditor from "@/components/ranking/RankingEditor";

const CreateRankingPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  
  console.log('CreateRankingPage - URL categoryId from params:', categoryId);
  console.log('CreateRankingPage - Current user:', user?.id);
  
  const { data: userRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(categoryId);
  
  console.log('CreateRankingPage - User ranking check result:', {
    userRanking,
    categoryId,
    hasExistingRanking: Boolean(userRanking),
    isLoading: isLoadingUserRanking
  });

  const { data: category, isLoading: isLoadingCategory } = useQuery<Category | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      console.log('CreateRankingPage - Fetching category data for:', categoryId);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId || "")
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('CreateRankingPage - Category fetch error:', error);
        throw error;
      }
      if (!data) {
        console.log('CreateRankingPage - No category found for ID:', categoryId);
        return null;
      }
      console.log('CreateRankingPage - Category data loaded:', data);
      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        userRankingCount: 0,
        leaderboard: [],
      };
    },
    enabled: !!categoryId,
  });

  if (isLoadingCategory || (user && isLoadingUserRanking)) {
    return (
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto py-4 sm:py-6 md:py-8 text-center text-white">
          <p className="text-sm sm:text-base">Loading...</p>
        </main>
      </div>
    );
  }

  if (userRanking) {
    console.log('CreateRankingPage - User already has ranking, showing already submitted message');
    return (
     <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
       <main className="flex-grow flex items-center justify-center container mx-auto py-4 sm:py-6 md:py-8 text-center">
         <div className="max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ranking Already Submitted</h1>
          <p className="text-gray-300 mb-6 text-sm sm:text-base">You have already submitted a ranking for {category?.name}.</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2">
            <Link to={`/category/${categoryId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to {category?.name}
            </Link>
          </Button>
         </div>
       </main>
     </div>
   );
 }

  if (!category) {
    console.log('CreateRankingPage - Category not found, showing not found message');
    return (
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto py-4 sm:py-6 md:py-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Category Not Found</h1>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">The category you're looking for doesn't exist or couldn't be loaded.</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  console.log('CreateRankingPage - Proceeding to RankingEditor with category:', category);

  return (
    <div className="min-h-screen flex flex-col mb-0" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <main className="container mx-auto flex-grow">
        <RankingEditor category={category} />
      </main>
    </div>
  );
};

export default CreateRankingPage;
