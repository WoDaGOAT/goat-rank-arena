
import LoginDialog from "@/components/auth/LoginDialog";
import SignupDialog from "@/components/auth/SignupDialog";
import { cn } from "@/lib/utils";

const AuthButtons = () => {
    return (
        <div className="flex items-center gap-2 md:gap-4 ml-2">
            {/* SIGN UP Button */}
            <SignupDialog>
                <button
                    className={cn(
                        "flex items-center justify-center rounded-[10px] border border-white bg-[#388BFF] font-bold transition-colors shadow px-4 md:px-6 py-1.5 md:py-2 hover:bg-[#236dda] focus:outline-none focus:ring-2 focus:ring-blue-300",
                        "text-sm md:text-base whitespace-nowrap leading-none",
                        "tracking-wide",
                        "min-w-[40px] min-h-[30px]"
                    )}
                    style={{ letterSpacing: "1px" }}
                >
                    <span className="block">
                        <span className="hidden md:inline">SIGN&nbsp;UP</span>
                        <span className="inline md:hidden">SIGN UP</span>
                    </span>
                </button>
            </SignupDialog>
            {/* LOG IN Button */}
            <LoginDialog>
                <button
                    className={cn(
                        "flex items-center justify-center rounded-[10px] border border-[#388BFF] bg-gray-200 text-black font-bold transition-colors shadow px-4 md:px-6 py-1.5 md:py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300",
                        "text-sm md:text-base whitespace-nowrap leading-none",
                        "tracking-wide",
                        "min-w-[40px] min-h-[30px]"
                    )}
                    style={{ letterSpacing: "1px" }}
                >
                    <span className="block">
                        <span className="hidden md:inline">LOG&nbsp;IN</span>
                        <span className="inline md:hidden">LOG IN</span>
                    </span>
                </button>
            </LoginDialog>
        </div>
    );
};

export default AuthButtons;
