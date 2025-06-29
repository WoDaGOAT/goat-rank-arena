
import React from "react";

interface CategoryPageHeaderProps {
  categoryName: string;
  categoryDescription?: string | null;
}

const CategoryPageHeader = ({ categoryName, categoryDescription }: CategoryPageHeaderProps) => {
  return (
    <header className="mb-4 sm:mb-6 text-center sm:text-left">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">{categoryName}</h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-300">{categoryDescription}</p>
    </header>
  );
};

export default CategoryPageHeader;
