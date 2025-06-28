import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileQuestion,
  Home,
  ListChecks,
  MessageCircle,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

const MobileMenuNavigation = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const onItemClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-background text-foreground">
        <SheetHeader className="space-y-2.5">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explore the app and manage your account.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          {user ? (
            <div className="flex items-center justify-between px-4">
              <Link
                to="/profile"
                className="flex items-center gap-3 group overflow-hidden"
              >
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                  <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="font-semibold text-white group-hover:underline truncate">{user.full_name || 'Anonymous User'}</p>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
              </Link>
              <Button variant="secondary" size="sm" onClick={() => signOut(() => navigate('/'))}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-4">
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 py-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/feed" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
            <ListChecks className="h-5 w-5" />
            <span>Feed</span>
          </Link>
        </div>

        {isAdmin && (
          <div className="border-t border-white/20 pt-4">
            <h3 className="text-yellow-300 text-sm font-semibold mb-3 px-4">Admin</h3>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <Link to="/admin/athletes" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
              <Trophy className="h-5 w-5" />
              <span>Athletes</span>
            </Link>
            <Link to="/admin/comments" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
              <MessageCircle className="h-5 w-5" />
              <span>Comments</span>
            </Link>
            <Link to="/admin/create-quiz" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
              <FileQuestion className="h-5 w-5" />
              <span>Create Quiz</span>
            </Link>
            <Link to="/admin/analytics" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          </div>
        )}

        <div className="border-t border-white/20 mt-4 pt-4">
          <Link to="/contact" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
            <MessageCircle className="h-5 w-5" />
            <span>Contact</span>
          </Link>
          <Link to="/privacy-policy" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
            <Settings className="h-5 w-5" />
            <span>Privacy Policy</span>
          </Link>
          <Link to="/gdpr" className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors" onClick={onItemClick}>
            <Settings className="h-5 w-5" />
            <span>GDPR</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuNavigation;
