
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          wodagoat
        </Link>
        {/* Future navigation links can go here */}
        {/* <div className="space-x-4">
          <Link to="/about" className="hover:underline">About</Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
