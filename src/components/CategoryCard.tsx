
import { Link } from "react-router-dom";
import { Category, getPlaceholderImageUrl } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Octagon } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Show special octagon icon for MMA, else the Unsplash image
  const showOctagon = category.imageUrl === "octagon";
  return (
    <Card className="w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        {showOctagon ? (
          <div className="flex items-center justify-center w-full h-48 bg-zinc-100 dark:bg-zinc-800 mb-4 rounded-t-md">
            <Octagon className="w-20 h-20 text-primary" strokeWidth={1.5} />
          </div>
        ) : (
          category.imageUrl && (
            <img 
              src={getPlaceholderImageUrl(category.imageUrl)} 
              alt={category.name} 
              className="w-full h-48 object-cover mb-4 rounded-t-md"
            />
          )
        )}
        <CardTitle className="text-2xl font-semibold text-primary">{category.name}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          <span>{category.userRankingCount.toLocaleString()} rankings submitted</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to={`/category/${category.id}`}>View Leaderboard</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
