
import React, { useState } from "react";
import { Menu, X, Rss, FileQuestion, Trophy, CircleUser, UserPlus, LogIn, Info, Mail, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import LoginDialog from "@/components/auth/LoginDialog";
import SignupDialog from "@/components/auth/SignupDialog";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  children?: Category[];
}

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const { user, logout, profile } = useAuth();

  const { data: allCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Build parent-child tree
  const menuItems = React.useMemo(() => {
    if (!allCategories) return [];
    
    const categoriesById = new Map(allCategories.map(c => [c.id, { ...c, children: [] as Category[] }]));
    const rootCategories: (Category & { children: Category[] })[] = [];
    
    allCategories.forEach(category => {
      if (category.parent_id) {
        const parent = categoriesById.get(category.parent_id);
        if (parent) {
          parent.children.push(categoriesById.get(category.id)!);
        }
      } else {
        rootCategories.push(categoriesById.get(category.id)!);
      }
    });

    const desiredOrder = ['GOAT', 'Current GOAT', 'GOAT of my Time', 'Competitions'];
    rootCategories.sort((a, b) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));
    
    return rootCategories;
  }, [allCategories]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    setIsOpen(false);
    if (action === 'login') {
      setLoginOpen(true);
    } else {
      setSignupOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="lg:hidden h-10 w-10 p-0 hover:bg-white/10 text-white"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Full-screen mobile menu overlay - Fixed positioning and stronger background */}
      <div className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Background overlay - Darker and more prominent */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu panel - Stronger background with better contrast */}
        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          {/* Header with close button - More prominent styling */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-black/20">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-12 w-12 p-0 text-white hover:bg-white/20 rounded-full border border-white/30"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </Button>
          </div>

          {/* Menu content - Enhanced visibility and contrast */}
          <div className="overflow-y-auto h-full pb-24 px-6 pt-8 bg-gradient-to-b from-transparent to-black/10">
            {/* Main Navigation Section */}
            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Main Navigation</h3>
              
              <div className="space-y-4">
                <Link
                  to="/feed"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 group-hover:bg-blue-500 transition-colors shadow-lg">
                    <Rss className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-white block">Feed</span>
                    <span className="text-sm text-indigo-200">Latest rankings & discussions</span>
                  </div>
                </Link>

                <Link
                  to="/quiz"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 group-hover:scale-105 transition-transform shadow-lg">
                    <FileQuestion className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent block">Quiz</span>
                    <span className="text-sm text-indigo-200">Test your sports knowledge</span>
                  </div>
                </Link>

                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-600 group-hover:bg-amber-500 transition-colors shadow-lg">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-white block">Daily Ranking</span>
                    <span className="text-sm text-indigo-200">Today's featured GOAT debate</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Categories</h3>
              
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <h4 className="text-xl font-bold text-white bg-white/10 p-3 rounded-lg border border-white/20">
                      {item.name}
                    </h4>
                    <div className="space-y-2 ml-4">
                      {item.children?.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={`/category/${subItem.id}`}
                          onClick={handleLinkClick}
                          className="block p-4 rounded-lg bg-white/5 hover:bg-white/15 transition-colors border border-white/10"
                        >
                          <div className="text-lg font-semibold text-white">
                            {subItem.name}
                          </div>
                          <p className="text-sm text-indigo-200 mt-1 line-clamp-2">
                            {subItem.description || "Rank the greatest athletes"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Section */}
            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Account</h3>
              
              <div className="space-y-4">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={handleLinkClick}
                      className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 group-hover:bg-green-500 transition-colors shadow-lg">
                        <CircleUser className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold text-white block">Profile</span>
                        <span className="text-sm text-indigo-200">{profile?.full_name || 'Manage your account'}</span>
                      </div>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 p-5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 group w-full text-left border border-red-400/30"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors shadow-lg">
                        <X className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold text-red-200 block">Sign Out</span>
                        <span className="text-sm text-red-300">Log out of your account</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthAction('signup')}
                      className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group w-full text-left border border-white/10"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 group-hover:bg-blue-500 transition-colors shadow-lg">
                        <UserPlus className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold text-white block">Sign Up</span>
                        <span className="text-sm text-indigo-200">Create your WoDaGOAT account</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAuthAction('login')}
                      className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group w-full text-left border border-white/10"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 group-hover:bg-purple-500 transition-colors shadow-lg">
                        <LogIn className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-semibold text-white block">Log In</span>
                        <span className="text-sm text-indigo-200">Access your account</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Support Section */}
            <div className="space-y-6 border-t border-white/20 pt-8">
              <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Support</h3>
              
              <div className="space-y-4">
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-600 group-hover:bg-teal-500 transition-colors shadow-lg">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-white block">Contact</span>
                    <span className="text-sm text-indigo-200">Get in touch with us</span>
                  </div>
                </Link>
                
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-600 group-hover:bg-slate-500 transition-colors shadow-lg">
                    <Info className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-white block">About</span>
                    <span className="text-sm text-indigo-200">Learn about WoDaGOAT</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/15 transition-all duration-200 group border border-white/10">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-600 group-hover:bg-orange-500 transition-colors shadow-lg">
                    <HelpCircle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-white block">Help</span>
                    <span className="text-sm text-indigo-200">FAQ and support docs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer spacing */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>

      {/* Auth Dialogs */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupDialog>
        <div style={{ display: 'none' }} />
      </SignupDialog>
    </>
  );
};

export default MobileNav;
