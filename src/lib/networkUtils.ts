
/**
 * Utility functions for handling network errors and resource loading
 */

/**
 * Checks if an error is caused by external factors (browser extensions, ad blockers, etc.)
 */
export const isExternalResourceError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || '';
  
  return errorMessage.includes('ERR_BLOCKED_BY_CLIENT') ||
         errorMessage.includes('ERR_FAILED') ||
         errorMessage.includes('chrome-extension') ||
         errorMessage.includes('fbevents.js') ||
         errorMessage.includes('connect.facebook.net') ||
         errorMessage.includes('WebSocket connection to') ||
         errorMessage.includes('ws://') ||
         errorMessage.includes('wss://') ||
         errorMessage.includes('Failed to construct') ||
         errorMessage.includes('NetworkError') ||
         errorMessage.includes('NETWORK_ERROR');
};

/**
 * Checks if an error is caused by development tools or Hot Module Replacement
 */
export const isDevelopmentToolError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || '';
  
  return errorMessage.includes('HMR') ||
         errorMessage.includes('hot reload') ||
         errorMessage.includes('dev-server') ||
         errorMessage.includes('webpack') ||
         errorMessage.includes('vite') ||
         errorMessage.includes('localhost') ||
         errorMessage.includes('127.0.0.1') ||
         errorMessage.includes('::1');
};

/**
 * Checks if we're in development environment
 */
export const isDevelopmentEnvironment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

/**
 * Filters and categorizes errors to suppress external noise
 */
export const shouldSuppressError = (error: any): boolean => {
  if (isDevelopmentEnvironment()) {
    // In development, suppress external tool errors
    if (isDevelopmentToolError(error) || isExternalResourceError(error)) {
      return true;
    }
  }
  
  return isExternalResourceError(error);
};

/**
 * Safe fetch wrapper that handles common network errors gracefully
 */
export const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    if (shouldSuppressError(error)) {
      console.warn('External resource fetch failed (likely blocked):', url);
      return null;
    }
    
    console.error('Network request failed:', url, error);
    throw error;
  }
};

/**
 * Safely loads external scripts with error handling
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = (error) => {
      if (shouldSuppressError(error)) {
        console.warn('External script blocked or failed to load:', src);
        resolve(); // Don't reject for external resource errors
      } else {
        reject(new Error(`Failed to load script: ${src}`));
      }
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Enhanced console logging with error categorization
 */
export const logError = (error: any, context?: string) => {
  if (shouldSuppressError(error)) {
    // Use a less intrusive log level for external errors
    console.debug(`[External Error${context ? ` - ${context}` : ''}]:`, error.message || error);
    return;
  }
  
  // Log actual application errors normally
  console.error(`[App Error${context ? ` - ${context}` : ''}]:`, error);
};
