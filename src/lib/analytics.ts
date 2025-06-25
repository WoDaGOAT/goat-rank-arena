
// Google Analytics utility for WoDaGOAT
// Provides comprehensive event tracking for user behavior and engagement metrics

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface EventParameters {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface UserProperties {
  user_id?: string;
  user_type?: 'authenticated' | 'anonymous';
  total_rankings?: number;
  total_quizzes?: number;
  registration_date?: string;
  preferred_sport?: string;
}

class Analytics {
  private isEnabled: boolean;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isEnabled = import.meta.env.PROD && typeof window !== 'undefined' && typeof window.gtag === 'function';
    
    if (this.isDevelopment) {
      console.log('Analytics initialized in development mode - events will be logged but not sent');
    }
  }

  // Core tracking methods
  private track(eventName: string, parameters?: EventParameters) {
    const eventData = {
      event_category: parameters?.event_category || 'general',
      event_label: parameters?.event_label,
      value: parameters?.value,
      ...parameters?.custom_parameters
    };

    if (this.isDevelopment) {
      console.log('🔍 Analytics Event:', eventName, eventData);
      return;
    }

    if (this.isEnabled) {
      window.gtag('event', eventName, eventData);
    }
  }

  // Page tracking
  trackPageView(path: string, title?: string) {
    if (this.isDevelopment) {
      console.log('📄 Page View:', path, title);
      return;
    }

    if (this.isEnabled) {
      window.gtag('config', 'G-RDTBW5CV4X', {
        page_path: path,
        page_title: title,
      });
    }
  }

  // User identification and properties
  setUserId(userId: string) {
    if (this.isDevelopment) {
      console.log('👤 User ID set:', userId);
      return;
    }

    if (this.isEnabled) {
      window.gtag('config', 'G-RDTBW5CV4X', {
        user_id: userId
      });
    }
  }

  setUserProperties(properties: UserProperties) {
    if (this.isDevelopment) {
      console.log('👤 User Properties:', properties);
      return;
    }

    if (this.isEnabled) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  // 🎯 Acquisition & Onboarding Events
  trackLandingPageVisit(source?: string, medium?: string, campaign?: string) {
    this.track('visited_landing_page', {
      event_category: 'acquisition',
      custom_parameters: {
        source,
        medium,
        campaign
      }
    });
  }

  trackSignUp(method: 'email' | 'google' | 'facebook') {
    this.track('sign_up', {
      event_category: 'acquisition',
      event_label: method,
      custom_parameters: {
        method
      }
    });
  }

  trackCompletedOnboarding() {
    this.track('completed_onboarding', {
      event_category: 'onboarding'
    });
  }

  trackSelectedSportCategoryFirstTime(categoryName: string, categoryId: string) {
    this.track('selected_sport_category_first_time', {
      event_category: 'onboarding',
      event_label: categoryName,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName
      }
    });
  }

  // 🏆 Ranking Flow Events
  trackStartedRanking(categoryName: string, categoryId: string) {
    this.track('started_ranking', {
      event_category: 'ranking',
      event_label: categoryName,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName
      }
    });
  }

  trackSelectedAthlete(athleteName: string, athleteId: string, position: number, categoryId: string) {
    this.track('selected_athlete', {
      event_category: 'ranking',
      event_label: athleteName,
      value: position,
      custom_parameters: {
        athlete_id: athleteId,
        athlete_name: athleteName,
        position: position,
        category_id: categoryId
      }
    });
  }

  trackReorderedRanking(categoryId: string, totalAthletes: number) {
    this.track('reordered_ranking', {
      event_category: 'ranking',
      value: totalAthletes,
      custom_parameters: {
        category_id: categoryId,
        total_athletes: totalAthletes
      }
    });
  }

  trackSubmittedRanking(categoryId: string, categoryName: string, athleteCount: number, timeTaken?: number) {
    this.track('submitted_ranking', {
      event_category: 'ranking',
      event_label: categoryName,
      value: athleteCount,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName,
        athlete_count: athleteCount,
        time_taken_seconds: timeTaken
      }
    });
  }

  trackEditedRanking(rankingId: string, categoryId: string) {
    this.track('edited_ranking', {
      event_category: 'ranking',
      custom_parameters: {
        ranking_id: rankingId,
        category_id: categoryId
      }
    });
  }

  trackSharedRankingLink(rankingId: string, categoryId: string, shareMethod?: string) {
    this.track('shared_ranking_link', {
      event_category: 'social',
      event_label: shareMethod,
      custom_parameters: {
        ranking_id: rankingId,
        category_id: categoryId,
        share_method: shareMethod
      }
    });
  }

  trackViewedRankingLeaderboard(categoryId: string, categoryName: string) {
    this.track('viewed_ranking_leaderboard', {
      event_category: 'engagement',
      event_label: categoryName,
      custom_parameters: {
        category_id: categoryId,
        category_name: categoryName
      }
    });
  }

  // 🧠 Quiz Events
  trackViewedQuiz(quizId?: string, quizTitle?: string) {
    this.track('viewed_quiz', {
      event_category: 'quiz',
      event_label: quizTitle,
      custom_parameters: {
        quiz_id: quizId,
        quiz_title: quizTitle
      }
    });
  }

  trackStartedQuiz(quizId?: string, quizTitle?: string) {
    this.track('started_quiz', {
      event_category: 'quiz',
      event_label: quizTitle,
      custom_parameters: {
        quiz_id: quizId,
        quiz_title: quizTitle
      }
    });
  }

  trackSubmittedQuizAnswers(quizId: string, quizTitle: string, score: number, totalQuestions: number, timeTaken?: number) {
    this.track('submitted_quiz_answers', {
      event_category: 'quiz',
      event_label: quizTitle,
      value: score,
      custom_parameters: {
        quiz_id: quizId,
        quiz_title: quizTitle,
        score: score,
        total_questions: totalQuestions,
        accuracy_percentage: (score / totalQuestions) * 100,
        time_taken_seconds: timeTaken
      }
    });
  }

  trackQuizScore(score: number, totalQuestions: number, quizId: string) {
    this.track('quiz_score', {
      event_category: 'quiz',
      value: score,
      custom_parameters: {
        quiz_id: quizId,
        score: score,
        total_questions: totalQuestions,
        is_perfect_score: score === totalQuestions
      }
    });
  }

  trackViewedDailyLeaderboard() {
    this.track('viewed_daily_leaderboard', {
      event_category: 'engagement'
    });
  }

  // 👥 Social Engagement Events
  trackViewedComments(contentType: 'ranking' | 'category', contentId: string) {
    this.track('viewed_comments', {
      event_category: 'social',
      event_label: contentType,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId
      }
    });
  }

  trackAddedComment(contentType: 'ranking' | 'category', contentId: string, commentLength: number) {
    this.track('added_comment', {
      event_category: 'social',
      event_label: contentType,
      value: commentLength,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId,
        comment_length: commentLength
      }
    });
  }

  trackRepliedComment(parentCommentId: string, replyLength: number) {
    this.track('replied_comment', {
      event_category: 'social',
      value: replyLength,
      custom_parameters: {
        parent_comment_id: parentCommentId,
        reply_length: replyLength
      }
    });
  }

  trackLikedComment(commentId: string) {
    this.track('liked_comment', {
      event_category: 'social',
      custom_parameters: {
        comment_id: commentId
      }
    });
  }

  trackFollowedUser(followedUserId: string) {
    this.track('followed_user', {
      event_category: 'social',
      custom_parameters: {
        followed_user_id: followedUserId
      }
    });
  }

  // 🔄 Retention & Virality Events
  trackReturnedDayX(daysSinceLastVisit: number) {
    this.track('returned_day_x', {
      event_category: 'retention',
      value: daysSinceLastVisit,
      custom_parameters: {
        days_since_last_visit: daysSinceLastVisit
      }
    });
  }

  trackInvitedFriend(inviteMethod: string) {
    this.track('invited_friend', {
      event_category: 'virality',
      event_label: inviteMethod,
      custom_parameters: {
        invite_method: inviteMethod
      }
    });
  }

  trackClickedNotification(notificationType: string, notificationId?: string) {
    this.track('clicked_notification', {
      event_category: 'engagement',
      event_label: notificationType,
      custom_parameters: {
        notification_type: notificationType,
        notification_id: notificationId
      }
    });
  }

  // Additional engagement tracking
  trackSearchAthletes(searchTerm: string, resultsCount: number, categoryId: string) {
    this.track('searched_athletes', {
      event_category: 'engagement',
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
        category_id: categoryId
      }
    });
  }

  trackProfileView(viewedUserId: string, isOwnProfile: boolean) {
    this.track('viewed_profile', {
      event_category: 'engagement',
      custom_parameters: {
        viewed_user_id: viewedUserId,
        is_own_profile: isOwnProfile
      }
    });
  }

  trackTimeOnPage(pageName: string, timeInSeconds: number) {
    this.track('time_on_page', {
      event_category: 'engagement',
      event_label: pageName,
      value: timeInSeconds,
      custom_parameters: {
        page_name: pageName,
        time_seconds: timeInSeconds
      }
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Convenience methods for common use cases
export const trackPageView = (path: string, title?: string) => analytics.trackPageView(path, title);
export const setUserId = (userId: string) => analytics.setUserId(userId);
export const setUserProperties = (properties: UserProperties) => analytics.setUserProperties(properties);
