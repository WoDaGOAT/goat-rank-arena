
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

  // Fetch categories with updated cache key
  const { data: allCategories } = useCategories();

  // Build menu items from database categories
  const menuItems: MenuItem[] = React.useMemo(() => {
    if (!allCategories) return [];
    
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

    // Map to menu structure with icons
    const menuMapping: Record<string, string> = {
      'GOAT': '🐐',
      'Greatest of This Season': '🏆',
      'Competitions': '🌍'
    };

    return rootCategories
      .filter(category => menuMapping[category.name])
      .map(category => ({
        id: category.id,
        name: category.name,
        icon: menuMapping[category.name],
        children: category.children.map(child => ({
          id: child.id,
          name: child.name,
          description: child.description || undefined
        }))
      }))
      .sort((a, b) => {
        const order = ['GOAT', 'Greatest of This Season', 'Competitions'];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
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
