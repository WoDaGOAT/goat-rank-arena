
import React, { useState } from "react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import LoginDialog from "@/components/auth/LoginDialog";
import SignupDialog from "@/components/auth/SignupDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const SimpleAuthButtons = () => {
  const { user, loading, signOut } = useSimpleAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  console.log('🔐 SimpleAuthButtons render:', { user: !!user, loading });

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 animate-pulse rounded-md bg-white/10" />
      </div>
    );
  }

  if (user) {
    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    const avatarUrl = user.user_metadata?.avatar_url;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={`${displayName} Avatar`} />
              <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setSignupOpen(true)}
          className="bg-[#388BFF] hover:bg-[#236dda] text-white px-4 py-2 text-sm font-semibold"
        >
          SIGN UP
        </Button>
        
        <Button
          onClick={() => setLoginOpen(true)}
          variant="outline"
          className="border-[#388BFF] text-white hover:bg-white/10 px-4 py-2 text-sm font-semibold"
        >
          LOG IN
        </Button>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <SignupDialog open={signupOpen} onOpenChange={setSignupOpen} />
    </>
  );
};

export default SimpleAuthButtons;
