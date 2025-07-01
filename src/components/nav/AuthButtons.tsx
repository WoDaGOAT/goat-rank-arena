
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
        <div className="flex items-center gap-1">
            {/* Responsive layout: vertical stack on very small screens, horizontal on larger */}
            <div className="flex flex-col gap-1 min-[375px]:flex-row min-[375px]:gap-2">
                {/* SIGN UP Button */}
                <button
                    onClick={() => openAuthDialog('signup')}
                    className={cn(
                        "flex items-center justify-center rounded-md border border-white bg-[#388BFF] font-bold transition-colors shadow hover:bg-[#236dda] focus:outline-none focus:ring-2 focus:ring-blue-300 text-white",
                        "text-xs leading-none tracking-wide whitespace-nowrap",
                        // Ultra-small screens (320px): very compact
                        "px-2 py-1 min-w-[60px] h-7",
                        // Small mobile (375px+): slightly larger
                        "min-[375px]:px-2.5 min-[375px]:py-1.5 min-[375px]:min-w-[65px] min-[375px]:h-8",
                        // Medium mobile (425px+): more comfortable
                        "min-[425px]:px-3 min-[425px]:py-2 min-[425px]:min-w-[70px] min-[425px]:h-9 min-[425px]:text-sm",
                        // Tablet and up (768px+): full size
                        "md:px-6 md:py-2.5 md:min-w-[80px] md:h-10 md:text-base"
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
                        "text-xs leading-none tracking-wide whitespace-nowrap",
                        // Ultra-small screens (320px): very compact
                        "px-2 py-1 min-w-[60px] h-7",
                        // Small mobile (375px+): slightly larger
                        "min-[375px]:px-2.5 min-[375px]:py-1.5 min-[375px]:min-w-[65px] min-[375px]:h-8",
                        // Medium mobile (425px+): more comfortable
                        "min-[425px]:px-3 min-[425px]:py-2 min-[425px]:min-w-[70px] min-[425px]:h-9 min-[425px]:text-sm",
                        // Tablet and up (768px+): full size
                        "md:px-6 md:py-2.5 md:min-w-[80px] md:h-10 md:text-base"
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
