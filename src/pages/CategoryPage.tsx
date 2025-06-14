
import { useParams, Link } from "react-router-dom";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { mockCategories, getCategoryById } from "@/data/mockData"; // Using mock data
import { useEffect, useState } from "react";
import { Category } from "@/types";
import { ChevronLeft, Users, PlusCircle, Info } from "lucide-react"; // Added Info icon
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
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-destructive mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist or couldn't be loaded.</p>
          <Button asChild variant="outline">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to All Categories
          </Link>
        </Button>

        <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-primary mb-2">{category.name}</h1>
            <p className="text-lg text-muted-foreground">{category.description}</p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Leaderboard */}
          <div className="w-full md:w-2/3 lg:w-3/5">
            <GlobalLeaderboard athletes={category.leaderboard} categoryName="Global Leaderboard" />
          </div>

          {/* Right Column: Category Info & CTA */}
          <div className="w-full md:w-1/3 lg:w-2/5 space-y-6">
            <div className="p-6 bg-card rounded-lg shadow-md border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-3">Activity</h2>
              <div className="flex items-center text-muted-foreground mb-4">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  <span className="font-medium">{category.userRankingCount.toLocaleString()} user rankings submitted</span>
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-accent-foreground" />
                How to Participate
              </h2>
              <p className="text-muted-foreground mb-4">
                Share your opinion! Create your own ranking for this category and see how it compares with others. Your submission helps shape the global leaderboard.
              </p>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Your Ranking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
