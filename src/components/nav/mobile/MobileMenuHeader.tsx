
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuHeaderProps {
  onClose: () => void;
}

const MobileMenuHeader = ({ onClose }: MobileMenuHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/80">
      <h2 className="text-2xl font-bold text-white">WoDaGOAT Menu</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-12 w-12 p-0 text-white hover:bg-slate-700 rounded-full border border-slate-600"
        aria-label="Close menu"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MobileMenuHeader;
