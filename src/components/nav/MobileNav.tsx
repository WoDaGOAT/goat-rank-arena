
import React, { useState } from "react";
import { Menu, X, Rss, FileQuestion, Wrench, Users, MessageSquareWarning } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
}

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, isModeratorOrAdmin } = useAuth();

  const { data: allCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Build parent-child tree
  const menuItems = React.useMemo(() => {
    if (!allCategories) return [];
    
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

    const desiredOrder = ['GOAT', 'Current GOAT', 'GOAT of my Time', 'Competitions'];
    rootCategories.sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));
    
    return rootCategories;
  }, [allCategories]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden h-10 w-10 p-0 hover:bg-white/10"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 z-[9999] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu panel */}
        <div className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-gray-900 border-l border-gray-700 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu content */}
          <div className="overflow-y-auto h-full pb-20">
            {/* Primary Navigation */}
            <div className="p-4 space-y-2 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">Navigation</h3>
              
              <Link
                to="/feed"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Rss className="h-5 w-5 text-gray-400" />
                <span className="text-white font-medium">Feed</span>
              </Link>

              <Link
                to="/quiz"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <FileQuestion className="h-5 w-5 text-fuchsia-500 transition-all group-hover:text-cyan-500" />
                <span className="font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Quiz</span>
              </Link>

              {/* Admin Navigation */}
              {(isModeratorOrAdmin || isAdmin) && (
                <>
                  <div className="pt-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Admin</h4>
                  </div>
                  
                  {isModeratorOrAdmin && (
                    <Link
                      to="/admin/comments"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <MessageSquareWarning className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">Comment Moderation</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <>
                      <Link
                        to="/admin/create-quiz"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Wrench className="h-5 w-5 text-gray-400" />
                        <span className="text-white font-medium">Create Quiz</span>
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-white font-medium">Manage Users</span>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Categories */}
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Categories</h3>
              
              {menuItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                    {item.name}
                  </h4>
                  <div className="space-y-1 ml-2">
                    {item.children?.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={`/category/${subItem.id}`}
                        onClick={handleLinkClick}
                        className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div className="text-sm font-medium text-white">
                          {subItem.name}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {subItem.description || "No description"}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
