
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  children: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

interface MobileMenuComponentProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const MobileMenuComponent = ({ isOpen, onClose, menuItems }: MobileMenuComponentProps) => {
  return (
    <div className={`fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-gray-900 border-l border-gray-700 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
          {menuItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <span>{item.icon}</span>
                {item.name}
              </h3>
              <div className="space-y-1">
                {item.children.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={`/category/${subItem.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={onClose}
                  >
                    <div className="text-sm font-medium text-white">
                      {subItem.name}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {subItem.description || "Rank the greatest athletes"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuComponent;
