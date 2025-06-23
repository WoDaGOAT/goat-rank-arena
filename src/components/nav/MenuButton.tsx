
import React from "react";
import { ChevronDown } from "lucide-react";

interface MenuButtonProps {
  item: {
    id: string;
    name: string;
    icon: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

const MenuButton = ({ item, isOpen, onClick }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3
        text-sm xl:text-lg font-semibold text-white 
        transition-all duration-200 rounded-lg
        hover:bg-white/10
        ${isOpen ? 'bg-white/20' : ''}
      `}
    >
      <span className="text-lg">{item.icon}</span>
      <span className="whitespace-nowrap">{item.name}</span>
      <ChevronDown 
        className={`w-4 h-4 xl:w-5 xl:h-5 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} 
      />
    </button>
  );
};

export default MenuButton;
