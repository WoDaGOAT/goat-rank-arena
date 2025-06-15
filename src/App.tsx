
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import CreateRankingPage from "./pages/CreateRankingPage";
import UserProfilePage from "./pages/UserProfilePage";
import { AuthProvider } from "./contexts/AuthContext";
import { isSupabaseConfigured } from "./lib/supabase";
import FeedPage from "./pages/FeedPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import QuizPage from "./pages/QuizPage";
import UserRankingPage from "./pages/UserRankingPage";
import CreateQuizPage from "./pages/admin/CreateQuizPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import GdprPage from "./pages/GdprPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

const queryClient = new QueryClient();

const App = () => {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
        <div className="text-center p-8 bg-white/5 text-white border-gray-700 rounded-lg shadow-xl max-w-md mx-4">
          <h1 className="text-2xl font-bold text-red-500">Configuration Error</h1>
          <p className="mt-4 text-gray-300">Supabase credentials are not configured.</p>
          <p className="mt-2 text-gray-400 text-sm">This can happen if the Supabase integration was not completed successfully. Please try reconnecting Supabase from the editor's integration panel.</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/admin/create-quiz" element={<CreateQuizPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/category/:categoryId/create-ranking" element={<CreateRankingPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/user/:userId" element={<PublicProfilePage />} />
              <Route path="/ranking/:rankingId" element={<UserRankingPage />} />
              <Route path="/gdpr" element={<GdprPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
