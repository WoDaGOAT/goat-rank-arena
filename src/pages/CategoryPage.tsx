
import { useParams, Link } from "react-router-dom";
import GlobalLeaderboard from "@/components/GlobalLeaderboard";
import { Button } from "@/components/ui/button";
import { mockCategories, getCategoryById } from "@/data/mockData"; // Using mock data
import { useEffect, useState } from "react";
import { Category } from "@/types";
import { ChevronLeft, Users, PlusCircle } from "lucide-react";
import Navbar from "@/components/Navbar"; // Add Navbar here

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

        <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
            <h1 className="text-4xl font-extrabold text-primary mb-2">{category.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{category.description}</p>
            <div className="flex items-center text-accent-foreground mb-6">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <span className="font-medium">{category.userRankingCount.toLocaleString()} user rankings submitted</span>
            </div>
            <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Your Ranking
            </Button>
        </div>
        
        <GlobalLeaderboard athletes={category.leaderboard} categoryName="Global Leaderboard" />
      </div>
    </>
  );
};

export default CategoryPage;
