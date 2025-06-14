
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

  // Dummy data for the new dropdowns
  const newCategoryItems = [
    { id: "item1", title: "Sub-Category 1", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item2", title: "Sub-Category 2", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item3", title: "Sub-Category 3", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item4", title: "Sub-Category 4", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item5", title: "Sub-Category 5", description: loremIpsumDescription.substring(0, 70) + "..." },
    { id: "item6", title: "Sub-Category 6", description: loremIpsumDescription.substring(0, 70) + "..." },
  ];

  // Category trigger text, white with no button styling
  const triggerClassName =
    "bg-transparent text-white hover:text-blue-300 focus:text-blue-300 px-4 py-2 font-medium transition-none cursor-pointer rounded-none shadow-none";

  return (
    <nav className="bg-black text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold hover:opacity-80 transition-opacity"
        >
          wodagoat
        </Link>
        {/* Centered Navigation Menu */}
        <div className="flex-grow flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClassName}>
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] bg-blue-800 text-white rounded-lg shadow-lg">
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
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-blue-800 text-white rounded-lg shadow-lg">
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
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-blue-800 text-white rounded-lg shadow-lg">
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
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-blue-800 text-white rounded-lg shadow-lg">
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
        <div className="flex items-center space-x-4">
          <Link
            to="/signup"
            className="rounded-[13px] border border-blue-500 bg-blue-600 text-white font-semibold text-base px-6 py-2 transition-colors shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ letterSpacing: "1px" }}
          >
            SIGN UP
          </Link>
          <Link
            to="/login"
            className="rounded-[13px] border border-blue-500 bg-gray-200 text-black font-semibold text-base px-6 py-2 transition-colors shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-blue-700 focus:text-white",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;

