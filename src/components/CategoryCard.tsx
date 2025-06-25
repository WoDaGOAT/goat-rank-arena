
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Octagon } from "lucide-react";
import PodiumDisplay from "./PodiumDisplay";
import { getCategoryNavigationPath } from "@/hooks/homepage/staticCategoryData";

interface CategoryCardProps {
  category: Category;
  isStatic?: boolean;
}

const CategoryCard = ({ category, isStatic = false }: CategoryCardProps) => {
  // Show special octagon icon for MMA, else the podium
  const showOctagon = category.imageUrl === "octagon";
  
  // For static categories, we need to find the real category by name
  // For now, we'll use a placeholder path that will redirect to search
  const linkPath = isStatic 
    ? `/categories?search=${encodeURIComponent(getCategoryNavigationPath(category.id))}`
    : `/category/${category.id}`;
  
  return (
    <Link to={linkPath} className="block">
      <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-white/5 border-white/10 text-white h-full cursor-pointer hover:bg-white/10 hover:scale-105">
        <CardHeader className="flex-grow">
          <div className="relative w-full h-60 mb-4 rounded-t-md overflow-hidden bg-zinc-100/5 dark:bg-zinc-800/5 flex items-center justify-center">
            {showOctagon ? (
              <div className="flex items-center justify-center w-full h-full">
                <Octagon className="w-20 h-20 text-primary" strokeWidth={1.5} />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PodiumDisplay athletes={category.leaderboard} />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-semibold text-primary">{category.name}</CardTitle>
          <p className="text-sm text-gray-300 mb-3">{category.description}</p>
          <div className="flex items-center text-muted-foreground mt-2 mb-3">
            <Flag className="w-4 h-4 mr-2" />
            <span className="text-sm">
              {isStatic ? "Join the ranking" : `${category.userRankingCount.toLocaleString()} rankings submitted`}
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CategoryCard;
