
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import CreateRankingPage from "./pages/CreateRankingPage";
import UserRankingPage from "./pages/UserRankingPage";
import UserProfilePage from "./pages/UserProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import QuizPage from "./pages/QuizPage";
import FeedPage from "./pages/FeedPage";
import NotificationsPage from "./pages/NotificationsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import GdprPage from "./pages/GdprPage";
import NotFound from "./pages/NotFound";
import AthleteManagementPage from "./pages/admin/AthleteManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import CreateQuizPage from "./pages/admin/CreateQuizPage";
import CommentManagementPage from "./pages/admin/CommentManagementPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SimpleAuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/ranking/create/:categoryId" element={<CreateRankingPage />} />
                <Route path="/ranking/:id" element={<UserRankingPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/profile/:userId" element={<PublicProfilePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/gdpr" element={<GdprPage />} />
                <Route path="/admin/athletes" element={<AthleteManagementPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/quiz" element={<CreateQuizPage />} />
                <Route path="/admin/quizzes/new" element={<CreateQuizPage />} />
                <Route path="/admin/comments" element={<CommentManagementPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SimpleAuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
