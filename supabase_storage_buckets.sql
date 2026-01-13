-- =============================================
-- ZYNORA STORAGE BUCKETS SETUP
-- Supabase Storage with Row Level Security (RLS)
-- =============================================

-- =============================================
-- 1. CREATE STORAGE BUCKET FOR GALLERY IMAGES
-- =============================================

-- Insert the gallery bucket into storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,  -- Public bucket (allows public read access to files)
  52428800,  -- 50MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']  -- Allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. ENABLE ROW LEVEL SECURITY ON STORAGE
-- =============================================

-- Enable RLS on storage.objects table (where actual files are stored)
-- =============================================
-- SUPABASE STORAGE POLICIES (CLEAN & FIXED)
-- =============================================
-- NOTE:
-- - RLS is ALREADY enabled on storage.objects by Supabase
-- - DO NOT run ALTER TABLE on storage.objects
-- =============================================

-- =============================================
-- 1. PUBLIC READ ACCESS (GALLERY)
-- Anyone can view/download images
-- =============================================

CREATE POLICY "Public can view gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

-- =============================================
-- 2. ADMIN UPLOAD (GALLERY)
-- Only authenticated admins can upload
-- =============================================

CREATE POLICY "Admins can upload gallery images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
bucket_id = 'gallery'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 3. ADMIN UPDATE (GALLERY)
-- =============================================

CREATE POLICY "Admins can update gallery images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
bucket_id = 'gallery'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
)
WITH CHECK (
bucket_id = 'gallery'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 4. ADMIN DELETE (GALLERY)
-- =============================================

CREATE POLICY "Admins can delete gallery images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
bucket_id = 'gallery'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 5. CREATE EVENT POSTERS BUCKET (PUBLIC)
-- =============================================

INSERT INTO storage.buckets (
id,
name,
public,
file_size_limit,
allowed_mime_types
)
VALUES (
'event-posters',
'event-posters',
true,
52428800, -- 50MB
ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 6. PUBLIC READ (EVENT POSTERS)
-- =============================================

CREATE POLICY "Public can view event posters"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-posters');

-- =============================================
-- 7. ADMIN UPLOAD (EVENT POSTERS)
-- =============================================

CREATE POLICY "Admins can upload event posters"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
bucket_id = 'event-posters'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 8. ADMIN UPDATE (EVENT POSTERS)
-- =============================================

CREATE POLICY "Admins can update event posters"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
bucket_id = 'event-posters'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
)
WITH CHECK (
bucket_id = 'event-posters'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 9. ADMIN DELETE (EVENT POSTERS)
-- =============================================

CREATE POLICY "Admins can delete event posters"
ON storage.objects
FOR DELETE
TO authenticated
USING (
bucket_id = 'event-posters'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 10. CREATE PRIVATE ADMIN DOCUMENTS BUCKET
-- =============================================

INSERT INTO storage.buckets (
id,
name,
public,
file_size_limit,
allowed_mime_types
)
VALUES (
'admin-documents',
'admin-documents',
false,
104857600, -- 100MB
ARRAY[
'application/pdf',
'application/msword',
'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 11. ADMIN READ (PRIVATE DOCUMENTS)
-- =============================================

CREATE POLICY "Admins can view admin documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
bucket_id = 'admin-documents'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 12. ADMIN UPLOAD (PRIVATE DOCUMENTS)
-- =============================================

CREATE POLICY "Admins can upload admin documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
bucket_id = 'admin-documents'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 13. ADMIN UPDATE (PRIVATE DOCUMENTS)
-- =============================================

CREATE POLICY "Admins can update admin documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
bucket_id = 'admin-documents'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
)
WITH CHECK (
bucket_id = 'admin-documents'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);

-- =============================================
-- 14. ADMIN DELETE (PRIVATE DOCUMENTS)
-- =============================================

CREATE POLICY "Admins can delete admin documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
bucket_id = 'admin-documents'
AND EXISTS (
SELECT 1 FROM public.admins
WHERE admins.email = auth.jwt() ->> 'email'
)
);
