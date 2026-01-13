-- =============================================
-- ZYNORA DATABASE SCHEMA
-- Supabase Migration Script
-- =============================================

-- 1. ADMINS TABLE (for authentication allowlist)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HERO CONTENT
CREATE TABLE IF NOT EXISTS hero_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  primary_button_text TEXT NOT NULL,
  secondary_button_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ONBOARDING CONTENT
CREATE TABLE IF NOT EXISTS onboarding_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  button_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ABOUT CONTENT
CREATE TABLE IF NOT EXISTS about_content (
  id TEXT PRIMARY KEY,
  paragraphs TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SECTION CONTENT
CREATE TABLE IF NOT EXISTS section_content (
  id TEXT PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUTTON LABELS
CREATE TABLE IF NOT EXISTS button_labels (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FOOTER CONTENT
CREATE TABLE IF NOT EXISTS footer_content (
  id TEXT PRIMARY KEY,
  copyright_text TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEAM MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('staff', 'student')),
  "order" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STATISTICS
CREATE TABLE IF NOT EXISTS statistics (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  color TEXT NOT NULL,
  symbols TEXT[] NOT NULL,
  day INTEGER NOT NULL CHECK (day IN (1, 2)),
  vibe TEXT NOT NULL CHECK (vibe IN ('thriller', 'fantasy', 'action', 'horror', 'adventure', 'crime')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. GALLERY IMAGES
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  "order" INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INSERT INITIAL DATA FROM CONSTANTS
-- =============================================

-- Hero Content
INSERT INTO hero_content (id, title, subtitle, description, primary_button_text, secondary_button_text)
VALUES (
  'hero-1',
  'ZYNORA',
  'You have entered the rift. Experience the visceral intersection of cinematic mastery and dark celebration.',
  '',
  'Secure Entry',
  'Explore Vault'
) ON CONFLICT (id) DO NOTHING;

-- Onboarding Content
INSERT INTO onboarding_content (id, title, subtitle, button_text)
VALUES (
  'onboarding-1',
  'ZYNORA',
  'The Reality Before The Rift',
  'Enter The Void'
) ON CONFLICT (id) DO NOTHING;

-- About Content
INSERT INTO about_content (id, paragraphs)
VALUES (
  'about-1',
  ARRAY[
    'Zynora is not just a cultural fest—it is a celebration of diversity and a dynamic platform for self-expression.',
    'Zynora is not just a cultural fest—it is a celebration of diversity and a dynamic platform for self-expression. It brings together the brightest talents from colleges near and far, offering students the opportunity to shine across dance, music, theatre, fine arts, and literary competitions. Each event is thoughtfully designed to inspire creativity, highlight individual skills, and bring out the best in every participant.'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Footer Content
INSERT INTO footer_content (id, copyright_text, note)
VALUES (
  'footer-1',
  'ZYNORA CINEMATIC FEST. ALL RIGHTS RESERVED.',
  '* Limited slots available per universe'
) ON CONFLICT (id) DO NOTHING;

-- Statistics
INSERT INTO statistics (id, label, value, "order") VALUES
  ('stat-1', 'DAYS', '2', 1),
  ('stat-2', 'EVENTS', '13', 2),
  ('stat-3', 'PRIZES', '300+', 3),
  ('stat-4', 'STALLS', '8', 4)
ON CONFLICT (id) DO NOTHING;

-- Team Members
INSERT INTO team_members (id, name, role, phone, type, "order") VALUES
  ('staff-1', 'Prof. Sarah Miller', 'Faculty Head', '+91 98765 43210', 'staff', 1),
  ('staff-2', 'Dr. James Wilson', 'Cultural Advisor', '+91 87654 32109', 'staff', 2),
  ('student-1', 'Alex Johnson', 'General Secretary', '+91 76543 21098', 'student', 1),
  ('student-2', 'Elena Gilbert', 'Event Lead', '+91 65432 10987', 'student', 2),
  ('student-3', 'Stefan Salvatore', 'Technical Head', '+91 54321 09876', 'student', 3)
ON CONFLICT (id) DO NOTHING;

-- Section Content
INSERT INTO section_content (id, section_key, label, title, description) VALUES
  ('home-intro-1', 'home-intro', 'The Cinematic Converge', 'Experience where reality dissolves into the silver screen.', ''),
  ('stats-1', 'stats', 'Fire and Blood', 'THE SCORE', ''),
  ('events-1', 'events', 'Choose Your Legend', 'The Competitions', ''),
  ('coordinators-1', 'coordinators', 'Summon the Kraken', 'Coordinators', 'Follow for more update'),
  ('gallery-preview-1', 'gallery-preview', 'Visuals', 'Gallery Preview', ''),
  ('gallery-full-1', 'gallery-full', 'Full Gallery', 'Zynora 2K26 Highlight', ''),
  ('register-1', 'register', '', 'THE SCREEN IS WAITING.', 'Seats are filling up in this cinematic multiverse. Secure your legacy today and be part of the most talked-about night of the year.')
ON CONFLICT (id) DO NOTHING;

-- Button Labels
INSERT INTO button_labels (id, key, text) VALUES
  ('btn-1', 'register-now', 'REGISTER NOW'),
  ('btn-2', 'register-now-short', 'Register Now'),
  ('btn-3', 'secure-entry', 'Secure Entry'),
  ('btn-4', 'explore-vault', 'Explore Vault'),
  ('btn-5', 'claim-throne', 'Claim Your Throne'),
  ('btn-6', 'join-battle', 'Join the Battle'),
  ('btn-7', 'view-full-gallery', 'View Full Gallery'),
  ('btn-8', 'phase-01', 'Phase 01'),
  ('btn-9', 'phase-02', 'Phase 02'),
  ('btn-10', 'enter-void', 'Enter The Void')
ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO events (id, title, description, image, color, symbols, day, vibe) VALUES
  ('heist', 'The Heist Protocol', 'Strategy games and puzzle cracking. Execute the perfect plan.', 
   'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
   'border-red-600 shadow-red-900/50', ARRAY['🎭', '💰', '⏰'], 1, 'crime'),
  ('redlight', 'The Red Light Trial', 'Competitive games and high-stakes elimination rounds.',
   'https://images.unsplash.com/photo-1634155581321-7076939b033d?auto=format&fit=crop&q=80&w=800',
   'border-pink-600 shadow-pink-900/50', ARRAY['◯', '△', '▢'], 1, 'thriller'),
  ('throne', 'The Iron Throne Challenge', 'Debate, leadership, and team domination. Conquer the land.',
   'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80&w=800',
   'border-yellow-600 shadow-yellow-900/50', ARRAY['⚔️', '🐲', '❄️'], 1, 'fantasy'),
  ('upside', 'The Upside Rift', 'Mystery games and escape-style challenges. Brave the rift.',
   'https://images.unsplash.com/photo-1498747946579-bde604cb8f44?auto=format&fit=crop&q=80&w=800',
   'border-purple-600 shadow-purple-900/50', ARRAY['🔦', '🚲', '👾'], 2, 'horror'),
  ('blackpearl', 'The Black Pearl Quest', 'A massive campus-wide treasure hunt. Follow the maps.',
   'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?auto=format&fit=crop&q=80&w=800',
   'border-cyan-600 shadow-cyan-900/50', ARRAY['⚓', '🗺️', '🦜'], 2, 'adventure'),
  ('bluelab', 'The Blue Lab Experiment', 'Logic games and science-based fun. Apply pure precision.',
   'https://images.unsplash.com/photo-1532187875605-186c7131ed57?auto=format&fit=crop&q=80&w=800',
   'border-blue-600 shadow-blue-900/50', ARRAY['🧪', '🚬', '⚗️'], 2, 'action')
ON CONFLICT (id) DO NOTHING;

-- Gallery Images
INSERT INTO gallery_images (image_url, "order") VALUES
  ('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop', 1),
  ('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop', 2),
  ('https://images.unsplash.com/photo-1514525253361-bee8a187449a?q=80&w=800&auto=format&fit=crop', 3),
  ('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop', 4),
  ('https://images.unsplash.com/photo-1496337589254-7e19d01ced44?q=80&w=800&auto=format&fit=crop', 5),
  ('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop', 6),
  ('https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&auto=format&fit=crop', 7),
  ('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop', 8),
  ('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', 9),
  ('https://images.unsplash.com/photo-1429962714451-bb934ecbb4ec?q=80&w=800&auto=format&fit=crop', 10),
  ('https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop', 11),
  ('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', 12)
ON CONFLICT DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE button_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ ACCESS (for website visitors)
-- =============================================

CREATE POLICY "Public can view hero content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public can view onboarding content" ON onboarding_content FOR SELECT USING (true);
CREATE POLICY "Public can view about content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public can view section content" ON section_content FOR SELECT USING (true);
CREATE POLICY "Public can view button labels" ON button_labels FOR SELECT USING (true);
CREATE POLICY "Public can view footer content" ON footer_content FOR SELECT USING (true);
CREATE POLICY "Public can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public can view statistics" ON statistics FOR SELECT USING (true);
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view gallery images" ON gallery_images FOR SELECT USING (true);

-- =============================================
-- ADMIN WRITE ACCESS (INSERT/UPDATE/DELETE)
-- Only authenticated users who exist in admins table
-- =============================================

-- Hero Content
CREATE POLICY "Admins can insert hero content" ON hero_content FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update hero content" ON hero_content FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete hero content" ON hero_content FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Onboarding Content
CREATE POLICY "Admins can insert onboarding content" ON onboarding_content FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update onboarding content" ON onboarding_content FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete onboarding content" ON onboarding_content FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- About Content
CREATE POLICY "Admins can insert about content" ON about_content FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update about content" ON about_content FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete about content" ON about_content FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Section Content
CREATE POLICY "Admins can insert section content" ON section_content FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update section content" ON section_content FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete section content" ON section_content FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Button Labels
CREATE POLICY "Admins can insert button labels" ON button_labels FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update button labels" ON button_labels FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete button labels" ON button_labels FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Footer Content
CREATE POLICY "Admins can insert footer content" ON footer_content FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update footer content" ON footer_content FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete footer content" ON footer_content FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Team Members
CREATE POLICY "Admins can insert team members" ON team_members FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update team members" ON team_members FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete team members" ON team_members FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Statistics
CREATE POLICY "Admins can insert statistics" ON statistics FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update statistics" ON statistics FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete statistics" ON statistics FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Events
CREATE POLICY "Admins can insert events" ON events FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update events" ON events FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete events" ON events FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- Gallery Images
CREATE POLICY "Admins can insert gallery images" ON gallery_images FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can update gallery images" ON gallery_images FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

CREATE POLICY "Admins can delete gallery images" ON gallery_images FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email'));

-- =============================================
-- STORAGE BUCKET FOR GALLERY IMAGES
-- =============================================
-- Note: Storage bucket and policies must be created in Supabase Dashboard
-- Bucket name: 'gallery'
-- Policy: Public read, Admin write (checked against admins table)

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_team_members_type ON team_members(type);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");
CREATE INDEX IF NOT EXISTS idx_statistics_order ON statistics("order");
CREATE INDEX IF NOT EXISTS idx_events_day ON events(day);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images("order");
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
