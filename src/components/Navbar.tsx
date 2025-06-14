import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { mockCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";
import React from "react";

const Navbar = () => {
  const loremIpsumDescription =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  // Dummy data for dropdowns
  const newCategoryItems = [
    { id: "item1", title: "Sub-Category 1", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item2", title: "Sub-Category 2", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item3", title: "Sub-Category 3", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item4", title: "Sub-Category 4", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item5", title: "Sub-Category 5", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item6", title: "Sub-Category 6", description: loremIpsumDescription.substring(0, 70) + "..." },
  ];

  // Responsive: base is smaller font/spacing, md and up is normal.
  const triggerClassName =
    "bg-transparent text-white px-1 md:px-4 py-1 md:py-2 font-medium transition-none cursor-pointer rounded-none shadow-none border-none " +
    "text-xs md:text-base whitespace-nowrap";

  return (
    <nav className="bg-black text-primary-foreground p-2 sm:p-3 md:p-4 shadow-md w-full">
      <div className="container mx-auto flex flex-nowrap items-center justify-between gap-1 md:gap-2 overflow-x-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg md:text-2xl font-bold hover:opacity-80 transition-opacity whitespace-nowrap mr-2"
        >
          wodagoat
        </Link>

        {/* Centered Navigation Menu (with nowrap to keep on one line on small screens) */}
        <div className="flex-grow flex justify-center min-w-0 overflow-x-auto">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-nowrap items-center justify-center gap-0 md:gap-1 min-w-0">
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClassName}>
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[180px] gap-2 p-2 md:w-[400px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[500px] bg-blue-800 text-white rounded-lg shadow-lg z-40">
                    {mockCategories.map((category) => (
                      <ListItem
                        key={category.id}
                        to={`/category/${category.id}`}
                        title={category.name}
                        className="text-white hover:bg-blue-700"
                      >
                        {category.description.substring(0, 70) +
                          (category.description.length > 70 ? "..." : "")}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Main Category A */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClassName}>
                  Main Category A
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-blue-800 text-white rounded-lg shadow-lg z-40">
                    {newCategoryItems.map((item) => (
                      <ListItem
                        key={`a-${item.id}`}
                        to="#"
                        title={item.title}
                        className="text-white hover:bg-blue-700"
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Main Category B */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClassName}>
                  Main Category B
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-blue-800 text-white rounded-lg shadow-lg z-40">
                    {newCategoryItems.map((item) => (
                      <ListItem
                        key={`b-${item.id}`}
                        to="#"
                        title={item.title}
                        className="text-white hover:bg-blue-700"
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Main Category C */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClassName}>
                  Main Category C
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[180px] gap-2 p-2 md:w-[500px] md:gap-3 md:p-3 md:grid-cols-2 lg:w-[600px] bg-blue-800 text-white rounded-lg shadow-lg z-40">
                    {newCategoryItems.map((item) => (
                      <ListItem
                        key={`c-${item.id}`}
                        to="#"
                        title={item.title}
                        className="text-white hover:bg-blue-700"
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

        {/* Auth Buttons on the right */}
        <div className="flex items-center gap-1 md:gap-4 ml-2">
          <Link
            to="/signup"
            className={cn(
              "rounded-[9px] md:rounded-[13px] border border-white bg-blue-600 text-white font-semibold px-3 py-1 md:px-6 md:py-2 transition-colors shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300",
              "text-xs md:text-base",
            )}
            style={{ letterSpacing: "1px" }}
          >
            SIGN UP
          </Link>
          <Link
            to="/login"
            className={cn(
              "rounded-[9px] md:rounded-[13px] border border-blue-500 bg-gray-200 text-black font-semibold px-3 py-1 md:px-6 md:py-2 transition-colors shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300",
              "text-xs md:text-base"
            )}
            style={{ letterSpacing: "1px" }}
          >
            LOG IN
          </Link>
        </div>
      </div>
    </nav>
  );
};

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
            "block select-none space-y-1 rounded-md p-2 md:p-3 leading-none no-underline outline-none transition-colors focus:bg-blue-700 focus:text-white text-xs md:text-sm",
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

export default Navbar;
