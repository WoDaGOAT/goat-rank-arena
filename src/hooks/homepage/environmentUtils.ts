
// Detect if we're in Lovable preview environment
export const isPreviewEnvironment = () => {
  return window.location.hostname.includes('lovableproject.com') || 
         window.location.hostname.includes('localhost') ||
         process.env.NODE_ENV === 'development';
};
