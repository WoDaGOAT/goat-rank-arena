
import CategoryCard from "@/components/CategoryCard";
import { Category } from "@/types";

interface CategoriesGridProps {
  categories: Category[];
}

const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
  return (
    <div className="w-full">
      {categories.length > 0 ? (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {categories.map((category) => (
              <div key={category.id} className="w-72 h-[480px] flex-shrink-0">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
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
