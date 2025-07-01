
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient as QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppRoutes from "@/components/app/AppRoutes";
import AnalyticsErrorBoundary from "@/components/AnalyticsErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function QueryClient({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClient>
          <Toaster />
          <AuthProvider>
            <AnalyticsErrorBoundary>
              <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] text-white">
                <Navbar />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </AnalyticsErrorBoundary>
          </AuthProvider>
        </QueryClient>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
