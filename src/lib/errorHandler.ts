
import { toast } from 'sonner';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import React from 'react';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export class SecureError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: ErrorContext
  ) {
    super(message);
    this.name = 'SecureError';
  }
}

export const handleSecureError = (
  error: Error | SecureError,
  context?: ErrorContext
): void => {
  console.error('Secure error handler:', error, context);

  // Don't expose sensitive information in error messages
  const sanitizedMessage = sanitizeErrorMessage(error.message);
  
  // Show user-friendly error message
  if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
    toast.error('Access denied. Please check your permissions.');
  } else if (error.message.includes('network') || error.message.includes('fetch')) {
    toast.error('Network error. Please check your connection and try again.');
  } else if (error.message.includes('validation')) {
    toast.error('Invalid input. Please check your data and try again.');
  } else {
    toast.error('An error occurred. Please try again.');
  }

  // Log security-relevant errors
  if (isSecurityRelevant(error)) {
    // Note: This would need to be called from a component context
    console.warn('Security-relevant error detected:', {
      action: 'security_error_detected',
      error_type: error.name,
      error_code: (error as SecureError).code,
      component: context?.component,
      user_id: context?.userId
    });
  }
};

const sanitizeErrorMessage = (message: string): string => {
  // Remove sensitive information from error messages
  const sensitivePatterns = [
    /password/gi,
    /token/gi,
    /key/gi,
    /secret/gi,
    /auth/gi,
    /uuid:[a-f0-9-]+/gi,
    /id:\s*[a-f0-9-]+/gi
  ];

  let sanitized = message;
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
};

const isSecurityRelevant = (error: Error): boolean => {
  const securityKeywords = [
    'unauthorized',
    'forbidden',
    'authentication',
    'permission',
    'security',
    'row-level',
    'rls',
    'admin',
    'privileges'
  ];

  return securityKeywords.some(keyword => 
    error.message.toLowerCase().includes(keyword)
  );
};

// Enhanced error boundary for security
export const withSecurityErrorBoundary = <T extends React.ComponentType<any>>(
  Component: T,
  fallbackComponent?: React.ComponentType
): React.ComponentType<React.ComponentProps<T>> => {
  const WrappedComponent: React.ComponentType<React.ComponentProps<T>> = (props) => {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      handleSecureError(error as Error, {
        component: Component.name
      });
      
      if (fallbackComponent) {
        return React.createElement(fallbackComponent);
      }
      
      return React.createElement('div', {}, 'Something went wrong. Please refresh the page.');
    }
  };

  return WrappedComponent;
};
