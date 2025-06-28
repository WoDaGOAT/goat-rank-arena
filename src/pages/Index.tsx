import { Skeleton } from "@/components/ui/skeleton";
import HomepageHeader from "@/components/home/HomepageHeader";
import FeaturedLeaderboard from "@/components/home/FeaturedLeaderboard";
import { useHomepageCategories } from "@/hooks/useHomepageCategories";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileQuestion, Trophy } from "lucide-react";

const Index = () => {
  const { data: categoriesData, isLoading, isError } = useHomepageCategories();

  return (
    <>
      <HomepageHeader />
      
      {/* Marketing Banner */}
      <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-700/20 py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Your Voice, Your Vote, Your GOAT
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Your opinion shapes the ultimate football GOAT ranking
          </p>
        </div>
      </div>

      <div
        className="flex flex-col flex-grow min-h-screen"
        style={{ background: "linear-gradient(135deg, rgba(25, 7, 73, 0.6) 0%, rgba(7, 2, 21, 0.6) 100%)" }}
      >
        <div className="container mx-auto px-4 py-8 flex-grow">
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
              {/* Left column skeleton */}
              <div>
                <Skeleton className="h-[600px] w-full rounded-lg bg-white/5" />
              </div>
              {/* Right column skeleton */}
              <div>
                <Skeleton className="h-[400px] w-full rounded-lg bg-white/5" />
              </div>
            </div>
          )}
          
          {isError && (
            <div className="text-center text-red-400 text-lg space-y-2">
              <p>Could not load content. Please try again later.</p>
              <p className="text-sm text-red-300">Check the console for more details.</p>
            </div>
          )}
          
          {!isLoading && !isError && categoriesData && (
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">
              {/* Left Column - Leaderboard (60%) */}
              <div className="w-full">
                <FeaturedLeaderboard goatFootballer={categoriesData.goatFootballer} />
              </div>

              {/* Right Column - Daily Quiz (40%) */}
              <div className="w-full">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 mb-4">
                      <FileQuestion className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Daily Quiz</h2>
                    <p className="text-gray-300 text-sm">Test your football knowledge and earn badges!</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">Today's Challenge</span>
                        <Trophy className="h-5 w-5 text-yellow-400" />
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        Answer questions about football legends and climb the leaderboard!
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        <span>🎯 Earn points & badges</span>
                        <span>⚡ Build your streak</span>
                      </div>
                    </div>
                    
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg"
                    >
                      <Link to="/quiz">
                        <FileQuestion className="h-5 w-5 mr-2" />
                        Start Quiz
                      </Link>
                    </Button>
                    
                    <div className="text-center">
                      <Link 
                        to="/quiz" 
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        View Leaderboard →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
