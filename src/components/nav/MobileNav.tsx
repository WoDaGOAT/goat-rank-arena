
import React, { useState } from "react";
import LoginDialog from "@/components/auth/LoginDialog";
import SignupDialog from "@/components/auth/SignupDialog";
import MobileMenuButton from "./mobile/MobileMenuButton";
import MobileMenuOverlay from "./mobile/MobileMenuOverlay";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleAuthAction = (action: 'login' | 'signup') => {
    setIsOpen(false);
    if (action === 'login') {
      setLoginOpen(true);
    } else {
      setSignupOpen(true);
    }
  };

  return (
    <>
      <MobileMenuButton onClick={() => setIsOpen(true)} />
      
      <MobileMenuOverlay 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onAuthAction={handleAuthAction}
      />

      {/* Auth Dialogs */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupDialog>
        <div style={{ display: 'none' }} />
      </SignupDialog>
    </>
  );
};

export default MobileNav;
