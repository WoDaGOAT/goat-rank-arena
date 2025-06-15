
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import AuthButtons from "./nav/AuthButtons";
import UserMenu from "./nav/UserMenu";
import Logo from "./nav/Logo";
import NavMenu from "./nav/NavMenu";
import NotificationBell from "./nav/NotificationBell";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm text-white sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo />
            <Link to="/feed" className="text-sm font-medium transition-colors hover:text-primary">
                Feed
            </Link>
            <NavMenu />
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
                    <Skeleton className="h-8 w-20 bg-gray-700" />
                </div>
            ) : user ? (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
