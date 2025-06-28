
import React from "react";
import MobileMenuHeader from "./MobileMenuHeader";
import MobileMenuCategories from "./MobileMenuCategories";
import MobileMenuAccount from "./MobileMenuAccount";
import MobileMenuSupport from "./MobileMenuSupport";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthAction: (action: 'login' | 'signup') => void;
}

interface MobileMenuNavigationProps {
  onLinkClick: () => void;
}

const MobileMenuNavigation = ({ onLinkClick }: MobileMenuNavigationProps) => {
  // Component implementation would go here if this was a real component
  // For now, it's just a placeholder since we're fixing the props interface
  return null;
};

const MobileMenuOverlay = ({ isOpen, onClose, onAuthAction }: MobileMenuOverlayProps) => {
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 lg:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{ 
        zIndex: 999999,
        isolation: 'isolate'
      }}
    >
      {/* Enhanced backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
        style={{ 
          zIndex: 1,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.98)'
        }}
      />
      
      {/* Menu panel */}
      <div 
        className={`absolute inset-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          zIndex: 2,
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          backgroundColor: '#0f172a'
        }}
      >
        <MobileMenuHeader onClose={onClose} />

        {/* Scrollable menu content */}
        <div className="overflow-y-auto h-full pb-24 px-6 pt-8" style={{ maxHeight: 'calc(100vh - 88px)' }}>
          <MobileMenuNavigation onLinkClick={handleLinkClick} />
          <MobileMenuCategories onLinkClick={handleLinkClick} />
          <MobileMenuAccount onLinkClick={handleLinkClick} onAuthAction={onAuthAction} />
          <MobileMenuSupport onLinkClick={handleLinkClick} />

          {/* Bottom padding for safe scrolling */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuOverlay;
