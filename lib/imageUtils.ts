import { supabase } from './supabase';

/**
 * Image optimization utility for Supabase Storage
 * Reduces bandwidth by serving appropriately sized images
 */

// Predefined image sizes for different use cases
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 300, quality: 60 },
  preview: { width: 400, height: 600, quality: 70 },
  card: { width: 600, height: 400, quality: 75 },
  gallery: { width: 800, height: 1200, quality: 80 },
  fullscreen: { width: 1920, height: 1080, quality: 85 },
} as const;

type ImageSize = keyof typeof IMAGE_SIZES;

interface TransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'origin';
}

/**
 * Check if URL is from Supabase Storage
 */
export const isSupabaseStorageUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('supabase.co/storage/v1/object/public/');
};

/**
 * Extract bucket and path from Supabase Storage URL
 */
export const parseSupabaseUrl = (url: string): { bucket: string; path: string } | null => {
  if (!isSupabaseStorageUrl(url)) return null;
  
  try {
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (match) {
      return { bucket: match[1], path: match[2] };
    }
  } catch {
    // Fall through
  }
  return null;
};

/**
 * Get optimized image URL with Supabase transformations
 * Falls back to original URL for non-Supabase images
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  size: ImageSize | TransformOptions = 'gallery'
): string => {
  if (!originalUrl) return '';
  
  // If not a Supabase storage URL, return as-is (e.g., Unsplash URLs)
  if (!isSupabaseStorageUrl(originalUrl)) {
    // For Unsplash, we can append size params
    if (originalUrl.includes('unsplash.com')) {
      const sizeConfig = typeof size === 'string' ? IMAGE_SIZES[size] : size;
      const separator = originalUrl.includes('?') ? '&' : '?';
      return `${originalUrl}${separator}w=${sizeConfig.width || 800}&q=${sizeConfig.quality || 80}&fm=webp`;
    }
    return originalUrl;
  }
  
  // Parse Supabase URL
  const parsed = parseSupabaseUrl(originalUrl);
  if (!parsed) return originalUrl;
  
  // Get size configuration
  const sizeConfig = typeof size === 'string' ? IMAGE_SIZES[size] : size;
  
  // Generate transformed URL using Supabase's render endpoint
  // Supabase Image Transformation: /render/image/[bucket]/[path]
  const transformParams = new URLSearchParams();
  if (sizeConfig.width) transformParams.set('width', sizeConfig.width.toString());
  if (sizeConfig.height) transformParams.set('height', sizeConfig.height.toString());
  if (sizeConfig.quality) transformParams.set('quality', sizeConfig.quality.toString());
  transformParams.set('format', sizeConfig.format || 'webp');
  
  // Construct the transformed URL
  // Note: Supabase uses /render/image endpoint for transformations
  const baseUrl = originalUrl.split('/storage/v1/object/public/')[0];
  return `${baseUrl}/storage/v1/render/image/public/${parsed.bucket}/${parsed.path}?${transformParams.toString()}`;
};

/**
 * Get srcset for responsive images
 */
export const getResponsiveSrcSet = (originalUrl: string): string => {
  if (!originalUrl) return '';
  
  const sizes = [
    { width: 400, suffix: '400w' },
    { width: 800, suffix: '800w' },
    { width: 1200, suffix: '1200w' },
  ];
  
  return sizes
    .map(({ width, suffix }) => {
      const optimizedUrl = getOptimizedImageUrl(originalUrl, { width, quality: 80 });
      return `${optimizedUrl} ${suffix}`;
    })
    .join(', ');
};

/**
 * Preload critical images for better performance
 */
export const preloadImage = (url: string, size: ImageSize = 'gallery'): void => {
  const optimizedUrl = getOptimizedImageUrl(url, size);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizedUrl;
  document.head.appendChild(link);
};

/**
 * Get placeholder blur data URL (tiny base64 image)
 */
export const getPlaceholderUrl = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, { width: 20, height: 30, quality: 10 });
};
