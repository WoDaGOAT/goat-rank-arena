
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SecurityEvent {
  type: 'failed_auth' | 'suspicious_activity' | 'admin_action' | 'data_breach_attempt';
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecurityMonitoring = () => {
  const [isLogging, setIsLogging] = useState(false);

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    if (isLogging) return; // Prevent recursive logging
    
    setIsLogging(true);
    try {
      // Log to analytics_events table with security context
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'security_event',
          properties: {
            security_type: event.type,
            severity: event.severity,
            details: event.details,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
          },
          user_id: (await supabase.auth.getUser()).data.user?.id || null
        });

      if (error) {
        console.warn('Failed to log security event:', error);
      }

      // Show user-friendly message for high severity events
      if (event.severity === 'high' || event.severity === 'critical') {
        toast.error('Security alert: Please contact support if you believe this is in error.');
      }
    } catch (error) {
      console.warn('Security logging failed:', error);
    } finally {
      setIsLogging(false);
    }
  }, [isLogging]);

  const logFailedAuth = useCallback((details: Record<string, any>) => {
    logSecurityEvent({
      type: 'failed_auth',
      details,
      severity: 'medium'
    });
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback((details: Record<string, any>) => {
    logSecurityEvent({
      type: 'suspicious_activity',
      details,
      severity: 'high'
    });
  }, [logSecurityEvent]);

  const logAdminAction = useCallback((details: Record<string, any>) => {
    logSecurityEvent({
      type: 'admin_action',
      details,
      severity: 'low'
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logFailedAuth,
    logSuspiciousActivity,
    logAdminAction
  };
};
