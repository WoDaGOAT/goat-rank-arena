
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
        <>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">
                        Or continue with
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white" onClick={() => handleOAuthLogin('google')}>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Google
                </Button>
                <Button variant="outline" className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600 text-white" onClick={() => handleOAuthLogin('facebook')}>
                    <Facebook className="mr-2 h-5 w-5 text-[#1877F2]" />
                    Facebook
                </Button>
            </div>
        </>
    );
};

export default SocialLogins;
