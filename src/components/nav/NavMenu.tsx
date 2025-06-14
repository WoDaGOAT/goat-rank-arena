import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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

const NavMenu = () => {
    const loremIpsumDescription =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  const newCategoryItems = [
    { id: "item1", title: "Sub-Category 1", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item2", title: "Sub-Category 2", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item3", title: "Sub-Category 3", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item4", title: "Sub-Category 4", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item5", title: "Sub-Category 5", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item6", title: "Sub-Category 6", description: loremIpsumDescription.substring(0, 70) + "..." },
  ];

  const triggerClassName =
    "bg-transparent text-white px-1 md:px-4 py-1 md:py-2 font-medium transition-none cursor-pointer rounded-none shadow-none border-none " +
    "text-xs md:text-base whitespace-nowrap";

  return (
    <div className="flex-grow flex justify-center min-w-0 overflow-x-auto">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-nowrap items-center justify-center gap-0 md:gap-1 min-w-0">
          <NavigationMenuItem>
            <NavigationMenuTrigger className={triggerClassName}>
              GOAT
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-black text-white rounded-lg shadow-lg z-40">
                {newCategoryItems.map((item) => (
                  <ListItem
                    key={`goat-${item.id}`}
                    to="#"
                    title={item.title}
                    className="text-white hover:bg-gray-800"
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={triggerClassName}>
              Current GOAT
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-black text-white rounded-lg shadow-lg z-40">
                {newCategoryItems.map((item) => (
                  <ListItem
                    key={`current-goat-${item.id}`}
                    to="#"
                    title={item.title}
                    className="text-white hover:bg-gray-800"
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={triggerClassName}>
              GOAT of my Time
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-black text-white rounded-lg shadow-lg z-40">
                {newCategoryItems.map((item) => (
                  <ListItem
                    key={`my-time-goat-${item.id}`}
                    to="#"
                    title={item.title}
                    className="text-white hover:bg-gray-800"
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={triggerClassName}>
              Competitions
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-black text-white rounded-lg shadow-lg z-40">
                {newCategoryItems.map((item) => (
                  <ListItem
                    key={`competitions-${item.id}`}
                    to="#"
                    title={item.title}
                    className="text-white hover:bg-gray-800"
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavMenu;
