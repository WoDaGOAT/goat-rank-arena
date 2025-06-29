import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { isSupabaseConfigured } from "./lib/supabase";
import CommentManagementPage from "./pages/admin/CommentManagementPage";
import AthleteManagementPage from "@/pages/admin/AthleteManagementPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthDialog from "./components/auth/AuthDialog";

console.log('App.tsx: Starting to load');
console.log('App.tsx: Supabase configured?', isSupabaseConfigured);

// Enhanced loading fallback component with timeout
const LoadingFallback = () => {
  console.log('LoadingFallback: Rendering');
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading WoDaGOAT...</p>
        <p className="text-gray-400 text-sm mt-2">Initializing application...</p>
      </div>
    </div>
  );
};

const Index = lazy(() => {
  console.log('App.tsx: Loading Index page');
  return import("./pages/Index").catch(error => {
    console.error('App.tsx: Failed to load Index page:', error);
    // Return a fallback component instead of throwing
    return {
      default: () => (
        <div className="container mx-auto px-4 py-8 text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Welcome to WoDaGOAT</h1>
          <p>Loading error occurred. Please refresh the page.</p>
        </div>
      )
    };
  });
});

// Improved lazy loading with better error handling and debugging
const CategoryPage = lazy(() => {
  console.log('🔍 App.tsx: Loading CategoryPage');
  return import("./pages/CategoryPage").catch(error => {
    console.error('🔍 App.tsx: Failed to load CategoryPage:', error);
    return { default: () => <div>Error loading CategoryPage</div> };
  });
});

const CreateRankingPage = lazy(() => {
  console.log('🔍 App.tsx: Loading CreateRankingPage');
  return import("./pages/CreateRankingPage").catch(error => {
    console.error('🔍 App.tsx: Failed to load CreateRankingPage:', error);
    return { default: () => <div>Error loading CreateRankingPage</div> };
  });
});

const UserRankingPage = lazy(() => {
  console.log('🔍 App.tsx: Loading UserRankingPage');
  return import("./pages/UserRankingPage").then(module => {
    console.log('🔍 App.tsx: UserRankingPage loaded successfully');
    return module;
  }).catch(error => {
    console.error('🔍 App.tsx: Failed to load UserRankingPage:', error);
    return { default: () => <div>Error loading UserRankingPage</div> };
  });
});

// Keep other lazy imports simple for now
const UserProfilePage = lazy(() => import("./pages/UserProfilePage").catch(() => ({ default: () => <div>Error loading page</div> })));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage").catch(() => ({ default: () => <div>Error loading page</div> })));
const FeedPage = lazy(() => import("./pages/FeedPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const QuizPage = lazy(() => import("./pages/QuizPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const ContactPage = lazy(() => import("./pages/ContactPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const GdprPage = lazy(() => import("./pages/GdprPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const NotFound = lazy(() => import("./pages/NotFound").catch(() => ({ default: () => <div>Page not found</div> })));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const CreateQuizPage = lazy(() => import("./pages/admin/CreateQuizPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const AnalyticsDashboardPage = lazy(() => import("./pages/admin/AnalyticsDashboardPage").catch(() => ({ default: () => <div>Error loading page</div> })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

console.log('App.tsx: QueryClient created');

// Component to handle global auth dialog
const GlobalAuthDialog = () => {
  const { authDialogOpen, closeAuthDialog, authDialogMode } = useAuth();
  
  return (
    <AuthDialog 
      open={authDialogOpen} 
      onOpenChange={closeAuthDialog}
      defaultMode={authDialogMode}
    />
  );
};

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
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/category/:categoryId" element={<CategoryPage />} />
                      <Route path="/create-ranking/:categoryId" element={<CreateRankingPage />} />
                      <Route 
                        path="/ranking/:id" 
                        element={
                          <div>
                            <div style={{ display: 'none' }}>
                              🔍 Route matched: /ranking/:id
                            </div>
                            <UserRankingPage />
                          </div>
                        } 
                      />
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/users/:userId" element={<PublicProfilePage />} />
                      <Route path="/quiz" element={<QuizPage />} />
                      <Route path="/feed" element={<FeedPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/gdpr" element={<GdprPage />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin/users" element={<UserManagementPage />} />
                      <Route path="/admin/athletes" element={<AthleteManagementPage />} />
                      <Route path="/admin/comments" element={<CommentManagementPage />} />
                      <Route path="/admin/create-quiz" element={<CreateQuizPage />} />
                      <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
                      
                      {/* Redirect old quiz creation URL to new one */}
                      <Route path="/admin/quizzes/new" element={<Navigate to="/admin/create-quiz" replace />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
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
