# Featured Gallery Images Implementation

## Overview
This document describes the implementation of the "highlight/featured" gallery images feature that allows admins to mark specific images as featured, which will then be displayed in the carousel on the Gallery page.

## Changes Made

### 1. Database Schema Changes
**File:** `/app/alter_gallery_table.sql`

- Added `is_featured` BOOLEAN column to `gallery_images` table (default: FALSE)
- Created index on `is_featured` for query performance
- Added column documentation via comments

**To apply the changes to your Supabase database:**
```sql
-- Run this in your Supabase SQL Editor
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_gallery_images_is_featured ON gallery_images(is_featured);
```

### 2. RPC Function Update
**File:** `/app/supabase_rpc_functions.sql`

Updated the `get_all_site_content()` function to include:
- `gallery_images`: All gallery images with their featured status
- `featured_gallery_images`: Filtered list of only featured images

**To update the function:**
Run the updated SQL script in your Supabase SQL Editor.

### 3. TypeScript Types
**File:** `/app/types.ts`

Added new `GalleryImage` interface:
```typescript
interface GalleryImage {
  id: string;
  image_url: string;
  order?: number;
  is_featured?: boolean;
  created_at: string;
}
```

### 4. Context & Hooks Updates

**Files Updated:**
- `/app/contexts/SiteDataContext.tsx`: Updated to handle `GalleryImage` objects instead of just image URLs
- `/app/hooks/useSupabaseData.ts`: 
  - Updated `useGalleryImages` hook to return full `GalleryImage` objects
  - Added `useFeaturedGalleryImages` hook for filtering featured images

### 5. User-Facing Components

#### GalleryFull Component (`/app/components/GalleryFull.tsx`)
**Changes:**
- Carousel now displays ONLY featured images (if any exist)
- Falls back to showing all images if no images are featured
- Grid section continues to display all images
- Properly handles the new `GalleryImage` type

#### GalleryPreview Component (`/app/components/GalleryPreview.tsx`)
**Changes:**
- Updated to work with new `GalleryImage` type
- Continues to show all images (first 8) regardless of featured status
- No change in functionality, only type updates

### 6. Admin Interface

#### Admin Page (`/app/pages/Admin.tsx`)
**New Features:**
- ⭐ **Feature/Unfeature Toggle**: Click to mark/unmark images as featured
- 🏷️ **Featured Badge**: Visual indicator showing which images are featured
- 📊 **Featured Count**: Shows total images and featured count in header
- 🎨 **Visual Feedback**: Yellow star icon for featured images

**How to use:**
1. Navigate to Admin → Gallery section
2. Hover over any image
3. Click "Feature" button to mark as featured (button turns yellow with filled star)
4. Click "Unfeature" to remove featured status
5. Featured images show a yellow badge in the top-right corner

## Feature Behavior

### Carousel Display Logic:
1. **If featured images exist:** Show only featured images in carousel
2. **If no featured images:** Show all images in carousel (fallback)
3. **Grid below carousel:** Always shows all images regardless of featured status

### Admin Controls:
- ✅ No limit on number of featured images
- ✅ Toggle featured status with single click
- ✅ Visual indicator (yellow badge + star icon) for featured images
- ✅ Featured count shown in section header

## Testing Checklist

- [ ] Run SQL migration to add `is_featured` column
- [ ] Update RPC function in Supabase
- [ ] Mark some images as featured in Admin panel
- [ ] Verify carousel shows only featured images
- [ ] Verify grid shows all images
- [ ] Test "Feature" and "Unfeature" buttons
- [ ] Test with no featured images (should show all in carousel)
- [ ] Verify GalleryPreview still shows first 8 images

## SQL Queries for Manual Testing

```sql
-- Mark an image as featured
UPDATE gallery_images SET is_featured = TRUE WHERE id = 'your-image-id';

-- Unmark an image
UPDATE gallery_images SET is_featured = FALSE WHERE id = 'your-image-id';

-- Get all featured images
SELECT * FROM gallery_images WHERE is_featured = TRUE ORDER BY "order";

-- Get count of featured images
SELECT COUNT(*) as featured_count FROM gallery_images WHERE is_featured = TRUE;

-- Mark first 3 images as featured (for testing)
UPDATE gallery_images SET is_featured = TRUE 
WHERE id IN (
  SELECT id FROM gallery_images ORDER BY "order" LIMIT 3
);
```

## Files Modified

1. `/app/alter_gallery_table.sql` - NEW (SQL migration)
2. `/app/supabase_rpc_functions.sql` - UPDATED
3. `/app/types.ts` - UPDATED
4. `/app/contexts/SiteDataContext.tsx` - UPDATED
5. `/app/hooks/useSupabaseData.ts` - UPDATED
6. `/app/components/GalleryFull.tsx` - UPDATED
7. `/app/components/GalleryPreview.tsx` - UPDATED
8. `/app/pages/Admin.tsx` - UPDATED

## Notes

- The feature is backward compatible - existing gallery images will have `is_featured = FALSE` by default
- The RLS policies remain unchanged - admins can update the `is_featured` field
- Image deletion also works with the new structure
- All changes maintain the existing functionality while adding the featured capability
