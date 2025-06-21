
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

      {/* Full-screen mobile menu overlay */}
      <div className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu panel - full screen slide from top */}
        <div className={`absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 p-0 text-white hover:bg-white/10 rounded-full"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Menu content - scrollable */}
          <div className="overflow-y-auto h-full pb-24 px-6 pt-8">
            {/* Main Navigation Section */}
            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Main Navigation</h3>
              
              <div className="space-y-4">
                <Link
                  to="/feed"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Rss className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white block">Feed</span>
                    <span className="text-sm text-purple-200">Latest rankings & discussions</span>
                  </div>
                </Link>

                <Link
                  to="/quiz"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 group-hover:scale-105 transition-transform">
                    <FileQuestion className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent block">Quiz</span>
                    <span className="text-sm text-purple-200">Test your sports knowledge</span>
                  </div>
                </Link>

                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white block">Daily Ranking</span>
                    <span className="text-sm text-purple-200">Today's featured GOAT debate</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-6 mb-12">
              <h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Categories</h3>
              
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">
                      {item.name}
                    </h4>
                    <div className="space-y-2 ml-4">
                      {item.children?.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={`/category/${subItem.id}`}
                          onClick={handleLinkClick}
                          className="block p-3 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="text-base font-medium text-white">
                            {subItem.name}
                          </div>
                          <p className="text-sm text-purple-200 mt-1 line-clamp-2">
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
              <h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Account</h3>
              
              <div className="space-y-4">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={handleLinkClick}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <CircleUser className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-medium text-white block">Profile</span>
                        <span className="text-sm text-purple-200">{profile?.full_name || 'Manage your account'}</span>
                      </div>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/20 transition-colors group w-full text-left"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                        <X className="h-6 w-6 text-red-300" />
                      </div>
                      <div>
                        <span className="text-lg font-medium text-red-300 block">Sign Out</span>
                        <span className="text-sm text-red-200">Log out of your account</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthAction('signup')}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group w-full text-left"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors">
                        <UserPlus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-medium text-white block">Sign Up</span>
                        <span className="text-sm text-purple-200">Create your WoDaGOAT account</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAuthAction('login')}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group w-full text-left"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                        <LogIn className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-medium text-white block">Log In</span>
                        <span className="text-sm text-purple-200">Access your account</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Support Section */}
            <div className="space-y-6 border-t border-white/10 pt-8">
              <h3 className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Support</h3>
              
              <div className="space-y-4">
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white block">Contact</span>
                    <span className="text-sm text-purple-200">Get in touch with us</span>
                  </div>
                </Link>
                
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white block">About</span>
                    <span className="text-sm text-purple-200">Learn about WoDaGOAT</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white block">Help</span>
                    <span className="text-sm text-purple-200">FAQ and support docs</span>
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
