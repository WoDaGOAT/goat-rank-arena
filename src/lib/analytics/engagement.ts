
// General Engagement Events
// Tracks user engagement, retention, virality, and general interactions

import { AnalyticsCore } from './core';

export class EngagementAnalytics extends AnalyticsCore {
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
