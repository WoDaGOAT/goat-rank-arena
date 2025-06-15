import { useParams, Link } from "react-router-dom";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Info, TrendingUp, Heart, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { SocialActions } from "@/components/category/SocialActions";
import CommentSection from "@/components/category/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { allAthletes } from "@/data/mockAthletes";
import Footer from "@/components/Footer";
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
  
  // Fetch category data from Supabase
  const { data: dbCategory, isLoading: isLoadingCategory } = useQuery<DbCategory | null>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId || "")
        .single();
      if (error && error.code !== 'PGRST116') { // Ignore 'exact one row' error if not found
        throw error;
      }
      return data;
    },
    enabled: !!categoryId,
  });

  // Fetch likes data
  const { data: likesData, isLoading: isLoadingLikes } = useQuery({
    queryKey: ['categoryLikes', categoryId],
    queryFn: async () => {
      const { count, error: countError } = await supabase
        .from('category_likes')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId || "");
      
      if (countError) throw countError;

      let isLiked = false;
      if (user) {
        const { data: likeData, error: likeError } = await supabase
          .from('category_likes')
          .select('id')
          .eq('category_id', categoryId || "")
          .eq('user_id', user.id)
          .maybeSingle();
        if (likeError) throw likeError;
        isLiked = !!likeData;
      }

      return { count: count || 0, isLiked };
    },
    enabled: !!categoryId
  });

  if (isLoadingCategory || isLoadingLikes) {
     return (
      <>
        <Helmet>
          <title>Loading Category... | Wodagoat</title>
          <meta name="description" content="Loading category details, leaderboards, and community rankings." />
        </Helmet>
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
              <Skeleton className="h-12 w-48 mb-8" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-2/3 lg:w-3/5"><Skeleton className="h-96 w-full" /></div>
                  <div className="w-full md:w-1/3 lg:w-2/5 space-y-6"><Skeleton className="h-48 w-full" /></div>
              </div>
          </main>
          <Footer />
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
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <Navbar />
          <main className="container mx-auto px-4 py-8 text-center flex-grow flex items-center justify-center">
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
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${dbCategory.name} - GOAT Debate | Wodagoat`}</title>
        <meta name="description" content={dbCategory.description || `Join the GOAT debate for ${dbCategory.name}. Create rankings, view leaderboards, and share your opinion with a global community of sports fans.`} />
      </Helmet>
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-8">
            <Button 
              asChild 
              size="lg"
              className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 shadow-lg transition-all duration-200 font-semibold"
            >
              <Link to="/">
                <ChevronLeft className="mr-2 h-5 w-5" /> Back to All Categories
              </Link>
            </Button>
          </div>

          <header className="mb-4">
              <h1 className="text-4xl font-extrabold text-white mb-2">{dbCategory.name}</h1>
              <p className="text-lg text-gray-300">{dbCategory.description}</p>
          </header>
          
          <div className="mb-8">
              <SocialActions 
                  categoryId={categoryId!} 
                  initialLikes={likesData?.count ?? 0}
                  isLiked={likesData?.isLiked ?? false}
                  categoryName={dbCategory.name}
              />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Leaderboard */}
            <div className="w-full lg:w-2/3 xl:w-3/5">
              <GlobalLeaderboard athletes={allAthletes} categoryName="Global Leaderboard" />
            </div>

            {/* Right Column: Category Info & CTA */}
            <div className="w-full lg:w-1/3 xl:w-2/5 space-y-6">
               <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-300" />
                  How to Participate
                </h2>
                <p className="text-gray-300 mb-4">
                  Share your opinion! Create your own ranking for this category and see how it compares with others. Your submission helps shape the global leaderboard.
                </p>
                <Button asChild variant="cta" size="lg" className="w-full">
                  <Link to={`/category/${categoryId}/create-ranking`}>
                    <Users className="mr-2 h-5 w-5" /> Create Your Ranking
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Full-width Comment Section */}
          <div className="mt-8">
              <CommentSection categoryId={categoryId!} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CategoryPage;
