
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import SocialLogins from "./SocialLogins";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

const AuthDialog = ({ open, onOpenChange, defaultMode = 'login' }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    }
  }, [open]);

  // Reset mode to default when dialog opens
  useEffect(() => {
    if (open) {
      setMode(defaultMode);
    }
  }, [open, defaultMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast.error("Passwords don't match");
          setIsLoading(false);
          return;
        }

        // Sign up with email redirect
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Try logging in instead.");
            setMode('login');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Please check your email to confirm your account!");
          onOpenChange(false);
        }
      } else {
        // Login
        const { error } = await signIn({ email, password });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Successfully logged in!");
          onOpenChange(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] mx-4 sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome back to WoDaGOAT!' : 'Join WoDaGOAT!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SocialLogins />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:opacity-90" 
              disabled={isLoading}
            >
              {isLoading 
                ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') 
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-gray-400 hover:text-cyan-400 underline"
              disabled={isLoading}
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"
              }
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
