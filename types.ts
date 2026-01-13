export interface EventCard {
  id: string;
  title: string;
  description: string;
  image: string;
  day: 1 | 2;
  vibe: 'thriller' | 'fantasy' | 'action' | 'horror' | 'adventure' | 'crime';
  google_forms?: string | null;
}

export type Tagline = string;

// Team member types - Supabase ready
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  type: 'staff' | 'student';
  order?: number;
}

// Statistics types - Supabase ready
export interface Statistic {
  id: string;
  label: string;
  value: string;
  order: number;
}

// UI Text content types - Supabase ready
export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface OnboardingContent {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface SectionContent {
  id: string;
  sectionKey: string;
  label: string;
  title: string;
  description?: string;
}

export interface ButtonLabel {
  id: string;
  key: string;
  text: string;
}

export interface AboutContent {
  id: string;
  paragraphs: string[];
}

export interface FooterContent {
  id: string;
  copyrightText: string;
  note?: string;
}

// Taglines (can remain as simple array)
export type TaglineData = {
  id: string;
  text: string;
  order: number;
};

// Gallery Image type
export interface GalleryImage {
  id: string;
  image_url: string;
  order?: number;
  is_featured?: boolean;
  created_at: string;
}
