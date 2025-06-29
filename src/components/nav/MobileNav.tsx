
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenuButton from "./mobile/MobileMenuButton";
import MobileMenuOverlay from "./mobile/MobileMenuOverlay";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openAuthDialog } = useAuth();

  const handleAuthAction = (action: 'login' | 'signup') => {
    setIsOpen(false);
    openAuthDialog(action);
  };

  return (
    <>
      <MobileMenuButton onClick={() => setIsOpen(true)} />
      
      <MobileMenuOverlay 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onAuthAction={handleAuthAction}
      />
    </>
  );
};

export default MobileNav;
