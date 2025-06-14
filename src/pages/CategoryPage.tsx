import { useParams, Link } from "react-router-dom";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { mockCategories, getCategoryById } from "@/data/mockData"; // Using mock data
import { useEffect, useState } from "react";
import { Category } from "@/types";
import { ChevronLeft, Users, PlusCircle, Info, TrendingUp } from "lucide-react"; // Added TrendingUp
import Navbar from "@/components/Navbar";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    if (categoryId) {
      const foundCategory = getCategoryById(categoryId);
      setCategory(foundCategory);
    }
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-gray-300 mb-6">The category you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
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

        <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-white mb-2">{category.name}</h1>
            <p className="text-lg text-gray-300">{category.description}</p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Leaderboard */}
          <div className="w-full md:w-2/3 lg:w-3/5">
            <GlobalLeaderboard athletes={category.leaderboard} categoryName="Global Leaderboard" />
          </div>

          {/* Right Column: Category Info & CTA */}
          <div className="w-full md:w-1/3 lg:w-2/5 space-y-6">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-300" />
                Activity Snapshot
              </h2>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-blue-300 mb-1">{category.userRankingCount.toLocaleString()}</p>
                <p className="text-sm text-gray-300">User Rankings Submitted</p>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Join the community and share your ranking!
              </p>
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-300" />
                How to Participate
              </h2>
              <p className="text-gray-300 mb-4">
                Share your opinion! Create your own ranking for this category and see how it compares with others. Your submission helps shape the global leaderboard.
              </p>
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Your Ranking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
