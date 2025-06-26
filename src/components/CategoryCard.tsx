
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Octagon } from "lucide-react";
import PodiumDisplay from "./PodiumDisplay";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Show special octagon icon for MMA, else the podium
  const showOctagon = category.imageUrl === "octagon";
  
  return (
    <Link to={`/category/${category.id}`} className="block h-full">
      <Card className="w-full h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-white/5 border-white/10 text-white cursor-pointer hover:bg-white/10 hover:scale-105">
        <CardHeader className="flex flex-col flex-grow p-4 pb-2">
          <div className="relative w-full h-60 mb-3 rounded-t-md overflow-hidden bg-zinc-100/5 dark:bg-zinc-800/5 flex items-center justify-center flex-shrink-0">
            {showOctagon ? (
              <div className="flex items-center justify-center w-full h-full">
                <Octagon className="w-16 h-16 text-primary" strokeWidth={1.5} />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PodiumDisplay athletes={category.leaderboard} />
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-grow">
            <CardTitle className="text-lg font-semibold text-primary leading-tight min-h-[3rem] flex items-start mb-2">
              <span className="line-clamp-2 break-words">{category.name}</span>
            </CardTitle>
            
            <div className="flex items-center text-muted-foreground">
              <Flag className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{category.userRankingCount.toLocaleString()} rankings submitted</span>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default CategoryCard;
