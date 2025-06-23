
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, UserCog, Users, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const UserMenu = () => {
  const { user, profile, isAdmin, isModerator, logout } = useAuth();

  if (!user) return null;

  // Get display name from profile or user metadata
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={`${displayName} Avatar`} />
            <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        {(isAdmin || isModerator) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/admin/users" className="cursor-pointer">
                    <UserCog className="mr-2 h-4 w-4" />
                    User Management
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/athletes" className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    Athlete Management
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/quiz" className="cursor-pointer">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Quiz
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {isModerator && !isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/admin/users" className="cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
