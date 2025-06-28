
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface CategoryPageHeaderProps {
  categoryName: string;
  categoryDescription?: string | null;
}

const CategoryPageHeader = ({ categoryName, categoryDescription }: CategoryPageHeaderProps) => {
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <Button 
          asChild 
          size="lg"
          className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 hover:border-white/60 shadow-lg transition-all duration-200 font-semibold text-sm sm:text-base px-3 sm:px-4 py-2"
        >
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Back to All Categories
          </Link>
        </Button>
      </div>

      <header className="mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">{categoryName}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300">{categoryDescription}</p>
      </header>
    </>
  );
};

export default CategoryPageHeader;
