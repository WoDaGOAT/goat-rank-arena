
import CategoryCard from "@/components/CategoryCard";
import { Category } from "@/types";

interface CategoriesGridProps {
  categories: Category[];
}

const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
  return (
    <div className="lg:col-span-3">
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No other categories available at the moment.
        </p>
      )}
    </div>
  );
};

export default CategoriesGrid;
