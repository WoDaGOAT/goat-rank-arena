
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { createRateLimiter } from '@/lib/security';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface SecurityContextType {
  isSecureSession: boolean;
  checkRateLimit: (action: string) => boolean;
  reportSuspiciousActivity: (activity: string, details?: Record<string, any>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Rate limiters for different actions
const rateLimiters = {
  comment: createRateLimiter(5, 60000), // 5 comments per minute
  ranking: createRateLimiter(3, 300000), // 3 rankings per 5 minutes
  reaction: createRateLimiter(20, 60000), // 20 reactions per minute
  search: createRateLimiter(30, 60000), // 30 searches per minute
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecureSession, setIsSecureSession] = useState(false);
  const { user } = useAuth();
  const { logSuspiciousActivity } = useSecurityMonitoring();

  useEffect(() => {
    // Check if session is secure (HTTPS, valid user, etc.)
    const checkSecureSession = () => {
      const isHttps = window.location.protocol === 'https:';
      const hasValidUser = !!user;
      const isLocalDev = window.location.hostname === 'localhost';
      
      setIsSecureSession(isHttps || isLocalDev);
      
      if (!isHttps && !isLocalDev) {
        logSuspiciousActivity({
          action: 'insecure_connection_detected',
          protocol: window.location.protocol,
          hostname: window.location.hostname
        });
      }
    };

    checkSecureSession();
  }, [user, logSuspiciousActivity]);

  const checkRateLimit = (action: string): boolean => {
    const rateLimiter = rateLimiters[action as keyof typeof rateLimiters];
    if (!rateLimiter) return true;

    const userKey = user?.id || 'anonymous';
    const allowed = rateLimiter(userKey);
    
    if (!allowed) {
      logSuspiciousActivity({
        action: 'rate_limit_exceeded',
        rate_limit_type: action,
        user_id: user?.id
      });
    }
    
    return allowed;
  };

  const reportSuspiciousActivity = (activity: string, details?: Record<string, any>) => {
    logSuspiciousActivity({
      action: activity,
      user_id: user?.id,
      ...details
    });
  };

  return (
    <SecurityContext.Provider value={{
      isSecureSession,
      checkRateLimit,
      reportSuspiciousActivity
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
