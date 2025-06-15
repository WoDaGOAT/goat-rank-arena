
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import { isSupabaseConfigured } from "./lib/supabase";
import CommentManagementPage from "./pages/admin/CommentManagementPage";

const Index = lazy(() => import("./pages/Index"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CreateRankingPage = lazy(() => import("./pages/CreateRankingPage"));
const UserRankingPage = lazy(() => import("./pages/UserRankingPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const GdprPage = lazy(() => import("./pages/GdprPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const CreateQuizPage = lazy(() => import("./pages/admin/CreateQuizPage"));

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Supabase Not Configured</h1>
          <p>Please check your Supabase integration settings.</p>
        </div>
      </div>
    );
  }
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-gray-900">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/category/:categoryId/rank" element={<CreateRankingPage />} />
                  <Route path="/ranking/:rankingId" element={<UserRankingPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/users/:userId" element={<PublicProfilePage />} />
                  <Route path="/feed" element={<FeedPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/gdpr" element={<GdprPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route path="/admin/quizzes/new" element={<CreateQuizPage />} />
                  <Route path="/admin/comments" element={<CommentManagementPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <SonnerToaster />
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
