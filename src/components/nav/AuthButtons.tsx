
import LoginDialog from "@/components/auth/LoginDialog";
import SignupDialog from "@/components/auth/SignupDialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import UserMenu from "./UserMenu";

const AuthButtons = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-8 w-20 md:h-9 md:w-24 animate-pulse rounded-md bg-white/10" />;
    }

    if (user) {
        return <UserMenu />;
    }

    return (
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 ml-2">
            {/* SIGN UP Button */}
            <SignupDialog>
                <button
                    className={cn(
                        "flex items-center justify-center rounded-[8px] md:rounded-[10px] border border-white bg-[#388BFF] font-bold transition-colors shadow hover:bg-[#236dda] focus:outline-none focus:ring-2 focus:ring-blue-300",
                        "text-xs sm:text-sm md:text-base whitespace-nowrap leading-none",
                        "tracking-wide",
                        "px-2 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2",
                        "min-w-[60px] sm:min-w-[70px] md:min-w-[80px] min-h-[28px] sm:min-h-[30px] md:min-h-[36px]"
                    )}
                    style={{ letterSpacing: "1px" }}
                >
                    <span className="block">
                        <span className="hidden sm:inline">SIGN&nbsp;UP</span>
                        <span className="inline sm:hidden">SIGN UP</span>
                    </span>
                </button>
            </SignupDialog>
            {/* LOG IN Button */}
            <LoginDialog>
                <button
                    className={cn(
                        "flex items-center justify-center rounded-[8px] md:rounded-[10px] border border-[#388BFF] bg-transparent text-white font-bold transition-colors shadow hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300",
                        "text-xs sm:text-sm md:text-base whitespace-nowrap leading-none",
                        "tracking-wide",
                        "px-2 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2",
                        "min-w-[60px] sm:min-w-[70px] md:min-w-[80px] min-h-[28px] sm:min-h-[30px] md:min-h-[36px]"
                    )}
                    style={{ letterSpacing: "1px" }}
                >
                    <span className="block">
                        <span className="hidden sm:inline">LOG&nbsp;IN</span>
                        <span className="inline sm:hidden">LOG IN</span>
                    </span>
                </button>
            </LoginDialog>
        </div>
    );
};

export default AuthButtons;
