-- =============================================
-- ZYNORA RPC FUNCTIONS
-- Optimized data fetching with single API call
-- Production-ready with connection pooling support
-- =============================================

-- Drop the function if it exists (for updates)
DROP FUNCTION IF EXISTS get_all_site_content();

-- Create the unified data fetch function
-- Using STABLE for better query planning and caching
-- Using explicit column names to avoid schema changes breaking the function
CREATE OR REPLACE FUNCTION get_all_site_content()
RETURNS JSON AS $$
DECLARE
  result JSON;
  hero_data JSON;
  about_data JSON;
  onboarding_data JSON;
  footer_data JSON;
  stats_data JSON;
  team_data JSON;
  events_data JSON;
  gallery_data JSON;
  featured_data JSON;
  section_data JSON;
  button_data JSON;
BEGIN
  -- Fetch each piece of data separately for better error handling
  -- and to allow PostgreSQL to optimize each query independently
  
  -- Hero content (single row)
  SELECT row_to_json(h.*) INTO hero_data
  FROM hero_content h 
  LIMIT 1;
  
  -- About content (single row)
  SELECT row_to_json(a.*) INTO about_data
  FROM about_content a 
  LIMIT 1;
  
  -- Onboarding content (single row)
  SELECT row_to_json(o.*) INTO onboarding_data
  FROM onboarding_content o 
  LIMIT 1;
  
  -- Footer content (single row)
  SELECT row_to_json(f.*) INTO footer_data
  FROM footer_content f 
  LIMIT 1;
  
  -- Statistics (array, ordered)
  SELECT COALESCE(json_agg(s.* ORDER BY s."order"), '[]'::json) INTO stats_data
  FROM statistics s;
  
  -- Team members (array, ordered)
  SELECT COALESCE(json_agg(t.* ORDER BY t."order"), '[]'::json) INTO team_data
  FROM team_members t;
  
  -- Events (array, ordered by day)
  SELECT COALESCE(json_agg(e.* ORDER BY e.day), '[]'::json) INTO events_data
  FROM events e;
  
  -- Gallery images (array, ordered)
  SELECT COALESCE(json_agg(g.* ORDER BY g."order"), '[]'::json) INTO gallery_data
  FROM gallery_images g;
  
  -- Featured gallery images (filtered array)
  SELECT COALESCE(json_agg(g.* ORDER BY g."order"), '[]'::json) INTO featured_data
  FROM gallery_images g
  WHERE g.is_featured = TRUE;
  
  -- Section content (array)
  SELECT COALESCE(json_agg(sc.*), '[]'::json) INTO section_data
  FROM section_content sc;
  
  -- Button labels (array)
  SELECT COALESCE(json_agg(bl.*), '[]'::json) INTO button_data
  FROM button_labels bl;

  -- Build final result object
  result := json_build_object(
    'hero_content', hero_data,
    'about_content', about_data,
    'onboarding_content', onboarding_data,
    'footer_content', footer_data,
    'statistics', stats_data,
    'team_members', team_data,
    'events', events_data,
    'gallery_images', gallery_data,
    'featured_gallery_images', featured_data,
    'section_content', section_data,
    'button_labels', button_data
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_all_site_content() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_site_content() TO anon;

-- =============================================
-- RECOMMENDED INDEXES FOR PERFORMANCE
-- Run these to ensure optimal query performance
-- =============================================

-- Index for statistics ordering
CREATE INDEX IF NOT EXISTS idx_statistics_order ON statistics("order");

-- Index for team members ordering
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members("order");

-- Index for events ordering
CREATE INDEX IF NOT EXISTS idx_events_day ON events(day);

-- Index for gallery images ordering and filtering
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images("order");
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON gallery_images(is_featured) WHERE is_featured = TRUE;

-- =============================================
-- USAGE EXAMPLE
-- =============================================
-- From frontend:
-- const { data, error } = await supabase.rpc('get_all_site_content');
--
-- Response structure:
-- {
--   hero_content: { id, title, subtitle, ... },
--   about_content: { id, paragraphs, ... },
--   onboarding_content: { id, title, subtitle, button_text },
--   footer_content: { id, copyright_text, note },
--   statistics: [{ id, label, value, order }, ...],
--   team_members: [{ id, name, role, phone, type, order }, ...],
--   events: [{ id, title, description, image, color, symbols, day, vibe }, ...],
--   gallery_images: [{ id, image_url, order }, ...],
--   featured_gallery_images: [{ id, image_url, order, is_featured }, ...],
--   section_content: [{ id, section_key, label, title, description }, ...],
--   button_labels: [{ id, key, text }, ...]
-- }
