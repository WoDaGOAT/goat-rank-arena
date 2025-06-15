
import DOMPurify from 'dompurify';

/**
 * Sanitizes a string to prevent XSS attacks.
 * It removes any HTML tags from the string.
 * @param dirty - The string to sanitize.
 * @returns The sanitized string, or an empty string if the input is null or undefined.
 */
export const sanitize = (dirty: string | null | undefined): string => {
  if (!dirty) {
    return '';
  }
  // We will strip all HTML, as user-generated content should not contain any.
  // This is the safest configuration.
  return DOMPurify.sanitize(dirty, { USE_PROFILES: { html: false } });
};
