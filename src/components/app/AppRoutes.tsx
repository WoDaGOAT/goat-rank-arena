
import { Routes, Route, Navigate } from "react-router-dom";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/create-ranking/:categoryId" element={<CreateRankingPage />} />
      <Route 
        path="/ranking/:id" 
        element={
          <DebugRouteWrapper routeName="UserRankingPage">
            <div>
              <div style={{ display: 'none' }}>
                🔍 Route matched: /ranking/:id at {new Date().toISOString()}
              </div>
              <UserRankingPage />
            </div>
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
  );
};

export default AppRoutes;
