
import LoginDialog from "@/components/auth/LoginDialog";
import SignupDialog from "@/components/auth/SignupDialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import UserMenu from "./UserMenu";

const AuthButtons = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-8 w-20 sm:h-9 sm:w-24 lg:h-10 lg:w-28 animate-pulse rounded-md bg-white/10" />;
    }

    if (user) {
        return <UserMenu />;
    }

    return (
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
            {/* SIGN UP Button */}
            <SignupDialog>
                <button
                    className={cn(
                        "flex items-center justify-center rounded-[6px] sm:rounded-[8px] lg:rounded-[10px] border border-white bg-[#388BFF] font-bold transition-colors shadow hover:bg-[#236dda] focus:outline-none focus:ring-2 focus:ring-blue-300 text-white",
                        "text-xs sm:text-sm lg:text-base whitespace-nowrap leading-none",
                        "tracking-wide",
                        // Mobile first sizing - very compact
                        "px-2 py-1.5 min-w-[50px] min-h-[32px]",
                        // Small mobile
                        "xs:px-2.5 xs:py-1.5 xs:min-w-[55px] xs:min-h-[34px]",
                        // Large mobile
                        "sm:px-3 sm:py-2 sm:min-w-[70px] sm:min-h-[36px]",
                        // Tablet and up
                        "lg:px-6 lg:py-2.5 lg:min-w-[80px] lg:min-h-[40px]"
                    )}
                    style={{ letterSpacing: "0.5px" }}
                >
                    <span className="block font-semibold">
                        <span className="hidden xs:inline">SIGN UP</span>
                        <span className="inline xs:hidden">SIGN</span>
                    </span>
                </button>
            </SignupDialog>
            
            {/* LOG IN Button */}
            <LoginDialog>
                <button
                    className={cn(
                        "flex items-center justify-center rounded-[6px] sm:rounded-[8px] lg:rounded-[10px] border border-[#388BFF] bg-transparent text-white font-bold transition-colors shadow hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300",
                        "text-xs sm:text-sm lg:text-base whitespace-nowrap leading-none",
                        "tracking-wide",
                        // Mobile first sizing - very compact
                        "px-2 py-1.5 min-w-[50px] min-h-[32px]",
                        // Small mobile
                        "xs:px-2.5 xs:py-1.5 xs:min-w-[55px] xs:min-h-[34px]",
                        // Large mobile
                        "sm:px-3 sm:py-2 sm:min-w-[70px] sm:min-h-[36px]",
                        // Tablet and up
                        "lg:px-6 lg:py-2.5 lg:min-w-[80px] lg:min-h-[40px]"
                    )}
                    style={{ letterSpacing: "0.5px" }}
                >
                    <span className="block font-semibold">
                        <span className="hidden xs:inline">LOG IN</span>
                        <span className="inline xs:hidden">LOG</span>
                    </span>
                </button>
            </LoginDialog>
        </div>
    );
};

export default AuthButtons;
