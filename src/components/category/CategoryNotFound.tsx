
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

const CategoryNotFound = () => {
  return (
    <>
      <Helmet>
        <title>Category Not Found | Wodagoat</title>
        <meta name="description" content="The category you're looking for doesn't exist or couldn't be loaded. Please return to the homepage to explore other debates." />
      </Helmet>
      <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <div className="container mx-auto py-4 sm:py-6 md:py-8 text-center flex-grow flex items-center justify-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Category Not Found</h1>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">The category you're looking for doesn't exist or couldn't be loaded.</p>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-900">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" /> Go Back to Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryNotFound;
