import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useUserRankingForCategory } from "@/hooks/useUserRankingForCategory";
import { useAuth } from "@/contexts/AuthContext";
import RankingEditor from "@/components/ranking/RankingEditor";
import { useEffect, useState } from "react";

const CreateRankingPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  console.log('🔍 CreateRankingPage - Rendering with:', { categoryId, userId: user?.id, hasRedirected });
  
  // Clear localStorage on unmount to prevent interference
  useEffect(() => {
    return () => {
      try {
        localStorage.removeItem('wodagoat_athlete_selection');
        console.log('🔍 CreateRankingPage - Cleared localStorage on unmount');
      } catch (error) {
        console.warn('🔍 CreateRankingPage - Failed to clear localStorage on unmount:', error);
      }
    };
  }, []);
  
  // Don't check for existing ranking if we don't have a user yet
  const { data: userRanking, isLoading: isLoadingUserRanking, error: userRankingError } = useUserRankingForCategory(
    user ? categoryId : undefined
  );
  
  console.log('🔍 CreateRankingPage - User ranking check:', {
    userRanking,
    isLoadingUserRanking,
    userRankingError,
    hasUser: !!user
  });

  // Only redirect once to prevent loops
  useEffect(() => {
    if (userRanking && userRanking.id && !hasRedirected && user) {
      console.log('🔍 CreateRankingPage - Redirecting to existing ranking:', userRanking.id);
      setHasRedirected(true);
      navigate(`/ranking/${userRanking.id}`, { replace: true });
    }
  }, [userRanking, hasRedirected, navigate, user]);

  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useQuery<Category | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      console.log('🔍 CreateRankingPage - Fetching category:', categoryId);
      
      if (!categoryId) {
        console.log('🔍 CreateRankingPage - No categoryId provided');
        return null;
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
        
      if (error) {
        console.error('🔍 CreateRankingPage - Category fetch error:', error);
        if (error.code === 'PGRST116') {
          return null; // Category not found
        }
        throw error;
      }
      
      console.log('🔍 CreateRankingPage - Category loaded:', data);
      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        userRankingCount: 0,
        leaderboard: [],
      };
    },
    enabled: !!categoryId,
    retry: 1,
  });

  // Show loading state
  if (isLoadingCategory || (user && isLoadingUserRanking && !hasRedirected)) {
    console.log('🔍 CreateRankingPage - Showing loading state');
    return (
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto py-4 sm:py-6 md:py-8 text-center text-white">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-sm sm:text-base">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  // Handle errors
  if (categoryError) {
    console.error('🔍 CreateRankingPage - Category error:', categoryError);
    return (
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto py-4 sm:py-6 md:py-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Error Loading Category</h1>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">There was an error loading the category. Please try again.</p>
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

  // If user has ranking and we're redirecting, show redirect message
  if (userRanking && user && !hasRedirected) {
    console.log('🔍 CreateRankingPage - Showing redirect message');
    return (
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto py-4 sm:py-6 md:py-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Redirecting...</h1>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">You already have a ranking for {category?.name}. Taking you there now.</p>
            <Button 
              onClick={() => {
                setHasRedirected(true);
                navigate(`/ranking/${userRanking.id}`, { replace: true });
              }}
              size="lg" 
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 border-0 shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2"
            >
              View My Ranking
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Category not found
  if (!category && !isLoadingCategory) {
    console.log('🔍 CreateRankingPage - Category not found');
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

  // Render the ranking editor
  console.log('🔍 CreateRankingPage - Rendering RankingEditor with category:', category);
  return (
    <div className="min-h-screen flex flex-col mb-0" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <main className="container mx-auto flex-grow">
        <RankingEditor category={category!} />
      </main>
    </div>
  );
};

export default CreateRankingPage;
