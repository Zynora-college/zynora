-- =============================================
-- ALTER GALLERY_IMAGES TABLE
-- Add is_featured column for highlighting images
-- =============================================

-- Add is_featured column to gallery_images table
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create index for better query performance on featured images
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_featured ON gallery_images(is_featured);

-- Add comment to document the column purpose
COMMENT ON COLUMN gallery_images.is_featured IS 'Indicates whether the image should be highlighted in the carousel';

-- =============================================
-- USAGE
-- =============================================
-- To mark an image as featured:
-- UPDATE gallery_images SET is_featured = TRUE WHERE id = 'your-image-id';
--
-- To unmark an image:
-- UPDATE gallery_images SET is_featured = FALSE WHERE id = 'your-image-id';
--
-- To get only featured images:
-- SELECT * FROM gallery_images WHERE is_featured = TRUE ORDER BY "order";
