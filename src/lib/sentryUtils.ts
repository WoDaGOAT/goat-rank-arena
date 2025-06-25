
import * as Sentry from "@sentry/react";
import { User } from "@supabase/supabase-js";

export const setSentryUser = (user: User | null) => {
  Sentry.setUser(user ? {
    id: user.id,
    email: user.email,
    username: user.user_metadata?.full_name || user.email?.split('@')[0]
  } : null);
};

export const addSentryBreadcrumb = (
  message: string, 
  category: string = 'user', 
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000
  });
};

export const setSentryTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

export const setSentryContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

export const captureFeedback = (eventId: string, name?: string, email?: string, comments?: string) => {
  Sentry.captureFeedback({
    message: comments || 'No additional feedback provided',
    name: name || 'Anonymous',
    email: email || 'unknown@example.com',
    associatedEventId: eventId
  });
};
