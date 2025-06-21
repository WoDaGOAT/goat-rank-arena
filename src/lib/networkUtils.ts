
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
         errorMessage.includes('connect.facebook.net');
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
    if (isExternalResourceError(error)) {
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
      if (isExternalResourceError(error)) {
        console.warn('External script blocked or failed to load:', src);
        resolve(); // Don't reject for external resource errors
      } else {
        reject(new Error(`Failed to load script: ${src}`));
      }
    };
    
    document.head.appendChild(script);
  });
};
