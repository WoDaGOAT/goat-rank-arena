
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import {
  Index,
  CategoryPage,
  CreateRankingPage,
  UserRankingPage,
  UserProfilePage,
  PublicProfilePage,
  FeedPage,
  QuizPage,
  ContactPage,
  GdprPage,
  PrivacyPolicyPage,
  NotFound,
  UserManagementPage,
  CreateQuizPage,
  NotificationsPage,
  AnalyticsDashboardPage,
  CommentManagementPage,
  AthleteManagementPage
} from "./LazyComponents";
import DebugRouteWrapper from "./DebugRouteWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="text-white">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  console.log('🔍 AppRoutes - Rendering routes');
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route 
            path="/create-ranking/:categoryId" 
            element={
              <DebugRouteWrapper routeName="CreateRankingPage">
                <CreateRankingPage />
              </DebugRouteWrapper>
            } 
          />
          <Route 
            path="/ranking/:id" 
            element={
              <DebugRouteWrapper routeName="UserRankingPage">
                <UserRankingPage />
              </DebugRouteWrapper>
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
          
          <Route path="/admin/quizzes/new" element={<Navigate to="/admin/create-quiz" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
