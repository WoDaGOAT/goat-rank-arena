
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Logo = () => (
  <Link
    to="/"
    className="hover:opacity-80 transition-opacity whitespace-nowrap flex items-center gap-2"
  >
    <Home className="h-8 w-8 text-white" />
    <img src="/lovable-uploads/cc43c4d7-2889-4308-bfe5-a2b57a5a8271.png" alt="wodagoat logo" className="h-20 md:h-24" />
  </Link>
);

export default Logo;
