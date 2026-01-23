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
 * 
 * NOTE: Supabase Image Transformations require a paid plan.
 * For free tier, we return the original URL without transformations.
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  size: ImageSize | TransformOptions = 'gallery'
): string => {
  if (!originalUrl) return '';
  
  // If not a Supabase storage URL, check for other optimizations
  if (!isSupabaseStorageUrl(originalUrl)) {
    // For Unsplash, we can append size params
    if (originalUrl.includes('unsplash.com')) {
      const sizeConfig = typeof size === 'string' ? IMAGE_SIZES[size] : size;
      const separator = originalUrl.includes('?') ? '&' : '?';
      return `${originalUrl}${separator}w=${sizeConfig.width || 800}&q=${sizeConfig.quality || 80}&fm=webp`;
    }
    return originalUrl;
  }
  
  // For Supabase storage URLs, return the original URL directly
  // Image transformations via /render/image endpoint require a paid Supabase plan
  // To avoid broken images, we serve the original unoptimized image
  return originalUrl;
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
