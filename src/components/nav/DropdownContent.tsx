
import React from "react";
import { Link } from "react-router-dom";

interface DropdownItem {
  id: string;
  name: string;
  description?: string;
}

interface DropdownContentProps {
  children: DropdownItem[];
  onItemClick: () => void;
}

const DropdownContent = ({ children, onItemClick }: DropdownContentProps) => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 z-[9999] mt-2 min-w-[600px] xl:min-w-[800px]">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-0 p-2">
          {children.map((subItem) => (
            <Link
              key={subItem.id}
              to={`/category/${subItem.id}`}
              className="block p-3 hover:bg-gray-800 transition-colors duration-200 rounded-md m-1"
              onClick={onItemClick}
            >
              <div className="text-sm font-medium text-white leading-none mb-1">
                {subItem.name}
              </div>
              <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                {subItem.description || "Rank the greatest athletes"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownContent;
