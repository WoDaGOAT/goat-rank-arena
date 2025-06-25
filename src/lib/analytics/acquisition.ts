
// Acquisition & Onboarding Events
// Tracks user acquisition, sign-ups, and onboarding flow

import { AnalyticsCore } from './core';

export class AcquisitionAnalytics extends AnalyticsCore {
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
}
