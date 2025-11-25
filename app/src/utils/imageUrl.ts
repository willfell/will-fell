/**
 * Image URL utility for environment-aware image serving
 *
 * - Development: Returns local paths from /public/images
 * - Production: Prepends CloudFront CDN URL
 */

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

/**
 * Get the appropriate URL for an image based on environment
 * @param path - Image path starting with /images/...
 * @returns Full URL for production, local path for development
 */
export function getImageUrl(path: string): string {
  if (!path) return '';

  // If no base URL configured (development), return original path
  if (!IMAGE_BASE_URL) {
    return path;
  }

  // Only prefix paths that start with /images/
  if (path.startsWith('/images/')) {
    return `${IMAGE_BASE_URL}${path}`;
  }

  return path;
}

/**
 * Check if a path is a valid image path
 * @param path - Path to validate
 */
export function isValidImagePath(path: string): boolean {
  if (!path) return false;
  return (
    path.startsWith('/images/') && /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(path)
  );
}

/**
 * Get optimized image path (WebP version if available)
 * @param path - Original image path
 * @param format - Desired format ('webp' | 'avif')
 */
export function getOptimizedImagePath(
  path: string,
  format: 'webp' | 'avif' = 'webp'
): string {
  if (!path) return '';

  // Replace extension with optimized format
  const optimizedPath = path.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
  return getImageUrl(optimizedPath);
}
