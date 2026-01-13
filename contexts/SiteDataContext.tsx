import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { supabase } from '../lib/supabase';
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
// CACHE CONFIGURATION
// =============================================
const CACHE_KEY = 'zynora_site_data_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000; // 1 second

interface CacheEntry {
  data: RawSiteData;
  timestamp: number;
}

// =============================================
// REQUEST DEDUPLICATION
// In-flight request tracker to prevent duplicate fetches
// =============================================
let inFlightRequest: Promise<RawSiteData | null> | null = null;

// =============================================
// CACHE HELPERS
// =============================================
const getCachedData = (): RawSiteData | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const entry: CacheEntry = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
    
    // Cache expired, remove it
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
};

const setCachedData = (data: RawSiteData): void => {
  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache site data:', error);
  }
};

const clearCache = (): void => {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore errors
  }
};

// =============================================
// RETRY WITH EXPONENTIAL BACKOFF
// =============================================
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async <T,>(
  fetchFn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = BASE_RETRY_DELAY,
  signal?: AbortSignal
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Check if request was aborted
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }
      
      return await fetchFn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on abort
      if (signal?.aborted || error.message === 'Request aborted') {
        throw error;
      }
      
      // Last attempt, don't wait
      if (attempt === retries - 1) {
        break;
      }
      
      // Exponential backoff with jitter
      const jitter = Math.random() * 500;
      const waitTime = delay * Math.pow(2, attempt) + jitter;
      console.log(`Retry attempt ${attempt + 1}/${retries} after ${Math.round(waitTime)}ms`);
      await sleep(waitTime);
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
};

// =============================================
// TYPE DEFINITIONS
// =============================================

interface RawHeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primary_button_text: string;
  secondary_button_text: string;
}

interface RawFooterContent {
  id: string;
  copyright_text: string;
  note?: string;
}

interface RawOnboardingContent {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
}

interface RawSectionContent {
  id: string;
  section_key: string;
  label: string;
  title: string;
  description?: string;
}

interface RawButtonLabel {
  id: string;
  key: string;
  text: string;
}

interface RawGalleryImage {
  id: string;
  image_url: string;
  order?: number;
  is_featured?: boolean;
  created_at: string;
}

interface RawSiteData {
  hero_content: RawHeroContent | null;
  about_content: AboutContent | null;
  onboarding_content: RawOnboardingContent | null;
  footer_content: RawFooterContent | null;
  statistics: Statistic[];
  team_members: TeamMember[];
  events: EventCard[];
  gallery_images: RawGalleryImage[];
  section_content: RawSectionContent[];
  button_labels: RawButtonLabel[];
}

// Transformed data for frontend consumption
export interface SiteData {
  heroContent: HeroContent | null;
  aboutContent: AboutContent | null;
  onboardingContent: {
    id: string;
    title: string;
    subtitle: string;
    buttonText: string;
  } | null;
  footerContent: FooterContent | null;
  statistics: Statistic[];
  teamMembers: TeamMember[];
  staffMembers: TeamMember[];
  studentMembers: TeamMember[];
  events: EventCard[];
  galleryImages: GalleryImage[];
  sectionContent: RawSectionContent[];
  buttonLabels: RawButtonLabel[];
}

interface SiteDataContextValue {
  data: SiteData | null;
  loading: boolean;
  error: string | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
  refetchSection: (section: keyof SiteData) => Promise<void>;
  clearCache: () => void;
}

// =============================================
// CONTEXT CREATION
// =============================================

const SiteDataContext = createContext<SiteDataContextValue | undefined>(undefined);

// =============================================
// DATA TRANSFORMATION HELPERS
// =============================================

const transformHeroContent = (raw: RawHeroContent | null): HeroContent | null => {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    description: raw.description,
    primaryButtonText: raw.primary_button_text,
    secondaryButtonText: raw.secondary_button_text,
  };
};

const transformFooterContent = (raw: RawFooterContent | null): FooterContent | null => {
  if (!raw) return null;
  return {
    id: raw.id,
    copyrightText: raw.copyright_text,
    note: raw.note,
  };
};

const transformOnboardingContent = (raw: RawOnboardingContent | null) => {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    buttonText: raw.button_text,
  };
};

const transformRawData = (raw: RawSiteData): SiteData => {
  const teamMembers = raw.team_members || [];
  
  return {
    heroContent: transformHeroContent(raw.hero_content),
    aboutContent: raw.about_content,
    onboardingContent: transformOnboardingContent(raw.onboarding_content),
    footerContent: transformFooterContent(raw.footer_content),
    statistics: raw.statistics || [],
    teamMembers: teamMembers,
    staffMembers: teamMembers.filter(m => m.type === 'staff'),
    studentMembers: teamMembers.filter(m => m.type === 'student'),
    events: raw.events || [],
    galleryImages: (raw.gallery_images || []).map(img => ({
      id: img.id,
      image_url: img.image_url,
      order: img.order,
      is_featured: img.is_featured || false,
      created_at: img.created_at,
    })),
    sectionContent: raw.section_content || [],
    buttonLabels: raw.button_labels || [],
  };
};

// =============================================
// PROVIDER COMPONENT
// =============================================

interface SiteDataProviderProps {
  children: ReactNode;
}

export const SiteDataProvider: React.FC<SiteDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Core fetch function that handles RPC with proper retries
  const fetchFromSupabase = useCallback(async (signal?: AbortSignal): Promise<RawSiteData | null> => {
    // Try RPC first with retry logic
    const fetchRPC = async (): Promise<RawSiteData> => {
      // Create a timeout promise
      const timeoutId = setTimeout(() => {}, 15000);
      
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_all_site_content');
        clearTimeout(timeoutId);
        
        if (rpcError) {
          throw new Error(`RPC Error: ${rpcError.message}`);
        }
        
        if (!rpcData) {
          throw new Error('No data returned from RPC');
        }
        
        return rpcData as RawSiteData;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    try {
      // Attempt RPC with retry
      return await fetchWithRetry(fetchRPC, MAX_RETRIES, BASE_RETRY_DELAY, signal);
    } catch (rpcError: any) {
      console.warn('RPC failed after retries, falling back to parallel queries:', rpcError.message);
      
      // Check abort before fallback
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }
      
      // Fallback to parallel queries with batching to reduce connection pressure
      return await fetchWithParallelQueries(signal);
    }
  }, []);

  // Request deduplication: ensure only one fetch runs at a time
  const fetchWithDeduplication = useCallback(async (signal?: AbortSignal): Promise<RawSiteData | null> => {
    // If there's already an in-flight request, wait for it
    if (inFlightRequest) {
      console.log('Deduplicating request - waiting for in-flight request');
      return inFlightRequest;
    }

    // Create new request
    inFlightRequest = fetchFromSupabase(signal);
    
    try {
      const result = await inFlightRequest;
      return result;
    } finally {
      // Clear in-flight request
      inFlightRequest = null;
    }
  }, [fetchFromSupabase]);

  // Main fetch function with caching
  const fetchAllData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData) {
          console.log('Using cached site data');
          setData(transformRawData(cachedData));
          setLoading(false);
          setError(null);
          return;
        }
      }

      setLoading(true);
      setError(null);

      const rawData = await fetchWithDeduplication(signal);

      if (rawData) {
        // Cache the raw data
        setCachedData(rawData);
        setData(transformRawData(rawData));
      }
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.message === 'Request aborted') {
        console.log('Request was aborted');
        return;
      }
      
      console.error('Error fetching site data:', err);
      setError(err.message);
      
      // Provide minimal fallback data on complete failure
      setData({
        heroContent: { id: '1', title: 'ZYNORA', subtitle: 'Enter the Legends', description: '', primaryButtonText: 'Register Now', secondaryButtonText: 'Learn More' },
        aboutContent: null,
        onboardingContent: { id: '1', title: 'ZYNORA', subtitle: 'Enter the Legends', buttonText: 'ENTER THE VOID' },
        footerContent: { id: '1', copyrightText: 'ZYNORA CINEMATIC FEST. ALL RIGHTS RESERVED.', note: null },
        statistics: [],
        teamMembers: [],
        staffMembers: [],
        studentMembers: [],
        events: [],
        galleryImages: [],
        sectionContent: [],
        buttonLabels: [],
      });
    } finally {
      setLoading(false);
    }
  }, [fetchWithDeduplication]);

  // Fallback: Fetch all data with batched parallel queries to reduce connection pressure
  const fetchWithParallelQueries = async (signal?: AbortSignal): Promise<RawSiteData> => {
    // Check abort before starting
    if (signal?.aborted) {
      throw new Error('Request aborted');
    }

    try {
      // Batch 1: Critical content (smaller queries first)
      const batch1Promise = Promise.all([
        supabase.from('hero_content').select('*').single(),
        supabase.from('about_content').select('*').single(),
        supabase.from('onboarding_content').select('*').single(),
        supabase.from('footer_content').select('*').single(),
      ]);

      // Batch 2: Lists
      const batch2Promise = Promise.all([
        supabase.from('statistics').select('*').order('order', { ascending: true }),
        supabase.from('team_members').select('*').order('order', { ascending: true }),
        supabase.from('section_content').select('*'),
        supabase.from('button_labels').select('*'),
      ]);

      // Execute batch 1 first
      const batch1Results = await batch1Promise;
      
      // Check abort between batches
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }

      // Execute batch 2
      const batch2Results = await batch2Promise;

      // Check abort before batch 3
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }

      // Batch 3: Heavier queries (images and events)
      const batch3Results = await Promise.all([
        supabase.from('events').select('*').order('day', { ascending: true }),
        supabase.from('gallery_images').select('*').order('order', { ascending: true }),
      ]);

      const [heroRes, aboutRes, onboardingRes, footerRes] = batch1Results;
      const [statsRes, teamRes, sectionsRes, buttonsRes] = batch2Results;
      const [eventsRes, galleryRes] = batch3Results;

      const rawData: RawSiteData = {
        hero_content: heroRes.data,
        about_content: aboutRes.data,
        onboarding_content: onboardingRes.data,
        footer_content: footerRes.data,
        statistics: statsRes.data || [],
        team_members: teamRes.data || [],
        events: eventsRes.data || [],
        gallery_images: galleryRes.data || [],
        section_content: sectionsRes.data || [],
        button_labels: buttonsRes.data || [],
      };

      return rawData;
    } catch (err: any) {
      console.error('Parallel fetch failed:', err);
      throw err;
    }
  };

  // Refetch a specific section (for admin updates)
  const refetchSection = useCallback(async (section: keyof SiteData) => {
    if (!data) return;

    try {
      let updatedData = { ...data };

      switch (section) {
        case 'heroContent': {
          const { data: heroData } = await supabase.from('hero_content').select('*').single();
          updatedData.heroContent = transformHeroContent(heroData);
          break;
        }
        case 'aboutContent': {
          const { data: aboutData } = await supabase.from('about_content').select('*').single();
          updatedData.aboutContent = aboutData;
          break;
        }
        case 'onboardingContent': {
          const { data: onboardingData } = await supabase.from('onboarding_content').select('*').single();
          updatedData.onboardingContent = transformOnboardingContent(onboardingData);
          break;
        }
        case 'footerContent': {
          const { data: footerData } = await supabase.from('footer_content').select('*').single();
          updatedData.footerContent = transformFooterContent(footerData);
          break;
        }
        case 'statistics': {
          const { data: statsData } = await supabase.from('statistics').select('*').order('order', { ascending: true });
          updatedData.statistics = statsData || [];
          break;
        }
        case 'teamMembers':
        case 'staffMembers':
        case 'studentMembers': {
          const { data: teamData } = await supabase.from('team_members').select('*').order('order', { ascending: true });
          const members = teamData || [];
          updatedData.teamMembers = members;
          updatedData.staffMembers = members.filter(m => m.type === 'staff');
          updatedData.studentMembers = members.filter(m => m.type === 'student');
          break;
        }
        case 'events': {
          const { data: eventsData } = await supabase.from('events').select('*').order('day', { ascending: true });
          updatedData.events = eventsData || [];
          break;
        }
        case 'galleryImages': {
          const { data: galleryData } = await supabase.from('gallery_images').select('*').order('order', { ascending: true });
          updatedData.galleryImages = (galleryData || []).map(img => ({
            id: img.id,
            image_url: img.image_url,
            order: img.order,
            is_featured: img.is_featured || false,
            created_at: img.created_at,
          }));
          break;
        }
        case 'sectionContent': {
          const { data: sectionData } = await supabase.from('section_content').select('*');
          updatedData.sectionContent = sectionData || [];
          break;
        }
        case 'buttonLabels': {
          const { data: buttonData } = await supabase.from('button_labels').select('*');
          updatedData.buttonLabels = buttonData || [];
          break;
        }
      }

      setData(updatedData);
    } catch (err: any) {
      console.error(`Error refetching ${section}:`, err);
    }
  }, [data]);

  // Initial fetch on mount
  useEffect(() => {
    fetchAllData();
    
    // Cleanup: abort any pending requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAllData]);

  const value: SiteDataContextValue = {
    data,
    loading,
    error,
    refetch: fetchAllData,
    refetchSection,
    clearCache,
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
};

// =============================================
// CUSTOM HOOK
// =============================================

export const useSiteData = (): SiteDataContextValue => {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};

export default SiteDataContext;
