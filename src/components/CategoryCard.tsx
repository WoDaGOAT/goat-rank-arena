
import { Link } from "react-router-dom";
import { Category } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Octagon } from "lucide-react";
import PodiumDisplay from "./PodiumDisplay";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Show special octagon icon for MMA, else the podium
  const showOctagon = category.imageUrl === "octagon";
  
  return (
    <Link to={`/category/${category.id}`} className="block">
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
          <CardDescription className="text-primary-foreground/80 h-12">{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            <span>{category.userRankingCount.toLocaleString()} rankings submitted</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
