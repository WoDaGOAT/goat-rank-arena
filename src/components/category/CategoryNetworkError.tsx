
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface CategoryNetworkErrorProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

const CategoryNetworkError = ({ onRetry, isRetrying = false }: CategoryNetworkErrorProps) => {
  return (
    <>
      <Helmet>
        <title>Connection Error | Wodagoat</title>
        <meta name="description" content="Unable to connect to the server. Please check your internet connection and try again." />
      </Helmet>
      <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <div className="container mx-auto py-4 sm:py-6 md:py-8 text-center flex-grow flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Connection Error</h1>
            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              Unable to load category data due to a network error.
            </p>
            <p className="text-gray-400 mb-6 text-xs sm:text-sm">
              Please check your internet connection and try again.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={onRetry}
                disabled={isRetrying}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> 
                    Try Again
                  </>
                )}
              </Button>
              
              <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-indigo-900">
                <Link to="/">
                  <ChevronLeft className="mr-2 h-4 w-4" /> 
                  Go Back to Categories
                </Link>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg text-xs text-gray-400">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>If the problem persists, the server may be temporarily unavailable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryNetworkError;
