
import { useAuth } from '@/contexts/AuthContext';
import { CircleUser, LogOut, ShieldCheck, MessageSquareWarning, Wrench } from "lucide-react";
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { sanitize } from '@/lib/sanitize';

const UserMenu = () => {
  const { user, profile, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full p-0 hover:bg-white/10"
        >
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
            <AvatarImage src={profile.avatar_url || undefined} alt={sanitize(profile.full_name) || 'User'} />
            <AvatarFallback className="text-xs sm:text-sm lg:text-base">
              {profile.full_name ? sanitize(profile.full_name.charAt(0)) : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{sanitize(profile.full_name)}</p>
            <p className="text-xs leading-none text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-800">
            <Link to="/profile">
              <CircleUser className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuLabel className="text-xs text-gray-400 px-2">Admin Panel</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-800">
                <Link to="/admin/users">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>User Management</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-800">
                <Link to="/admin/quizzes/new">
                  <Wrench className="mr-2 h-4 w-4" />
                  <span>Create Quiz</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-800">
                <Link to="/admin/comments">
                    <MessageSquareWarning className="mr-2 h-4 w-4" />
                    <span>Comment Moderation</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:bg-red-500/20 focus:text-red-300">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
