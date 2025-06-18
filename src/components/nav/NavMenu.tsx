import React from "react";
import CustomDropdownMenu from "./CustomDropdownMenu";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
const NavMenu = () => {
  return <div className="flex-grow flex justify-center items-center gap-4 min-w-0">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors">
                
            </Link>
            <CustomDropdownMenu />
        </div>;
};
export default NavMenu;