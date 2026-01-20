-- =============================================
-- SQL MIGRATION: Add Hero Taglines Table
-- =============================================
-- This migration creates a new table for storing
-- editable hero taglines that rotate in the hero section
-- =============================================

-- Step 1: Create the hero_taglines table
CREATE TABLE IF NOT EXISTS hero_taglines (
  id TEXT PRIMARY KEY,
  tagline_text TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE hero_taglines ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- Public read access
CREATE POLICY "Public read access for hero_taglines" ON hero_taglines
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admin insert/update/delete access
CREATE POLICY "Admin insert access for hero_taglines" ON hero_taglines
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Admin update access for hero_taglines" ON hero_taglines
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Admin delete access for hero_taglines" ON hero_taglines
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.email = auth.jwt() ->> 'email')
  );

-- Step 4: Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_taglines_order ON hero_taglines("order");
CREATE INDEX IF NOT EXISTS idx_hero_taglines_active ON hero_taglines(is_active) WHERE is_active = TRUE;

-- Step 5: Insert initial data - The rotating taglines
INSERT INTO hero_taglines (id, tagline_text, "order", is_active) VALUES
  ('tagline-1', 'Enter the Stories. Live the Legends.', 1, true),
  ('tagline-2', 'We don''t believe in luck, We believe in hardwork', 2, true),
  ('tagline-3', 'Where Cinema Meets Celebration.', 3, true),
  ('tagline-4', 'A Night Inspired by Icons.', 4, true)
ON CONFLICT (id) DO UPDATE SET
  tagline_text = EXCLUDED.tagline_text,
  "order" = EXCLUDED."order",
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =============================================
-- UPDATE RPC FUNCTION: get_all_site_content
-- =============================================
-- This updates the RPC function to include hero_taglines

CREATE OR REPLACE FUNCTION get_all_site_content()
RETURNS JSON
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'hero_content', (
      SELECT row_to_json(h.*)
      FROM (
        SELECT id, title, subtitle, description, primary_button_text, secondary_button_text, created_at, updated_at
        FROM hero_content
        LIMIT 1
      ) h
    ),
    'hero_taglines', COALESCE((
      SELECT json_agg(t.*)
      FROM (
        SELECT id, tagline_text, "order", is_active, created_at, updated_at
        FROM hero_taglines
        WHERE is_active = TRUE
        ORDER BY "order" ASC
      ) t
    ), '[]'::json),
    'about_content', (
      SELECT row_to_json(a.*)
      FROM (
        SELECT id, paragraphs, created_at, updated_at
        FROM about_content
        LIMIT 1
      ) a
    ),
    'onboarding_content', (
      SELECT row_to_json(o.*)
      FROM (
        SELECT id, title, subtitle, button_text, created_at, updated_at
        FROM onboarding_content
        LIMIT 1
      ) o
    ),
    'footer_content', (
      SELECT row_to_json(f.*)
      FROM (
        SELECT id, copyright_text, note, created_at, updated_at
        FROM footer_content
        LIMIT 1
      ) f
    ),
    'statistics', COALESCE((
      SELECT json_agg(s.*)
      FROM (
        SELECT id, label, value, "order", created_at, updated_at
        FROM statistics
        ORDER BY "order" ASC
      ) s
    ), '[]'::json),
    'team_members', COALESCE((
      SELECT json_agg(tm.*)
      FROM (
        SELECT id, name, role, phone, type, "order", created_at, updated_at
        FROM team_members
        ORDER BY type, "order" ASC
      ) tm
    ), '[]'::json),
    'events', COALESCE((
      SELECT json_agg(e.*)
      FROM (
        SELECT id, title, description, image, day, vibe, google_forms, created_at, updated_at
        FROM events
        ORDER BY day ASC, id ASC
      ) e
    ), '[]'::json),
    'gallery_images', COALESCE((
      SELECT json_agg(g.*)
      FROM (
        SELECT id, image_url, "order", is_featured, created_at
        FROM gallery_images
        ORDER BY "order" ASC
      ) g
    ), '[]'::json),
    'featured_gallery_images', COALESCE((
      SELECT json_agg(fg.*)
      FROM (
        SELECT id, image_url, "order", is_featured, created_at
        FROM gallery_images
        WHERE is_featured = TRUE
        ORDER BY "order" ASC
      ) fg
    ), '[]'::json),
    'section_content', COALESCE((
      SELECT json_agg(sc.*)
      FROM (
        SELECT id, section_key, label, title, description, created_at, updated_at
        FROM section_content
        ORDER BY id ASC
      ) sc
    ), '[]'::json),
    'button_labels', COALESCE((
      SELECT json_agg(bl.*)
      FROM (
        SELECT id, key, text, created_at, updated_at
        FROM button_labels
        ORDER BY id ASC
      ) bl
    ), '[]'::json)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to public
GRANT EXECUTE ON FUNCTION get_all_site_content() TO anon, authenticated;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the migration was successful:

-- Check table exists
-- SELECT * FROM hero_taglines ORDER BY "order";

-- Check RPC function returns taglines
-- SELECT get_all_site_content()->'hero_taglines';
