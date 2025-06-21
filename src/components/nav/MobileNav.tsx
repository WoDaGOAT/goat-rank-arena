import React, { useState } from "react";
import { Menu, X, Rss, FileQuestion, Trophy, CircleUser, UserPlus, LogIn, Info, Mail, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId);
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
      <div 
        className={`fixed inset-0 lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ 
          zIndex: 999999,
          isolation: 'isolate'
        }}
      >
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black backdrop-blur-md"
          onClick={() => setIsOpen(false)}
          style={{ 
            zIndex: 1,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
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
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/80">
            <h2 className="text-2xl font-bold text-white">WoDaGOAT Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-12 w-12 p-0 text-white hover:bg-slate-700 rounded-full border border-slate-600"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Scrollable menu content */}
          <div className="overflow-y-auto h-full pb-24 px-6 pt-8" style={{ maxHeight: 'calc(100vh - 88px)' }}>
            {/* Main Navigation Section */}
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Navigate</h3>
              
              <div className="space-y-3">
                <Link
                  to="/feed"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600">
                    <Rss className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-white block">Feed</span>
                    <span className="text-sm text-slate-300">Latest rankings & discussions</span>
                  </div>
                </Link>

                <Link
                  to="/quiz"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-600">
                    <FileQuestion className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent block">Quiz</span>
                    <span className="text-sm text-slate-300">Test your sports knowledge</span>
                  </div>
                </Link>

                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-600"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-600">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-white block">Daily Ranking</span>
                    <span className="text-sm text-slate-300">Today's featured GOAT debate</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Categories Section with Collapsible */}
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Categories</h3>
              
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <Collapsible 
                      open={isCategoryExpanded(item.id)} 
                      onOpenChange={() => toggleCategory(item.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center justify-between text-lg font-bold text-white bg-slate-800 p-3 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                          <span>{item.name}</span>
                          {isCategoryExpanded(item.id) ? (
                            <ChevronDown className="h-5 w-5 text-slate-300" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-300" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 ml-4 mt-3">
                        {item.children?.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={`/category/${subItem.id}`}
                            onClick={handleLinkClick}
                            className="block p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors border border-slate-700"
                          >
                            <div className="text-base font-semibold text-white">
                              {subItem.name}
                            </div>
                            <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                              {subItem.description || "Rank the greatest athletes"}
                            </p>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </div>

            {/* User Section */}
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Account</h3>
              
              <div className="space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={handleLinkClick}
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
                      onClick={() => handleAuthAction('signup')}
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
                      onClick={() => handleAuthAction('login')}
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

            {/* Support Section */}
            <div className="space-y-6 border-t border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Support</h3>
              
              <div className="space-y-3">
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
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

            {/* Bottom padding for safe scrolling */}
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
