
import CategoryCard from "@/components/CategoryCard";
import { Category } from "@/types";

interface CategoriesGridProps {
  categories: Category[];
  isStatic?: boolean;
}

const CategoriesGrid = ({ categories, isStatic = false }: CategoriesGridProps) => {
  return (
    <div className="lg:col-span-3">
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} isStatic={isStatic} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No categories available at the moment.
        </p>
      )}
    </div>
  );
};

export default CategoriesGrid;
