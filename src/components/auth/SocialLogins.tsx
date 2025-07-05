
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import GoogleIcon from "../icons/GoogleIcon";
import { Facebook } from 'lucide-react';

const SocialLogins = () => {
    const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
        const { error } = await supabase!.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
            },
        });

        if (error) {
            toast.error(`Failed to sign in with ${provider}: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col gap-3 xs:grid xs:grid-cols-2 xs:gap-4">
            <Button 
                variant="outline" 
                className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white h-10 text-sm" 
                onClick={() => handleOAuthLogin('google')}
            >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
            <Button 
                variant="outline" 
                className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white h-10 text-sm" 
                onClick={() => handleOAuthLogin('facebook')}
            >
                <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
                Facebook
            </Button>
        </div>
    );
};

export default SocialLogins;
