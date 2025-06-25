import React, { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategories } from "@/hooks/useCategories";
import MenuButton from "./MenuButton";
import DropdownContent from "./DropdownContent";
import MobileMenuComponent from "./MobileMenuComponent";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
}

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

const CustomDropdownMenu = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isMobile = useIsMobile();

  // Fetch categories with enhanced error handling
  const { data: allCategories, isLoading, isError, error } = useCategories();

  // Debug logging
  useEffect(() => {
    console.log("📋 CustomDropdownMenu - Categories state:", {
      isLoading,
      isError,
      categoriesCount: allCategories?.length || 0,
      categories: allCategories?.map(c => ({ id: c.id, name: c.name, parent_id: c.parent_id })) || [],
      error: error?.message
    });
  }, [allCategories, isLoading, isError, error]);

  // Build menu items from database categories
  const menuItems: MenuItem[] = React.useMemo(() => {
    if (!allCategories || allCategories.length === 0) {
      console.log("📋 No categories available for menu");
      return [];
    }
    
    // Build parent-child tree
    const categoriesById = new Map(allCategories.map(c => [c.id, { ...c, children: [] as Category[] }]));
    const rootCategories: (Category & { children: Category[] })[] = [];
    
    allCategories.forEach(category => {
      if (category.parent_id) {
        const parent = categoriesById.get(category.parent_id);
        if (parent) {
          parent.children.push(categoriesById.get(category.id)!);
        }
      } else {
        rootCategories.push(categoriesById.get(category.id)!);
      }
    });

    console.log("📋 Root categories found:", rootCategories.map(c => c.name));

    // Map to menu structure without icons (keeping icon property for compatibility)
    const items = rootCategories
      .filter(category => ['GOAT', 'Current GOAT', 'Competitions'].includes(category.name))
      .map(category => ({
        id: category.id,
        name: category.name,
        icon: '', // Empty icon since we're not using them
        children: category.children.map(child => ({
          id: child.id,
          name: child.name,
          description: child.description || undefined
        }))
      }))
      .sort((a, b) => {
        const order = ['GOAT', 'Current GOAT', 'Competitions'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

    console.log("📋 Menu items built:", items.map(i => ({ name: i.name, childrenCount: i.children.length })));
    return items;
  }, [allCategories]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideAnyDropdown = Object.values(dropdownRefs.current).some(ref => 
        ref?.contains(event.target as Node)
      );
      
      if (!isClickInsideAnyDropdown) {
        setOpenDropdown(null);
      }
    };

    const handleScroll = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDropdownToggle = (itemId: string) => {
    if (isMobile) {
      setMobileMenuOpen(true);
      return;
    }
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  // Loading state
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

  // Error state
  if (isError) {
    console.error("📋 Error loading categories:", error);
    return (
      <div className="w-full flex justify-center">
        <div className="block lg:hidden">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">Retry</span>
          </button>
        </div>
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-red-400 hover:bg-white/10 rounded-lg transition-colors"
          >
            Failed to load - Click to retry
          </button>
        </nav>
      </div>
    );
  }

  // No categories fallback
  if (!menuItems || menuItems.length === 0) {
    console.log("📋 No menu items to display");
    return (
      <div className="w-full flex justify-center">
        <div className="block lg:hidden">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-gray-400 rounded-lg"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">No Categories</span>
          </button>
        </div>
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-6">
          <div className="flex items-center gap-2 px-3 xl:px-6 py-2 xl:py-3 text-sm xl:text-lg font-semibold text-gray-400">
            No categories available
          </div>
        </nav>
      </div>
    );
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
                <MenuButton
                  item={item}
                  isOpen={isOpen}
                  onClick={() => handleDropdownToggle(item.id)}
                />
                
                {isOpen && (
                  <DropdownContent
                    children={item.children}
                    onItemClick={() => setOpenDropdown(null)}
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      <MobileMenuComponent 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
};

export default CustomDropdownMenu;
