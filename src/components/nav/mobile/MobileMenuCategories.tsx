
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
}

interface MobileMenuCategoriesProps {
  onLinkClick: () => void;
}

const MobileMenuCategories = ({ onLinkClick }: MobileMenuCategoriesProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
  };

  return (
    <div className="space-y-6 mb-8">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Categories</h3>
      
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="space-y-3">
            <Collapsible 
              open={isCategoryExpanded(item.id)} 
              onOpenChange={() => toggleCategory(item.id)}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between text-lg font-bold text-white bg-slate-800 p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                  <span>{item.name}</span>
                  {isCategoryExpanded(item.id) ? (
                    <ChevronDown className="h-5 w-5 text-slate-300" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-4 mt-3">
                {item.children?.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={`/category/${subItem.id}`}
                    onClick={onLinkClick}
                    className="block p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    <div className="text-base font-semibold text-white">
                      {subItem.name}
                    </div>
                    <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                      {subItem.description || "Rank the greatest athletes"}
                    </p>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenuCategories;
