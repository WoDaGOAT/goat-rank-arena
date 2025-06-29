
import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { isSupabaseConfigured } from "./lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/app/LoadingFallback";
import GlobalAuthDialog from "./components/app/GlobalAuthDialog";
import AppRoutes from "./components/app/AppRoutes";

console.log('App.tsx: Starting to load');
console.log('App.tsx: Supabase configured?', isSupabaseConfigured);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

console.log('App.tsx: QueryClient created');

function App() {
  console.log('App.tsx: App component rendering');

  if (!isSupabaseConfigured) {
    console.error('App.tsx: Supabase not configured');
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Supabase Not Configured</h1>
          <p>Please check your Supabase integration settings.</p>
        </div>
      </div>
    );
  }

  console.log('App.tsx: About to render main app structure');

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <div className="min-h-screen bg-gray-900">
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<LoadingFallback />}>
                    <AppRoutes />
                  </Suspense>
                </main>
                <Footer />
              </div>
              <GlobalAuthDialog />
              <SonnerToaster />
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

console.log('App.tsx: App component defined');

export default App;
