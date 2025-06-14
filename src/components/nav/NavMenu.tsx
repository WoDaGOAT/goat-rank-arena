
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ListItem component as used in Shadcn examples, adapted for react-router Link
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to || "#"}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 md:p-3 leading-none no-underline outline-none transition-colors focus:bg-gray-700 focus:text-white text-xs md:text-sm",
            className
          )}
          {...props}
        >
          <div className="text-xs md:text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-xs md:text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

interface Category {
    id: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    children?: Category[];
}

const NavMenu = () => {
    const { data: allCategories, isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
          const { data, error } = await supabase.from('categories').select('*');
          if (error) {
            console.error('Error fetching categories:', error);
            // toast.error("Failed to load navigation categories.");
            return [];
          }
          return data || [];
        },
    });
    
    const menuItems = React.useMemo(() => {
        if (!allCategories) return [];
        
        const categoriesById = new Map(allCategories.map(c => [c.id, { ...c, children: [] as Category[] }]));
      
        const rootCategories: (Category & { children: Category[] })[] = [];
      
        allCategories.forEach(category => {
          if (category.parent_id) {
            const parent = categoriesById.get(category.parent_id);
            if (parent) {
              const childWithChildren = categoriesById.get(category.id);
              if (childWithChildren) {
                parent.children.push(childWithChildren);
              }
            }
          } else {
            const rootCategory = categoriesById.get(category.id);
            if (rootCategory) {
              rootCategories.push(rootCategory);
            }
          }
        });
        
        const desiredOrder = ['GOAT', 'Current GOAT', 'GOAT of my Time', 'Competitions'];
        rootCategories.sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));
      
        return rootCategories;
    }, [allCategories]);

    const triggerClassName =
    "bg-transparent text-white px-1 md:px-4 py-1 md:py-2 font-medium transition-none cursor-pointer rounded-none shadow-none border-none " +
    "text-xs md:text-base whitespace-nowrap";

    if (isLoading) {
        return (
            <div className="flex-grow flex justify-center min-w-0 overflow-x-auto">
                <div className="flex flex-nowrap items-center justify-center gap-0 md:gap-4 min-w-0 px-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-8 w-24 bg-gray-700" />
                    ))}
                </div>
            </div>
        );
    }

  return (
    <div className="flex-grow flex justify-center min-w-0 overflow-x-auto">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-nowrap items-center justify-center gap-0 md:gap-1 min-w-0">
          {menuItems.map((item) => (
             <NavigationMenuItem key={item.id}>
                <NavigationMenuTrigger className={triggerClassName}>
                  {item.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                    {(item.children && item.children.length > 0) ? (
                        <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-black text-white rounded-lg shadow-lg z-40">
                            {item.children.map((subItem) => (
                            <ListItem
                                key={subItem.id}
                                to={`/category/${subItem.id}`}
                                title={subItem.name}
                                className="text-white hover:bg-gray-800"
                            >
                                {subItem.description}
                            </ListItem>
                            ))}
                        </ul>
                    ) : (
                        <div className="w-[180px] p-4 text-center text-gray-400 bg-black text-white rounded-lg shadow-lg z-40">No sub-categories defined.</div>
                    )}
                </NavigationMenuContent>
             </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavMenu;
