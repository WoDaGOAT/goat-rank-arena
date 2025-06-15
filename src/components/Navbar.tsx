
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import AuthButtons from "./nav/AuthButtons";
import UserMenu from "./nav/UserMenu";
import Logo from "./nav/Logo";
import NavMenu from "./nav/NavMenu";
import NotificationBell from "./nav/NotificationBell";
import { Link } from "react-router-dom";
import { Rss, FileQuestion, Wrench, Users } from "lucide-react";

const Navbar = () => {
  const { user, loading, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm text-gray-200 border-b border-gray-700/50">
      <div className="relative container mx-auto px-4">
        {/* Logo absolutely positioned to span both rows */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Logo />
        </div>

        {/* Main content with padding to avoid logo */}
        <div className="pl-28 md:pl-36 flex flex-col">
          {/* Top Row: Links and Auth */}
          <div className="flex items-center justify-end h-16">
            <div className="flex items-center gap-2 md:gap-4 text-base font-medium">
              <Link
                to="/feed"
                className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
              >
                <Rss className="h-5 w-5" />
                <span>Feed</span>
              </Link>
              <Link
                to="/quiz"
                className="bg-transparent focus:bg-white/10 px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2 group"
              >
                <FileQuestion className="h-5 w-5" />
                <span className="font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent transition-all group-hover:[filter:brightness(1.2)]">
                  Quiz
                </span>
              </Link>
              
              {isAdmin && (
                <>
                  <Link
                    to="/admin/create-quiz"
                    className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
                  >
                    <Wrench className="h-5 w-5" />
                    <span>Create Quiz</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="bg-transparent hover:bg-white/10 focus:bg-white/10 px-4 py-2 rounded-md transition-colors focus:outline-none flex items-center gap-2"
                  >
                    <Users className="h-5 w-5" />
                    <span>Manage Users</span>
                  </Link>
                </>
              )}

              <div className="h-6 w-px bg-gray-700 mx-2 hidden md:block" />

              {loading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full bg-secondary" />
                  <Skeleton className="h-8 w-20 bg-secondary" />
                </div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <UserMenu />
                </div>
              ) : (
                <AuthButtons />
              )}
            </div>
          </div>
          {/* Bottom Row: Categories */}
          <div className="flex items-center justify-center h-12 border-t border-gray-700/50">
            <NavMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
