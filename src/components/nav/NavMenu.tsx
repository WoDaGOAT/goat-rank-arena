
import React from "react";
import CustomDropdownMenu from "./CustomDropdownMenu";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NavMenu = () => {
  return (
    <div className="w-full">
      <CustomDropdownMenu />
    </div>
  );
};

export default NavMenu;
