import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserCog, Users, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useUserRoles } from "@/hooks/useUserRoles";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { data: userRoles } = useUserRoles();
  
  const isAdmin = userRoles?.some(role => role.role === 'admin');
  const isModerator = userRoles?.some(role => role.role === 'moderator');

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user?.full_name || "User Avatar"} />
            <AvatarFallback>{user?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
