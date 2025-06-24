
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import CategoriesGrid from "./CategoriesGrid";
import { useAdditionalCategories } from "@/hooks/useAdditionalCategories";

const LoadMoreCategories = () => {
  const [showMore, setShowMore] = useState(false);
  const { data: additionalCategories, isLoading, refetch } = useAdditionalCategories();

  const handleToggle = async () => {
    if (!showMore && !additionalCategories) {
      // Fetch categories when showing for the first time
      await refetch();
    }
    setShowMore(!showMore);
  };

  return (
    <div className="mt-8">
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={handleToggle}
          className="text-white hover:text-white/80 hover:bg-white/10 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading categories...
            </>
          ) : showMore ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Show fewer categories
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              Load more categories
            </>
          )}
        </Button>
      </div>

      {showMore && additionalCategories && additionalCategories.length > 0 && (
        <div className="mt-6 animate-in slide-in-from-top-4 duration-300">
          <CategoriesGrid categories={additionalCategories} />
        </div>
      )}

      {showMore && additionalCategories && additionalCategories.length === 0 && (
        <div className="mt-6 text-center text-muted-foreground">
          <p>No additional categories available.</p>
        </div>
      )}
    </div>
  );
};

export default LoadMoreCategories;
