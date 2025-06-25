
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
    this.acquisition = new AcquisitionAnalytics();
    this.ranking = new RankingAnalytics();
    this.quiz = new QuizAnalytics();
    this.social = new SocialAnalytics();
    this.engagement = new EngagementAnalytics();
  }

  // Acquisition & Onboarding Events
  trackLandingPageVisit = this.acquisition.trackLandingPageVisit.bind(this.acquisition);
  trackSignUp = this.acquisition.trackSignUp.bind(this.acquisition);
  trackCompletedOnboarding = this.acquisition.trackCompletedOnboarding.bind(this.acquisition);
  trackSelectedSportCategoryFirstTime = this.acquisition.trackSelectedSportCategoryFirstTime.bind(this.acquisition);

  // Ranking Flow Events
  trackStartedRanking = this.ranking.trackStartedRanking.bind(this.ranking);
  trackSelectedAthlete = this.ranking.trackSelectedAthlete.bind(this.ranking);
  trackReorderedRanking = this.ranking.trackReorderedRanking.bind(this.ranking);
  trackSubmittedRanking = this.ranking.trackSubmittedRanking.bind(this.ranking);
  trackEditedRanking = this.ranking.trackEditedRanking.bind(this.ranking);
  trackSharedRankingLink = this.ranking.trackSharedRankingLink.bind(this.ranking);
  trackViewedRankingLeaderboard = this.ranking.trackViewedRankingLeaderboard.bind(this.ranking);

  // Quiz Events
  trackViewedQuiz = this.quiz.trackViewedQuiz.bind(this.quiz);
  trackStartedQuiz = this.quiz.trackStartedQuiz.bind(this.quiz);
  trackSubmittedQuizAnswers = this.quiz.trackSubmittedQuizAnswers.bind(this.quiz);
  trackQuizScore = this.quiz.trackQuizScore.bind(this.quiz);
  trackViewedDailyLeaderboard = this.quiz.trackViewedDailyLeaderboard.bind(this.quiz);

  // Social Engagement Events
  trackViewedComments = this.social.trackViewedComments.bind(this.social);
  trackAddedComment = this.social.trackAddedComment.bind(this.social);
  trackRepliedComment = this.social.trackRepliedComment.bind(this.social);
  trackLikedComment = this.social.trackLikedComment.bind(this.social);
  trackFollowedUser = this.social.trackFollowedUser.bind(this.social);

  // Engagement & Retention Events
  trackReturnedDayX = this.engagement.trackReturnedDayX.bind(this.engagement);
  trackInvitedFriend = this.engagement.trackInvitedFriend.bind(this.engagement);
  trackClickedNotification = this.engagement.trackClickedNotification.bind(this.engagement);
  trackSearchAthletes = this.engagement.trackSearchAthletes.bind(this.engagement);
  trackProfileView = this.engagement.trackProfileView.bind(this.engagement);
  trackTimeOnPage = this.engagement.trackTimeOnPage.bind(this.engagement);
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience methods for common use cases
export const trackPageView = (path: string, title?: string) => analytics.trackPageView(path, title);
export const setUserId = (userId: string) => analytics.setUserId(userId);
export const setUserProperties = (properties: UserProperties) => analytics.setUserProperties(properties);
