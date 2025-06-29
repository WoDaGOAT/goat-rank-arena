
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

const CategoryPageLoading = () => {
  return (
    <>
      <Helmet>
        <title>Loading Category... | Wodagoat</title>
        <meta name="description" content="Loading category details, leaderboards, and community rankings." />
      </Helmet>
      <div className="flex flex-col flex-grow min-h-screen px-3 sm:px-4 md:px-8" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
        <div className="container mx-auto py-4 sm:py-6 md:py-8 flex-grow">
          <Skeleton className="h-10 sm:h-12 w-32 sm:w-48 mb-6 sm:mb-8" />
          <Skeleton className="h-8 sm:h-10 w-3/4 mb-2" />
          <Skeleton className="h-4 sm:h-6 w-1/2 mb-6 sm:mb-8" />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-2/3 xl:w-3/5"><Skeleton className="h-80 sm:h-96 w-full" /></div>
            <div className="w-full lg:w-1/3 xl:w-2/5 space-y-4 sm:space-y-6"><Skeleton className="h-40 sm:h-48 w-full" /></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPageLoading;
