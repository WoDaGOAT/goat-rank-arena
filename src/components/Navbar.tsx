
import AuthButtons from "./nav/AuthButtons";
import Logo from "./nav/Logo";
import NavMenu from "./nav/NavMenu";

const Navbar = () => {
  return (
    <nav className="bg-black text-primary-foreground p-2 sm:p-3 md:p-4 shadow-md w-full">
      <div className="container mx-auto flex flex-nowrap items-center justify-between gap-1 md:gap-2 overflow-x-auto">
        <Logo />
        <NavMenu />
        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;
