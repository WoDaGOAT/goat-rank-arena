
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, User } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const UserMenu = () => {
  const { user, profile, isAdmin } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase!.auth.signOut();
    if (error) {
      toast.error("Failed to log out: " + error.message);
    } else {
      toast.success("Logged out successfully.");
    }
  };

  const userInitial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 focus:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            <Avatar className="h-8 w-8 md:h-9 md:w-9">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gray-700 text-white">{userInitial.toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 text-white border-gray-700" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
              <p className="text-xs leading-none text-gray-400">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer hover:bg-gray-800">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-900/50">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isAdmin && (
        <Badge variant="premium" className="absolute -top-1.5 -right-3 pointer-events-none">
          Admin
        </Badge>
      )}
    </div>
  );
};

export default UserMenu;
