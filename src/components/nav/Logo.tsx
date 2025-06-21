
import { Link } from "react-router-dom";

const Logo = () => (
  <Link
    to="/"
    className="hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
  >
    <img 
      src="/lovable-uploads/cc43c4d7-2889-4308-bfe5-a2b57a5a8271.png" 
      alt="WoDaGOAT logo" 
      className="h-12 xs:h-14 sm:h-16 lg:h-20 xl:h-24 w-auto object-contain" 
    />
  </Link>
);

export default Logo;
