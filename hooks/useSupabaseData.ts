import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useSiteData } from '../contexts/SiteDataContext';
import type {
  EventCard,
  TeamMember,
  Statistic,
  HeroContent,
  AboutContent,
  FooterContent,
  GalleryImage,
} from '../types';

// =============================================
// STORAGE BUCKET OPERATIONS (unchanged)
// =============================================

export interface StorageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
}

// Helper function to extract file path from Supabase URL
const extractPathFromUrl = (url: string, bucketName: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${bucketName}/(.+)$`));
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
};

// Generic Storage Operations Hook (unchanged - these need direct API calls)
export const useStorageOperations = () => {
  const uploadToStorage = async (bucket: string, file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const deleteFromStorage = async (bucket: string, url: string): Promise<void> => {
    const filePath = extractPathFromUrl(url, bucket);
    if (!filePath) {
      console.warn('Could not extract file path from URL:', url);
      return;
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  };

  const listFiles = async (bucket: string): Promise<StorageFile[]> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    return data.map((file) => {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
      return {
        id: file.id,
        name: file.name,
        url: urlData.publicUrl,
        size: file.metadata?.size || 0,
        created_at: file.created_at || new Date().toISOString(),
      };
    });
  };

  return {
    uploadToStorage,
    deleteFromStorage,
    listFiles,
  };
};

// =============================================
// OPTIMIZED HOOKS - Using Context
// These now read from the centralized SiteDataContext
// instead of making individual API calls
// =============================================

// Hook for fetching hero content
export const useHeroContent = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('heroContent'), [refetchSection]);

  return {
    data: siteData?.heroContent || null,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching about content
export const useAboutContent = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('aboutContent'), [refetchSection]);

  return {
    data: siteData?.aboutContent || null,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching statistics
export const useStatistics = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('statistics'), [refetchSection]);

  return {
    data: siteData?.statistics || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching team members
export const useTeamMembers = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('teamMembers'), [refetchSection]);

  return {
    data: siteData?.teamMembers || [],
    staffMembers: siteData?.staffMembers || [],
    studentMembers: siteData?.studentMembers || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching events
export const useEvents = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('events'), [refetchSection]);

  return {
    data: siteData?.events || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching gallery images
export const useGalleryImages = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('galleryImages'), [refetchSection]);

  return {
    data: siteData?.galleryImages || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching featured gallery images only
export const useFeaturedGalleryImages = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('galleryImages'), [refetchSection]);

  // Filter featured images from the gallery
  const featuredImages = siteData?.galleryImages?.filter((img: GalleryImage) => img.is_featured) || [];

  return {
    data: featuredImages,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching onboarding content
export const useOnboardingContent = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('onboardingContent'), [refetchSection]);

  return {
    data: siteData?.onboardingContent || null,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching section content
export const useSectionContent = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('sectionContent'), [refetchSection]);

  // Helper function to get section by key
  const getSectionByKey = useCallback(
    (key: string) => siteData?.sectionContent?.find(section => section.section_key === key),
    [siteData?.sectionContent]
  );

  return {
    data: siteData?.sectionContent || [],
    getSectionByKey,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching button labels
export const useButtonLabels = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('buttonLabels'), [refetchSection]);

  // Helper function to get button label by key
  const getButtonByKey = useCallback(
    (key: string) => siteData?.buttonLabels?.find(btn => btn.key === key)?.text || '',
    [siteData?.buttonLabels]
  );

  return {
    data: siteData?.buttonLabels || [],
    getButtonByKey,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching footer content
export const useFooterContent = () => {
  const { data: siteData, loading, error, refetchSection } = useSiteData();

  const refetch = useCallback(() => refetchSection('footerContent'), [refetchSection]);

  return {
    data: siteData?.footerContent || null,
    loading,
    error,
    refetch,
  };
};

// =============================================
// ADMIN DOCUMENTS HOOK (unchanged - storage operations)
// =============================================

export interface AdminDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  uploaded_at: string;
}

export const useAdminDocuments = () => {
  const [data, setData] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { listFiles } = useStorageOperations();

  const fetchData = async () => {
    try {
      setLoading(true);
      const files = await listFiles('admin-documents');
      setData(files.map(f => ({
        id: f.id,
        name: f.name,
        url: f.url,
        size: f.size,
        uploaded_at: f.created_at,
      })));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
