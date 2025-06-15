
import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "sonner";

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
            "block select-none space-y-1 rounded-md p-2 md:p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 focus:bg-gray-700 focus:text-white text-xs md:text-sm",
            className
          )}
          {...props}
        >
          <div className="text-xs md:text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-xs md:text-sm leading-snug text-gray-300">{children}</p>
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
    const queryClient = useQueryClient();
    const { data: allCategories, isLoading, isError } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
          const { data, error } = await supabase.from('categories').select('*');
          if (error) {
            toast.error("Failed to load navigation categories.");
            throw new Error(error.message);
          }
          return data || [];
        },
        retry: 1,
        staleTime: 0, // Always refetch
        refetchOnMount: true,
    });

    // 1. Build parent-child tree
    const menuItems = React.useMemo(() => {
        if (!allCategories) return [];
        // Build id => { ...category, children: [] } for fast lookup
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

        // Sort roots by desired order
        const desiredOrder = ['GOAT', 'Current GOAT', 'GOAT of my Time', 'Competitions'];
        rootCategories.sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));
        return rootCategories;
    }, [allCategories]);

    const triggerClassName =
      "bg-transparent text-white px-1 md:px-4 py-1 md:py-2 font-medium transition-colors cursor-pointer rounded-none shadow-none border-none " +
      "text-xs md:text-base whitespace-nowrap hover:text-gray-300 data-[state=open]:text-white data-[active]:text-white";

    if (isLoading) {
        return (
            <div className="flex-grow flex justify-center min-w-0">
                <div className="flex flex-nowrap items-center justify-center gap-0 md:gap-4 min-w-0 px-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-8 w-24 bg-gray-700" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-grow flex justify-center items-center min-w-0">
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
        <NavigationMenu className="relative z-[100]">
            <NavigationMenuList className="flex flex-nowrap items-center justify-center gap-0 md:gap-1 min-w-0">
                {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <NavigationMenuItem key={item.id} className="relative">
                            <NavigationMenuTrigger className={triggerClassName}>
                                {item.name}
                                {item.children && item.children.length > 0 && (
                                  <span className="ml-1 text-xs text-primary-400">
                                    ({item.children.length})
                                  </span>
                                )}
                            </NavigationMenuTrigger>
                            {item.children && item.children.length > 0 && (
                                <NavigationMenuContent
                                    className={cn(
                                        "bg-black border border-gray-700 text-white shadow-xl rounded-md z-[2000]",
                                        "absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[320px] max-w-[420px] md:min-w-[340px] md:w-auto p-0"
                                    )}
                                    style={{
                                        backgroundColor: "#11151C",
                                        color: "#fff",
                                        border: "1px solid #333",
                                        zIndex: 2000,
                                    }}
                                >
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                                        {item.children.map((subItem) => (
                                            <ListItem
                                                key={subItem.id}
                                                to={`/category/${subItem.id}`}
                                                title={subItem.name}
                                                className="text-white hover:bg-gray-800 border border-gray-700 rounded-md"
                                            >
                                                {subItem.description || "No description"}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            )}
                        </NavigationMenuItem>
                    ))
                ) : (
                    <div className="text-gray-400 text-xs md:text-sm px-4">
                        No categories found.
                    </div>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default NavMenu;
