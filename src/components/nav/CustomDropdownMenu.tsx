
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface Category {
    id: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    children?: Category[];
}

const CustomDropdownMenu = () => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const { data: allCategories, isLoading, isError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
          const { data, error } = await supabase.from('categories').select('*');
          if (error) {
            toast.error("Failed to load navigation categories.");
            throw new Error(error.message);
          }
          console.log("Fetched categories:", data);
          return data || [];
        },
        retry: 1,
        staleTime: 0,
        refetchOnMount: true,
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
        
        console.log("Menu items with children:", rootCategories.map(item => ({
            name: item.name,
            childrenCount: item.children.length,
            children: item.children.map(child => child.name)
        })));
        
        return rootCategories;
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

    const handleDropdownToggle = (itemId: string, hasChildren: boolean) => {
        if (!hasChildren) return;
        setOpenDropdown(openDropdown === itemId ? null : itemId);
    };

    if (isLoading) {
        return (
            <div className="flex flex-nowrap items-center justify-center gap-0 md:gap-4 min-w-0 px-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-24 bg-gray-700" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-w-0">
                <div className="text-red-500 text-xs md:text-sm px-4 text-center">
                    Could not load categories.
                    <button 
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}
                        className="ml-2 underline hover:text-red-400 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <nav className="flex items-center justify-center gap-1 md:gap-2">
            {menuItems.length > 0 ? (
                menuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = openDropdown === item.id;
                    
                    return (
                        <div 
                            key={item.id} 
                            className="relative"
                            ref={el => dropdownRefs.current[item.id] = el}
                        >
                            <button
                                onClick={() => handleDropdownToggle(item.id, hasChildren)}
                                className={`
                                    flex items-center gap-1 px-2 md:px-4 py-1 md:py-2 
                                    text-xs md:text-base font-medium text-white 
                                    transition-colors duration-200 rounded-md
                                    hover:bg-gray-800
                                    ${isOpen ? 'bg-gray-800' : ''}
                                `}
                                disabled={!hasChildren}
                            >
                                <span>{item.name}</span>
                                {hasChildren && (
                                    <ChevronDown 
                                        className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                )}
                            </button>
                            
                            {hasChildren && isOpen && (
                                <div className="fixed z-[9999] mt-1 min-w-[640px] md:min-w-[800px]" 
                                     style={{
                                         top: `${(dropdownRefs.current[item.id]?.getBoundingClientRect().bottom || 0) + window.scrollY}px`,
                                         left: `${dropdownRefs.current[item.id]?.getBoundingClientRect().left || 0}px`
                                     }}>
                                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 p-2">
                                            {item.children.map((subItem) => (
                                                <Link
                                                    key={subItem.id}
                                                    to={`/category/${subItem.id}`}
                                                    className="block p-3 hover:bg-gray-800 transition-colors duration-200 rounded-md m-1"
                                                    onClick={() => setOpenDropdown(null)}
                                                >
                                                    <div className="text-sm font-medium text-white leading-none mb-1">
                                                        {subItem.name}
                                                    </div>
                                                    <p className="text-xs text-gray-400 leading-snug">
                                                        {subItem.description || "No description"}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="text-gray-400 text-xs md:text-sm px-4">
                    No categories found.
                </div>
            )}
        </nav>
    );
};

export default CustomDropdownMenu;
