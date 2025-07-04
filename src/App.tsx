
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppRoutes from "@/components/app/AppRoutes";
import GlobalAuthDialog from "@/components/app/GlobalAuthDialog";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.message?.includes('40')) return false;
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <AuthProvider>
              <SecurityProvider>
                <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] text-white">
                  <Navbar />
                  <main className="flex-grow pt-20 w-full max-w-screen-xl px-4 mx-auto">
                    <AppRoutes />
                  </main>
                  <Footer />
                  <GlobalAuthDialog />
                </div>
              </SecurityProvider>
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
