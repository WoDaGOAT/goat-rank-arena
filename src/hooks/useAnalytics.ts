
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
  };

  // Track analytics event
  const trackEvent = useCallback(async (
    eventType: string, 
    properties: Record<string, any> = {}
  ) => {
    const sessionId = getSessionId();
    const trafficSource = getTrafficSource();
    
    try {
      await supabase.from('analytics_events').insert({
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
      });

      // Update or create user session
      await supabase.from('user_sessions').upsert({
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
      }, {
        onConflict: 'session_id',
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [user, getSessionId, getTrafficSource]);

  // Track page view
  const trackPageView = useCallback((page: string, additionalData?: Record<string, any>) => {
    trackEvent('page_view', { page, ...additionalData });
  }, [trackEvent]);

  // Track signup
  const trackSignup = useCallback((method?: string) => {
    trackEvent('signup', { method });
  }, [trackEvent]);

  // Track ranking created
  const trackRankingCreated = useCallback((categoryId: string, categoryName: string) => {
    trackEvent('ranking_created', { categoryId, categoryName });
  }, [trackEvent]);

  // Track comment posted
  const trackCommentPosted = useCallback((categoryId: string, rankingId?: string) => {
    trackEvent('comment_posted', { categoryId, rankingId });
  }, [trackEvent]);

  // Track quiz completed
  const trackQuizCompleted = useCallback((quizId: string, score: number) => {
    trackEvent('quiz_completed', { quizId, score });
  }, [trackEvent]);

  // Auto-track page views on route changes
  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackSignup,
    trackRankingCreated,
    trackCommentPosted,
    trackQuizCompleted,
  };
};
