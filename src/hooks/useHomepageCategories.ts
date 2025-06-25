
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchHomepageCategories } from "./homepage/categoryDataService";
import { isPreviewEnvironment } from "./homepage/environmentUtils";
import { HomepageCategoriesData } from "./homepage/fallbackData";

export const useHomepageCategories = () => {
  const isPreview = isPreviewEnvironment();
  
  return useQuery<HomepageCategoriesData>({
    queryKey: ["homepageCategories", "v8", isPreview ? "preview" : "production"],
    queryFn: async (): Promise<HomepageCategoriesData> => {
      // Use longer timeout for preview environment to be more forgiving
      const queryTimeout = isPreview ? 10000 : 30000; // 10s for preview, 30s for production
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), queryTimeout);
      });
      
      // Race the query against the timeout
      return Promise.race([fetchHomepageCategories(), timeoutPromise]);
    },
    retry: (failureCount, error) => {
      console.log(`🔄 Retry attempt ${failureCount} for homepage categories`);
      // More forgiving retry for preview
      return failureCount < (isPreview ? 2 : 3);
    },
    retryDelay: (attemptIndex) => {
      // Faster retries for preview
      const baseDelay = isPreview ? 1000 : 1500;
      return Math.min(baseDelay * 2 ** attemptIndex, isPreview ? 3000 : 5000);
    },
    staleTime: isPreview ? 1000 * 60 : 1000 * 60 * 5, // 1min for preview, 5min for production
    gcTime: isPreview ? 1000 * 60 * 2 : 1000 * 60 * 10, // 2min for preview, 10min for production
    meta: {
      errorBoundary: false,
      onError: (error: any) => {
        // Create specific error messages for different environments
        if (error instanceof Error) {
          if (isPreview) {
            // More friendly messages for preview
            console.log("🔄 Preview environment error, will show fallback content");
          } else {
            // Production error handling
            if (error.message.includes('connectivity')) {
              toast.error("Unable to connect to the database. Please check your internet connection.");
            } else if (error.message.includes('timeout')) {
              toast.error("Request timed out. Please try again.");
            } else {
              toast.error("An unexpected error occurred while loading the homepage.");
            }
          }
        }
      }
    },
  });
};
