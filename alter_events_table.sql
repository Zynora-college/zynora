-- =============================================
-- ALTER EVENTS TABLE
-- Remove color and symbols, Add google_forms
-- =============================================

-- Remove columns that are no longer needed
ALTER TABLE events DROP COLUMN IF EXISTS color;
ALTER TABLE events DROP COLUMN IF EXISTS symbols;

-- Add new google_forms column (nullable)
ALTER TABLE events ADD COLUMN IF NOT EXISTS google_forms TEXT NULL;

-- Update the events table comment
COMMENT ON COLUMN events.google_forms IS 'Google Forms link for event registration';
