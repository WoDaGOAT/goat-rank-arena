
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle, // Import this if you want to style a Link like a trigger
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { mockCategories } from "@/data/mockData"; // Assuming mockCategories is exported from here
import { cn } from "@/lib/utils"; // For cn utility if using ListItem component approach
import React from "react"; // Import React for ListItem

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          wodagoat
        </Link>

        <div className="flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-primary hover:bg-primary/90 data-[active]:bg-primary/90 data-[state=open]:bg-primary/90 text-primary-foreground hover:text-primary-foreground focus:text-primary-foreground focus:bg-primary/90">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
                    {mockCategories.map((category) => (
                      <ListItem
                        key={category.id}
                        to={`/category/${category.id}`}
                        title={category.name}
                      >
                        {category.description.substring(0, 70) + (category.description.length > 70 ? "..." : "")}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* You can add more top-level navigation items here if needed */}
              {/* Example:
              <NavigationMenuItem>
                <Link to="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()  + " bg-primary hover:bg-primary/90 data-[active]:bg-primary/90 data-[state=open]:bg-primary/90 text-primary-foreground hover:text-primary-foreground focus:text-primary-foreground focus:bg-primary/90"}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              */}
            </NavigationMenuList>
          </NavigationMenu>

          <Button variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Log In
          </Button>
          <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Sign Up
          </Button>
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
          to={to}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
