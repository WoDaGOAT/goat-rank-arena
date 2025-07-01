
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import UserMenu from "./UserMenu";

const AuthButtons = () => {
    const { user, loading, openAuthDialog } = useAuth();

    if (loading) {
        return <div className="h-8 w-20 animate-pulse rounded-md bg-white/10" />;
    }

    if (user) {
        return <UserMenu />;
    }

    return (
        <div className="flex items-center gap-1 min-[375px]:gap-2">
            {/* Always horizontal layout with responsive sizing */}
            <div className="flex items-center gap-1 min-[375px]:gap-2">
                {/* SIGN UP Button */}
                <button
                    onClick={() => openAuthDialog('signup')}
                    className={cn(
                        "flex items-center justify-center rounded-md border border-white bg-[#388BFF] font-bold transition-colors shadow hover:bg-[#236dda] focus:outline-none focus:ring-2 focus:ring-blue-300 text-white",
                        "leading-none tracking-wide whitespace-nowrap",
                        // 320px: very compact
                        "px-1.5 py-1 text-xs h-7 min-w-[50px]",
                        // 375px+: slightly larger
                        "min-[375px]:px-2 min-[375px]:py-1 min-[375px]:text-xs min-[375px]:h-7 min-[375px]:min-w-[55px]",
                        // 425px+: more comfortable
                        "min-[425px]:px-2.5 min-[425px]:py-1.5 min-[425px]:text-sm min-[425px]:h-8 min-[425px]:min-w-[65px]",
                        // 768px+: full size
                        "md:px-6 md:py-2.5 md:text-base md:h-10 md:min-w-[80px]"
                    )}
                    style={{ letterSpacing: "0.5px" }}
                >
                    <span className="block font-semibold">
                        SIGN UP
                    </span>
                </button>
                
                {/* LOG IN Button */}
                <button
                    onClick={() => openAuthDialog('login')}
                    className={cn(
                        "flex items-center justify-center rounded-md border border-[#388BFF] bg-transparent text-white font-bold transition-colors shadow hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-300",
                        "leading-none tracking-wide whitespace-nowrap",
                        // 320px: very compact
                        "px-1.5 py-1 text-xs h-7 min-w-[50px]",
                        // 375px+: slightly larger
                        "min-[375px]:px-2 min-[375px]:py-1 min-[375px]:text-xs min-[375px]:h-7 min-[375px]:min-w-[55px]",
                        // 425px+: more comfortable
                        "min-[425px]:px-2.5 min-[425px]:py-1.5 min-[425px]:text-sm min-[425px]:h-8 min-[425px]:min-w-[65px]",
                        // 768px+: full size
                        "md:px-6 md:py-2.5 md:text-base md:h-10 md:min-w-[80px]"
                    )}
                    style={{ letterSpacing: "0.5px" }}
                >
                    <span className="block font-semibold">
                        LOG IN
                    </span>
                </button>
            </div>
        </div>
    );
};

export default AuthButtons;
