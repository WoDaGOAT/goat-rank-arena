
import React, { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSimpleCategories } from "@/hooks/useSimpleCategories";
import { Link } from "react-router-dom";

interface MenuCategory {
  id: string;
  name: string;
  children: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

const SimpleDropdownMenu = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isMobile = useIsMobile();

  const { data: categories, isLoading, isError } = useSimpleCategories();

  console.log("📋 SimpleDropdownMenu render:", { 
    categoriesCount: categories?.length, 
    isLoading, 
    isError 
  });

  // Build menu items from categories
  const menuItems: MenuCategory[] = React.useMemo(() => {
    if (!categories) return [];
    
    // Simple flat structure for now
    const items = categories
      .filter(cat => ['GOAT', 'Current GOAT'].includes(cat.name))
      .map(category => ({
        id: category.id,
        name: category.name,
        children: [
          {
            id: `${category.id}-main`,
            name: category.name.replace('GOAT', 'Footballer'),
            description: category.description || 'Vote for the greatest'
          }
        ]
      }));

    console.log("📋 Menu items built:", items.length);
    return items;
  }, [categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideAnyDropdown = Object.values(dropdownRefs.current).some(ref => 
        ref?.contains(event.target as Node)
      );
      
      if (!isClickInsideAnyDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (itemId: string) => {
    if (isMobile) {
      setMobileMenuOpen(true);
      return;
    }
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  // Always render something, even if loading or error
  return (
    <>
      <div className="w-full flex justify-center">
        {/* Mobile hamburger button */}
        <div className="block lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">
              {isLoading ? "Loading..." : "Categories"}
            </span>
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-gray-400">
              Loading categories...
            </div>
          ) : isError ? (
            <div className="flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-red-400">
              Menu unavailable
            </div>
          ) : menuItems.length === 0 ? (
            <div className="flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-gray-400">
              No categories
            </div>
          ) : (
            menuItems.map((item) => {
              const isOpen = openDropdown === item.id;
              
              return (
                <div 
                  key={item.id} 
                  className="relative"
                  ref={el => dropdownRefs.current[item.id] = el}
                >
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className="flex items-center gap-1 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/categories?search=${encodeURIComponent(child.name)}`}
                            onClick={() => setOpenDropdown(null)}
                            className="block p-3 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            <div className="font-medium text-white">{child.name}</div>
                            {child.description && (
                              <div className="text-sm text-gray-300 mt-1">{child.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>

      {/* Simple mobile menu placeholder */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="p-6">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-xl mb-4"
            >
              ✕ Close
            </button>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="text-white">
                  <div className="font-semibold mb-2">{item.name}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/categories?search=${encodeURIComponent(child.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block p-2 text-gray-300 hover:text-white"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleDropdownMenu;
