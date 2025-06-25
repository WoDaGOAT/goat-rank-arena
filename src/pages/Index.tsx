
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomepageHeader from "@/components/home/HomepageHeader";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import FeaturedLeaderboard from "@/components/home/FeaturedLeaderboard";
import FeedPreview from "@/components/home/FeedPreview";
import { useSimplifiedHomepageCategories } from "@/hooks/useSimplifiedHomepageCategories";

const Index = () => {
  const { data: homepageData, isLoading, isError } = useSimplifiedHomepageCategories();

  console.log("🏠 Index page render:", { 
    isLoading, 
    isError, 
    hasData: !!homepageData 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="flex-1">
        <HomepageHeader />
        
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Categories Grid */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Choose Your GOAT Category
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading categories...</div>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <div className="text-red-600">Unable to load categories. Please try again later.</div>
              </div>
            ) : (
              <CategoriesGrid categories={homepageData?.otherCategories || []} isStatic={true} />
            )}
          </section>

          {/* Featured Leaderboard */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Featured Leaderboard
            </h2>
            <FeaturedLeaderboard 
              goatFootballer={homepageData?.goatFootballer || null} 
              isStatic={true}
            />
          </section>

          {/* Feed Preview */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Latest Activity
            </h2>
            <FeedPreview />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
