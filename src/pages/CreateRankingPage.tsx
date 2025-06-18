
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
  
  const { data: userRanking, isLoading: isLoadingUserRanking } = useUserRankingForCategory(categoryId);

  const { data: category, isLoading: isLoadingCategory } = useQuery<Category | null>({
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
      if (!data) return null;
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
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8 text-center text-white">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (userRanking) {
    return (
     <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
       <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8 text-center">
         <div>
          <h1 className="text-3xl font-bold text-white mb-4">Ranking Already Submitted</h1>
          <p className="text-gray-300 mb-6">You have already submitted a ranking for {category?.name}.</p>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
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
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8 text-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
            <p className="text-gray-300 mb-6">The category you're looking for doesn't exist or couldn't be loaded.</p>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <RankingEditor category={category} />
      </main>
    </div>
  );
};

export default CreateRankingPage;
