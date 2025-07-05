
import React from "react";
import { Link } from "react-router-dom";
import { Home, Rss, FileQuestion } from "lucide-react";
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
  return (
    <div className="border-b border-white/20 pb-6 mb-6">
      <h3 className="text-white text-sm font-semibold mb-4 px-6">Navigation</h3>
      <div className="space-y-2">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors" 
          onClick={onLinkClick}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link 
          to="/feed" 
          className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors" 
          onClick={onLinkClick}
        >
          <Rss className="h-5 w-5" />
          <span>Feed</span>
        </Link>
        <Link 
          to="/quiz" 
          className="flex items-center gap-3 px-6 py-3 text-white hover:bg-white/10 transition-colors" 
          onClick={onLinkClick}
        >
          <FileQuestion className="h-5 w-5 text-fuchsia-400" />
          <span className="font-bold text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text">Quiz</span>
        </Link>
      </div>
    </div>
  );
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
        <div className="overflow-y-auto h-full pb-24 pt-8" style={{ maxHeight: 'calc(100vh - 88px)' }}>
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
