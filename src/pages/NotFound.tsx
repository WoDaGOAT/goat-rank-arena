
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <main className="flex-grow flex items-center justify-center">
            <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl text-gray-300 mb-8">Oops! Page not found.</p>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
                <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" /> Go Home
                </Link>
            </Button>
            </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
