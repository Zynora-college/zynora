import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, IMAGE_SIZES } from '../../lib/imageUtils';

type ImageSize = keyof typeof IMAGE_SIZES;

interface OptimizedImageProps {
  src: string;
  alt: string;
  size?: ImageSize;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
}

/**
 * Optimized Image component that:
 * 1. Serves appropriately sized images based on use case
 * 2. Lazy loads non-critical images
 * 3. Shows placeholder while loading
 * 4. Handles loading states gracefully
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  size = 'gallery',
  className = '',
  onClick,
  priority = false,
  objectFit = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Get optimized URL
  const optimizedSrc = getOptimizedImageUrl(src, size);
  
  // Get a tiny placeholder for blur effect
  const placeholderSrc = getOptimizedImageUrl(src, { width: 20, quality: 10 });

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Preload priority images
  useEffect(() => {
    if (priority && optimizedSrc) {
      const img = new Image();
      img.src = optimizedSrc;
    }
  }, [priority, optimizedSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div 
        className={`bg-neutral-800 flex items-center justify-center ${className}`}
        style={{ objectFit }}
      >
        <span className="text-gray-500 text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {/* Placeholder/blur background */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-neutral-900 animate-pulse"
          style={{
            backgroundImage: placeholderSrc ? `url(${placeholderSrc})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          w-full h-full transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ objectFit }}
      />
    </div>
  );
};

export default OptimizedImage;
