
// Main Analytics Module
// Combines all analytics modules into a single interface for easy use throughout the app

import { AnalyticsCore, UserProperties } from './analytics/core';
import { AcquisitionAnalytics } from './analytics/acquisition';
import { RankingAnalytics } from './analytics/ranking';
import { QuizAnalytics } from './analytics/quiz';
import { SocialAnalytics } from './analytics/social';
import { EngagementAnalytics } from './analytics/engagement';

class Analytics extends AnalyticsCore {
  private acquisition: AcquisitionAnalytics;
  private ranking: RankingAnalytics;
  private quiz: QuizAnalytics;
  private social: SocialAnalytics;
  private engagement: EngagementAnalytics;

  constructor() {
    super();
    
    // Initialize all analytics modules
    this.acquisition = new AcquisitionAnalytics();
    this.ranking = new RankingAnalytics();
    this.quiz = new QuizAnalytics();
    this.social = new SocialAnalytics();
    this.engagement = new EngagementAnalytics();
  }

  // Acquisition & Onboarding Events
  trackLandingPageVisit = (source?: string, medium?: string, campaign?: string) => {
    return this.acquisition.trackLandingPageVisit(source, medium, campaign);
  };

  trackSignUp = (method: 'email' | 'google' | 'facebook') => {
    return this.acquisition.trackSignUp(method);
  };

  trackCompletedOnboarding = () => {
    return this.acquisition.trackCompletedOnboarding();
  };

  trackSelectedSportCategoryFirstTime = (categoryName: string, categoryId: string) => {
    return this.acquisition.trackSelectedSportCategoryFirstTime(categoryName, categoryId);
  };

  // Ranking Flow Events
  trackStartedRanking = (categoryName: string, categoryId: string) => {
    return this.ranking.trackStartedRanking(categoryName, categoryId);
  };

  trackSelectedAthlete = (athleteName: string, athleteId: string, position: number, categoryId: string) => {
    return this.ranking.trackSelectedAthlete(athleteName, athleteId, position, categoryId);
  };

  trackReorderedRanking = (categoryId: string, totalAthletes: number) => {
    return this.ranking.trackReorderedRanking(categoryId, totalAthletes);
  };

  trackSubmittedRanking = (categoryId: string, categoryName: string, athleteCount: number, timeTaken?: number) => {
    return this.ranking.trackSubmittedRanking(categoryId, categoryName, athleteCount, timeTaken);
  };

  trackEditedRanking = (rankingId: string, categoryId: string) => {
    return this.ranking.trackEditedRanking(rankingId, categoryId);
  };

  trackSharedRankingLink = (rankingId: string, categoryId: string, shareMethod?: string) => {
    return this.ranking.trackSharedRankingLink(rankingId, categoryId, shareMethod);
  };

  trackViewedRankingLeaderboard = (categoryId: string, categoryName: string) => {
    return this.ranking.trackViewedRankingLeaderboard(categoryId, categoryName);
  };

  // Quiz Events
  trackViewedQuiz = (quizId?: string, quizTitle?: string) => {
    return this.quiz.trackViewedQuiz(quizId, quizTitle);
  };

  trackStartedQuiz = (quizId?: string, quizTitle?: string) => {
    return this.quiz.trackStartedQuiz(quizId, quizTitle);
  };

  trackSubmittedQuizAnswers = (quizId: string, quizTitle: string, score: number, totalQuestions: number, timeTaken?: number) => {
    return this.quiz.trackSubmittedQuizAnswers(quizId, quizTitle, score, totalQuestions, timeTaken);
  };

  trackQuizScore = (score: number, totalQuestions: number, quizId: string) => {
    return this.quiz.trackQuizScore(score, totalQuestions, quizId);
  };

  trackViewedDailyLeaderboard = () => {
    return this.quiz.trackViewedDailyLeaderboard();
  };

  // Social Engagement Events
  trackViewedComments = (contentType: 'ranking' | 'category', contentId: string) => {
    return this.social.trackViewedComments(contentType, contentId);
  };

  trackAddedComment = (contentType: 'ranking' | 'category', contentId: string, commentLength: number) => {
    return this.social.trackAddedComment(contentType, contentId, commentLength);
  };

  trackRepliedComment = (parentCommentId: string, replyLength: number) => {
    return this.social.trackRepliedComment(parentCommentId, replyLength);
  };

  trackLikedComment = (commentId: string) => {
    return this.social.trackLikedComment(commentId);
  };

  trackFollowedUser = (followedUserId: string) => {
    return this.social.trackFollowedUser(followedUserId);
  };

  // Engagement & Retention Events
  trackReturnedDayX = (daysSinceLastVisit: number) => {
    return this.engagement.trackReturnedDayX(daysSinceLastVisit);
  };

  trackInvitedFriend = (inviteMethod: string) => {
    return this.engagement.trackInvitedFriend(inviteMethod);
  };

  trackClickedNotification = (notificationType: string, notificationId?: string) => {
    return this.engagement.trackClickedNotification(notificationType, notificationId);
  };

  trackSearchAthletes = (searchTerm: string, resultsCount: number, categoryId: string) => {
    return this.engagement.trackSearchAthletes(searchTerm, resultsCount, categoryId);
  };

  trackProfileView = (viewedUserId: string, isOwnProfile: boolean) => {
    return this.engagement.trackProfileView(viewedUserId, isOwnProfile);
  };

  trackTimeOnPage = (pageName: string, timeInSeconds: number) => {
    return this.engagement.trackTimeOnPage(pageName, timeInSeconds);
  };
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience methods for common use cases
export const trackPageView = (path: string, title?: string) => analytics.trackPageView(path, title);
export const setUserId = (userId: string) => analytics.setUserId(userId);
export const setUserProperties = (properties: UserProperties) => analytics.setUserProperties(properties);
