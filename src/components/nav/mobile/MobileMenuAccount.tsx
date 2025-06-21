
import React from "react";
import { Link } from "react-router-dom";
import { CircleUser, UserPlus, LogIn, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuAccountProps {
  onLinkClick: () => void;
  onAuthAction: (action: 'login' | 'signup') => void;
}

const MobileMenuAccount = ({ onLinkClick, onAuthAction }: MobileMenuAccountProps) => {
  const { user, logout, profile } = useAuth();

  const handleLogout = async () => {
    await logout();
    onLinkClick();
  };

  return (
    <div className="space-y-6 mb-8">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Account</h3>
      
      <div className="space-y-3">
        {user ? (
          <>
            <Link
              to="/profile"
              onClick={onLinkClick}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600">
                <CircleUser className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white block">Profile</span>
                <span className="text-sm text-slate-300">{profile?.full_name || 'Manage your account'}</span>
              </div>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors w-full text-left border border-red-400/30"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600">
                <X className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-red-200 block">Sign Out</span>
                <span className="text-sm text-red-300">Log out of your account</span>
              </div>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onAuthAction('signup')}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors w-full text-left border border-slate-600"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white block">Sign Up</span>
                <span className="text-sm text-slate-300">Create your WoDaGOAT account</span>
              </div>
            </button>
            
            <button
              onClick={() => onAuthAction('login')}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors w-full text-left border border-slate-600"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white block">Log In</span>
                <span className="text-sm text-slate-300">Access your account</span>
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenuAccount;
