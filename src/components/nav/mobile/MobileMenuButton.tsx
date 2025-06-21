
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="lg:hidden h-10 w-10 p-0 hover:bg-white/10 text-white"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export default MobileMenuButton;
