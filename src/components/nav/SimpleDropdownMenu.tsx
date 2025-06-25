
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
    isError,
    categories: categories?.map(c => ({ name: c.name, childrenCount: c.children?.length || 0 }))
  });

  // Build menu items from categories with improved fallback handling
  const menuItems: MenuCategory[] = React.useMemo(() => {
    if (!categories || categories.length === 0) {
      console.log("📋 Using fallback menu structure");
      // Return a basic fallback menu structure
      return [
        {
          id: 'fallback-goat',
          name: 'GOAT',
          children: [
            { id: 'fallback-goat-footballer', name: 'GOAT Footballer', description: 'Greatest footballer of all time' },
            { id: 'fallback-goat-goalkeeper', name: 'GOAT Goalkeeper', description: 'Greatest goalkeeper of all time' }
          ]
        },
        {
          id: 'fallback-current',
          name: 'Current GOAT',
          children: [
            { id: 'fallback-current-footballer', name: 'Current GOAT Footballer', description: 'Best active footballer' }
          ]
        }
      ];
    }
    
    // Filter for main categories and build menu structure
    const items = categories
      .filter(cat => ['GOAT', 'Current GOAT', 'Competitions'].includes(cat.name))
      .map(category => ({
        id: category.id,
        name: category.name,
        children: (category.children || []).map(child => ({
          id: child.id,
          name: child.name,
          description: child.description || undefined
        }))
      }));

    console.log("📋 Menu items built:", items.map(i => ({ name: i.name, childrenCount: i.children.length })));
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div className="block lg:hidden">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-gray-400 rounded-lg"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">Loading...</span>
          </button>
        </div>
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6">
          <div className="flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-gray-400">
            Loading categories...
          </div>
        </nav>
      </div>
    );
  }

  // Show error state but still render fallback menu
  if (isError) {
    console.log("📋 Error state, using fallback menu");
  }

  return (
    <>
      <div className="w-full flex justify-center">
        {/* Mobile hamburger button */}
        <div className="block lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">Categories</span>
          </button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6">
          {menuItems.map((item) => {
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
                          to={`/category/${child.id}`}
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
          })}
        </nav>
      </div>

      {/* Simple mobile menu */}
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
                      to={`/category/${child.id}`}
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
