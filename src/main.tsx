
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import DevelopmentConsole from './lib/developmentUtils';
import * as Sentry from "@sentry/react";

console.log('main.tsx: Starting application initialization');

// Initialize Sentry before everything else
Sentry.init({
  dsn: "https://25839b27189d7e884d917cf967d45a2b@o4509554939527168.ingest.de.sentry.io/4509558829219920",
  environment: import.meta.env.MODE,
  enabled: true, // Temporarily enabled for testing - will be reverted to import.meta.env.PROD
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  tracesSampleRate: 1.0,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  beforeSend(event, hint) {
    console.log('Sentry beforeSend called with event:', event);
    
    // Don't send external resource errors or development errors
    const error = hint.originalException;
    if (error && typeof error === 'object') {
      const errorMessage = error.toString();
      
      // Allow our test error through
      if (errorMessage.includes('This is your first error!')) {
        console.log('Sentry: Allowing test error through');
        return event;
      }
      
      // Filter out external resource errors using existing logic
      if (errorMessage.includes('ERR_BLOCKED_BY_CLIENT') ||
          errorMessage.includes('ERR_FAILED') ||
          errorMessage.includes('ERR_NETWORK_CHANGED') ||
          errorMessage.includes('chrome-extension') ||
          errorMessage.includes('Failed to load resource') ||
          errorMessage.includes('sandbox') ||
          errorMessage.includes('lovableproject.com') ||
          errorMessage.includes('WebSocket connection') ||
          errorMessage.includes('NetworkError')) {
        console.log('Sentry: Filtering out external error:', errorMessage);
        return null; // Don't send to Sentry
      }
    }
    
    console.log('Sentry: Sending event to Sentry');
    return event;
  }
});

console.log('Sentry initialized successfully');

// Initialize development console to suppress external errors
DevelopmentConsole.init();

console.log('main.tsx: About to render app');

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

console.log('main.tsx: App render initiated');
