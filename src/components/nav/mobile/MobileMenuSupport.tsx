
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Info, HelpCircle } from "lucide-react";

interface MobileMenuSupportProps {
  onLinkClick: () => void;
}

const MobileMenuSupport = ({ onLinkClick }: MobileMenuSupportProps) => {
  return (
    <div className="space-y-6 border-t border-slate-700 pt-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Support</h3>
      
      <div className="space-y-3">
        <Link
          to="/contact"
          onClick={onLinkClick}
          className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-600">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white block">Contact</span>
            <span className="text-sm text-slate-300">Get in touch with us</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-600">
            <Info className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white block">About</span>
            <span className="text-sm text-slate-300">Learn about WoDaGOAT</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-600">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-white block">Help</span>
            <span className="text-sm text-slate-300">FAQ and support docs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuSupport;
