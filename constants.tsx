import { 
  EventCard, 
  Tagline, 
  TeamMember, 
  Statistic, 
  HeroContent, 
  OnboardingContent,
  SectionContent,
  ButtonLabel,
  AboutContent,
  FooterContent
} from './types';

// ===================================
// HERO CONTENT
// ===================================
export const HERO_CONTENT: HeroContent = {
  id: 'hero-1',
  title: 'ZYNORA',
  subtitle: 'You have entered the rift. Experience the visceral intersection of cinematic mastery and dark celebration.',
  description: '',
  primaryButtonText: 'Secure Entry',
  secondaryButtonText: 'Explore Vault'
};

// ===================================
// ONBOARDING CONTENT
// ===================================
export const ONBOARDING_CONTENT: OnboardingContent = {
  id: 'onboarding-1',
  title: 'ZYNORA',
  subtitle: 'The Reality Before The Rift',
  buttonText: 'Enter The Void'
};

// ===================================
// TAGLINES (rotating hero taglines)
// ===================================
export const TAGLINES: Tagline[] = [
  "Enter the Stories. Live the Legends.",
  "Where Cinema Meets Celebration.",
  "A Night Inspired by Icons."
];

// ===================================
// ABOUT PAGE CONTENT
// ===================================
export const ABOUT_CONTENT: AboutContent = {
  id: 'about-1',
  paragraphs: [
    'Zynora is not just a cultural fest—it is a celebration of diversity and a dynamic platform for self-expression.',
    'Zynora is not just a cultural fest—it is a celebration of diversity and a dynamic platform for self-expression. It brings together the brightest talents from colleges near and far, offering students the opportunity to shine across dance, music, theatre, fine arts, and literary competitions. Each event is thoughtfully designed to inspire creativity, highlight individual skills, and bring out the best in every participant.'
  ]
};

// ===================================
// SECTION CONTENT (labels and titles)
// ===================================
export const SECTION_CONTENT: SectionContent[] = [
  {
    id: 'home-intro-1',
    sectionKey: 'home-intro',
    label: 'The Cinematic Converge',
    title: 'Experience where reality dissolves into the silver screen.',
    description: ''
  },
  {
    id: 'stats-1',
    sectionKey: 'stats',
    label: 'Fire and Blood',
    title: 'THE SCORE',
    description: ''
  },
  {
    id: 'events-1',
    sectionKey: 'events',
    label: 'Choose Your Legend',
    title: 'The Competitions',
    description: ''
  },
  {
    id: 'coordinators-1',
    sectionKey: 'coordinators',
    label: 'Summon the Kraken',
    title: 'Coordinators',
    description: 'Follow for more update'
  },
  {
    id: 'gallery-preview-1',
    sectionKey: 'gallery-preview',
    label: 'Visuals',
    title: 'Gallery Preview',
    description: ''
  },
  {
    id: 'gallery-full-1',
    sectionKey: 'gallery-full',
    label: 'Full Gallery',
    title: 'Zynora 2K26 Highlight',
    description: ''
  },
  {
    id: 'register-1',
    sectionKey: 'register',
    label: '',
    title: 'THE SCREEN IS WAITING.',
    description: 'Seats are filling up in this cinematic multiverse. Secure your legacy today and be part of the most talked-about night of the year.'
  }
];

// ===================================
// BUTTON LABELS
// ===================================
export const BUTTON_LABELS: ButtonLabel[] = [
  { id: 'btn-1', key: 'register-now', text: 'REGISTER NOW' },
  { id: 'btn-2', key: 'register-now-short', text: 'Register Now' },
  { id: 'btn-3', key: 'secure-entry', text: 'Secure Entry' },
  { id: 'btn-4', key: 'explore-vault', text: 'Explore Vault' },
  { id: 'btn-5', key: 'claim-throne', text: 'Claim Your Throne' },
  { id: 'btn-6', key: 'join-battle', text: 'Join the Battle' },
  { id: 'btn-7', key: 'view-full-gallery', text: 'View Full Gallery' },
  { id: 'btn-8', key: 'phase-01', text: 'Phase 01' },
  { id: 'btn-9', key: 'phase-02', text: 'Phase 02' },
  { id: 'btn-10', key: 'enter-void', text: 'Enter The Void' }
];

// ===================================
// FOOTER CONTENT
// ===================================
export const FOOTER_CONTENT: FooterContent = {
  id: 'footer-1',
  copyrightText: 'ZYNORA CINEMATIC FEST. ALL RIGHTS RESERVED.',
  note: '* Limited slots available per universe'
};

// ===================================
// TEAM DATA (Staff & Students)
// ===================================
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'staff-1',
    name: 'Prof. Sarah Miller',
    role: 'Faculty Head',
    phone: '+91 98765 43210',
    type: 'staff',
    order: 1
  },
  {
    id: 'staff-2',
    name: 'Dr. James Wilson',
    role: 'Cultural Advisor',
    phone: '+91 87654 32109',
    type: 'staff',
    order: 2
  },
  {
    id: 'student-1',
    name: 'Alex Johnson',
    role: 'General Secretary',
    phone: '+91 76543 21098',
    type: 'student',
    order: 1
  },
  {
    id: 'student-2',
    name: 'Elena Gilbert',
    role: 'Event Lead',
    phone: '+91 65432 10987',
    type: 'student',
    order: 2
  },
  {
    id: 'student-3',
    name: 'Stefan Salvatore',
    role: 'Technical Head',
    phone: '+91 54321 09876',
    type: 'student',
    order: 3
  }
];

// Helper functions to filter team members
export const getStaffMembers = () => TEAM_MEMBERS.filter(member => member.type === 'staff').sort((a, b) => (a.order || 0) - (b.order || 0));
export const getStudentMembers = () => TEAM_MEMBERS.filter(member => member.type === 'student').sort((a, b) => (a.order || 0) - (b.order || 0));

// ===================================
// STATISTICS DATA
// ===================================
export const STATISTICS: Statistic[] = [
  { id: 'stat-1', label: 'DAYS', value: '2', order: 1 },
  { id: 'stat-2', label: 'EVENTS', value: '13', order: 2 },
  { id: 'stat-3', label: 'PRIZES', value: '300+', order: 3 },
  { id: 'stat-4', label: 'STALLS', value: '8', order: 4 }
];

// ===================================
// TEAM SECTION LABELS
// ===================================
export const TEAM_LABELS = {
  staffTitle: 'Staff Support',
  studentTitle: 'Student Leads'
};

// ===================================
// GALLERY IMAGES
// ===================================
export const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514525253361-bee8a187449a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496337589254-7e19d01ced44?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1429962714451-bb934ecbb4ec?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
];

// ===================================
// EVENTS DATA
// ===================================
export const EVENTS: EventCard[] = [
  {
    id: 'heist',
    title: 'The Heist Protocol',
    description: 'Strategy games and puzzle cracking. Execute the perfect plan.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    color: 'border-red-600 shadow-red-900/50',
    symbols: ['🎭', '💰', '⏰'],
    day: 1,
    vibe: 'crime'
  },
  {
    id: 'redlight',
    title: 'The Red Light Trial',
    description: 'Competitive games and high-stakes elimination rounds.',
    image: 'https://images.unsplash.com/photo-1634155581321-7076939b033d?auto=format&fit=crop&q=80&w=800',
    color: 'border-pink-600 shadow-pink-900/50',
    symbols: ['◯', '△', '▢'],
    day: 1,
    vibe: 'thriller'
  },
  {
    id: 'throne',
    title: 'The Iron Throne Challenge',
    description: 'Debate, leadership, and team domination. Conquer the land.',
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800',
    color: 'border-yellow-600 shadow-yellow-900/50',
    symbols: ['⚔️', '🐲', '❄️'],
    day: 1,
    vibe: 'fantasy'
  },
  {
    id: 'upside',
    title: 'The Upside Rift',
    description: 'Mystery games and escape-style challenges. Brave the rift.',
    image: 'https://images.unsplash.com/photo-1498747946579-bde604cb8f44?auto=format&fit=crop&q=80&w=800',
    color: 'border-purple-600 shadow-purple-900/50',
    symbols: ['🔦', '🚲', '👾'],
    day: 2,
    vibe: 'horror'
  },
  {
    id: 'blackpearl',
    title: 'The Black Pearl Quest',
    description: 'A massive campus-wide treasure hunt. Follow the maps.',
    image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?auto=format&fit=crop&q=80&w=800',
    color: 'border-cyan-600 shadow-cyan-900/50',
    symbols: ['⚓', '🗺️', '🦜'],
    day: 2,
    vibe: 'adventure'
  },
  {
    id: 'bluelab',
    title: 'The Blue Lab Experiment',
    description: 'Logic games and science-based fun. Apply pure precision.',
    image: 'https://images.unsplash.com/photo-1532187875605-186c7131ed57?auto=format&fit=crop&q=80&w=800',
    color: 'border-blue-600 shadow-blue-900/50',
    symbols: ['🧪', '🚬', '⚗️'],
    day: 2,
    vibe: 'action'
  }
];

// Helper functions for section content
export const getSectionContent = (key: string) => SECTION_CONTENT.find(section => section.sectionKey === key);
export const getButtonLabel = (key: string) => BUTTON_LABELS.find(btn => btn.key === key)?.text || '';