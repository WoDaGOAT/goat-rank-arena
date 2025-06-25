
// Core analytics functionality and base class
// Handles GA configuration, tracking methods, and development mode

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

export interface UserProperties {
  user_id?: string;
  user_type?: 'authenticated' | 'anonymous';
  total_rankings?: number;
  total_quizzes?: number;
  registration_date?: string;
  preferred_sport?: string;
}

export class AnalyticsCore {
  protected isEnabled: boolean;
  protected isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isEnabled = import.meta.env.PROD && typeof window !== 'undefined' && typeof window.gtag === 'function';
    
    if (this.isDevelopment) {
      console.log('Analytics initialized in development mode - events will be logged but not sent');
    }
  }

  // Core tracking methods
  protected track(eventName: string, parameters?: EventParameters) {
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
}
