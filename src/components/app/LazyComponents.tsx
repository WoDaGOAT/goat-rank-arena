import { lazy } from "react";

console.log('LazyComponents.tsx: Starting to load');

const Index = lazy(() => {
  console.log('LazyComponents.tsx: Loading Index page');
  return import("../../pages/Index").catch(error => {
    console.error('LazyComponents.tsx: Failed to load Index page:', error);
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
  console.log('🔍 LazyComponents.tsx: Loading CategoryPage');
  return import("../../pages/CategoryPage").catch(error => {
    console.error('🔍 LazyComponents.tsx: Failed to load CategoryPage:', error);
    return { default: () => <div>Error loading CategoryPage</div> };
  });
});

const CreateRankingPage = lazy(() => {
  console.log('🔍 LazyComponents.tsx: Loading CreateRankingPage');
  return import("../../pages/CreateRankingPage").catch(error => {
    console.error('🔍 LazyComponents.tsx: Failed to load CreateRankingPage:', error);
    return { default: () => <div>Error loading CreateRankingPage</div> };
  });
});

// CRITICAL FIX: Ensure UserRankingPage loads properly with better error handling
const UserRankingPage = lazy(() => {
  console.log('🔍 LazyComponents.tsx: STARTING to load UserRankingPage component');
  return import("../../pages/UserRankingPage").then(module => {
    console.log('🔍 LazyComponents.tsx: UserRankingPage loaded SUCCESSFULLY - module:', module);
    console.log('🔍 LazyComponents.tsx: UserRankingPage default export exists:', !!module.default);
    return module;
  }).catch(error => {
    console.error('🔍 LazyComponents.tsx: CRITICAL ERROR loading UserRankingPage:', error);
    console.error('🔍 LazyComponents.tsx: Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    // Return a debug component instead of generic error
    return { 
      default: () => (
        <div className="min-h-screen flex flex-col text-white" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">UserRankingPage Load Error</h1>
            <p className="text-gray-300 mb-4">Failed to load the ranking page component.</p>
            <p className="text-sm text-gray-400">Error: {error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    };
  });
});

// Add ComingSoonPage to lazy components
const ComingSoonPage = lazy(() => {
  console.log('🔍 LazyComponents.tsx: Loading ComingSoonPage');
  return import("../../pages/ComingSoonPage").catch(error => {
    console.error('🔍 LazyComponents.tsx: Failed to load ComingSoonPage:', error);
    return { default: () => <div>Error loading ComingSoonPage</div> };
  });
});

// Keep other lazy imports simple for now
const UserProfilePage = lazy(() => import("../../pages/UserProfilePage").catch(() => ({ default: () => <div>Error loading page</div> })));
const PublicProfilePage = lazy(() => import("../../pages/PublicProfilePage").catch(() => ({ default: () => <div>Error loading page</div> })));
const FeedPage = lazy(() => import("../../pages/FeedPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const QuizPage = lazy(() => import("../../pages/QuizPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const ContactPage = lazy(() => import("../../pages/ContactPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const GdprPage = lazy(() => import("../../pages/GdprPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const PrivacyPolicyPage = lazy(() => import("../../pages/PrivacyPolicyPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const NotFound = lazy(() => import("../../pages/NotFound").catch(() => ({ default: () => <div>Page not found</div> })));
const UserManagementPage = lazy(() => import("../../pages/admin/UserManagementPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const CreateQuizPage = lazy(() => import("../../pages/admin/CreateQuizPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const NotificationsPage = lazy(() => import("../../pages/NotificationsPage").catch(() => ({ default: () => <div>Error loading page</div> })));
const AnalyticsDashboardPage = lazy(() => import("../../pages/admin/AnalyticsDashboardPage").catch(() => ({ default: () => <div>Error loading page</div> })));

// Import admin pages directly since they're not lazy loaded in original
import CommentManagementPage from "../../pages/admin/CommentManagementPage";
import AthleteManagementPage from "../../pages/admin/AthleteManagementPage";

export {
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
  AthleteManagementPage,
  ComingSoonPage
};

console.log('LazyComponents.tsx: All components exported');
