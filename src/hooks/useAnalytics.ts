
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface TrafficSource {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrer?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  // Generate or get session ID
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Parse UTM parameters and traffic source
  const getTrafficSource = useCallback((): TrafficSource => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    return {
      source: urlParams.get('utm_source') || detectTrafficSource(referrer),
      medium: urlParams.get('utm_medium') || null,
      campaign: urlParams.get('utm_campaign') || null,
      content: urlParams.get('utm_content') || null,
      term: urlParams.get('utm_term') || null,
      referrer: referrer || null,
    };
  }, []);

  // Detect traffic source from referrer
  const detectTrafficSource = (referrer: string): string => {
    if (!referrer) return 'direct';
    
    try {
      const hostname = new URL(referrer).hostname.toLowerCase();
      
      // Social media sources
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook';
      if (hostname.includes('twitter.com') || hostname.includes('t.co')) return 'twitter';
      if (hostname.includes('instagram.com')) return 'instagram';
      if (hostname.includes('linkedin.com')) return 'linkedin';
      if (hostname.includes('tiktok.com')) return 'tiktok';
      if (hostname.includes('youtube.com')) return 'youtube';
      
      // Search engines
      if (hostname.includes('google.com')) return 'google';
      if (hostname.includes('bing.com')) return 'bing';
      if (hostname.includes('yahoo.com')) return 'yahoo';
      
      // Ad networks
      if (hostname.includes('googleads.g.doubleclick.net')) return 'google_ads';
      if (hostname.includes('facebook.com')) return 'facebook_ads';
      
      return 'referral';
    } catch (error) {
      console.warn('Error parsing referrer URL:', error);
      return 'unknown';
    }
  };

  // Track analytics event with error handling
  const trackEvent = useCallback(async (
    eventType: string, 
    properties: Record<string, any> = {},
    additionalData?: {
      pageUrl?: string;
      previousPageUrl?: string;
      interactionType?: string;
      formStep?: string;
      timeSpentSeconds?: number;
    }
  ) => {
    try {
      const sessionId = getSessionId();
      const trafficSource = getTrafficSource();
      
      const eventData = {
        event_type: eventType,
        user_id: user?.id || null,
        session_id: sessionId,
        properties: properties,
        traffic_source: trafficSource.source,
        referrer: trafficSource.referrer,
        utm_source: trafficSource.source,
        utm_medium: trafficSource.medium,
        utm_campaign: trafficSource.campaign,
        utm_content: trafficSource.content,
        utm_term: trafficSource.term,
        ip_address: null, // Will be handled server-side if needed
        user_agent: navigator.userAgent,
        page_url: additionalData?.pageUrl || window.location.pathname,
        previous_page_url: additionalData?.previousPageUrl || null,
        interaction_type: additionalData?.interactionType || null,
        form_step: additionalData?.formStep || null,
        time_spent_seconds: additionalData?.timeSpentSeconds || null,
      };

      // Insert analytics event with retry logic
      const { error: analyticsError } = await supabase
        .from('analytics_events')
        .insert(eventData);

      if (analyticsError) {
        console.warn('Analytics event tracking failed:', analyticsError);
        return; // Fail silently, don't break the app
      }

      // Update or create user session with error handling
      const sessionData = {
        session_id: sessionId,
        user_id: user?.id || null,
        traffic_source: trafficSource.source,
        referrer: trafficSource.referrer,
        utm_source: trafficSource.source,
        utm_medium: trafficSource.medium,
        utm_campaign: trafficSource.campaign,
        page_views: 1, // This will be handled by database triggers
        user_agent: navigator.userAgent,
        updated_at: new Date().toISOString(),
      };

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .upsert(sessionData, {
          onConflict: 'session_id',
        });

      if (sessionError) {
        console.warn('User session update failed:', sessionError);
        // Continue anyway, session tracking is not critical
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
      // Fail silently to not break the user experience
    }
  }, [user, getSessionId, getTrafficSource]);

  // Track page view with error handling
  const trackPageView = useCallback((page: string, additionalData?: Record<string, any>) => {
    try {
      trackEvent('page_view', { page, ...additionalData }, {
        pageUrl: page,
        previousPageUrl: sessionStorage.getItem('previous_page_url') || undefined,
      });
      
      // Store current page as previous for next page view
      sessionStorage.setItem('previous_page_url', page);
    } catch (error) {
      console.warn('Page view tracking error:', error);
    }
  }, [trackEvent]);

  // Track signup with error handling
  const trackSignup = useCallback((method?: string) => {
    try {
      trackEvent('signup', { method });
    } catch (error) {
      console.warn('Signup tracking error:', error);
    }
  }, [trackEvent]);

  // Track ranking created with error handling
  const trackRankingCreated = useCallback((categoryId: string, categoryName: string) => {
    try {
      trackEvent('ranking_created', { categoryId, categoryName });
    } catch (error) {
      console.warn('Ranking created tracking error:', error);
    }
  }, [trackEvent]);

  // Track comment posted with error handling
  const trackCommentPosted = useCallback((categoryId: string, rankingId?: string) => {
    try {
      trackEvent('comment_posted', { categoryId, rankingId });
    } catch (error) {
      console.warn('Comment posted tracking error:', error);
    }
  }, [trackEvent]);

  // Track quiz completed with error handling
  const trackQuizCompleted = useCallback((quizId: string, score: number) => {
    try {
      trackEvent('quiz_completed', { quizId, score });
    } catch (error) {
      console.warn('Quiz completed tracking error:', error);
    }
  }, [trackEvent]);

  // Track form step interactions with error handling
  const trackFormStep = useCallback((stepName: string, action: 'start' | 'complete', timeSpent?: number) => {
    try {
      trackEvent(`form_step_${action}`, { step: stepName }, {
        formStep: stepName,
        timeSpentSeconds: timeSpent,
      });
    } catch (error) {
      console.warn('Form step tracking error:', error);
    }
  }, [trackEvent]);

  // Track ranking flow interactions with error handling
  const trackRankingFlow = useCallback((stepName: string, action: 'start' | 'complete', timeSpent?: number) => {
    try {
      trackEvent(`ranking_${action}`, { step: stepName }, {
        interactionType: 'ranking_flow',
        timeSpentSeconds: timeSpent,
      });
    } catch (error) {
      console.warn('Ranking flow tracking error:', error);
    }
  }, [trackEvent]);

  // Auto-track page views on route changes with error handling
  useEffect(() => {
    try {
      trackPageView(window.location.pathname + window.location.search);
    } catch (error) {
      console.warn('Initial page view tracking error:', error);
    }
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackSignup,
    trackRankingCreated,
    trackCommentPosted,
    trackQuizCompleted,
    trackFormStep,
    trackRankingFlow,
  };
};
