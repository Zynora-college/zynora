# Supabase Storage Buckets - SQL Query Documentation

## 📦 Overview

This document explains the SQL queries generated for creating and securing Supabase storage buckets with Row Level Security (RLS) policies for the Zynora project.

## 🗂️ Generated File

**File**: `supabase_storage_buckets.sql`

This file contains complete SQL queries for:
1. Creating storage buckets
2. Enabling RLS on storage
3. Setting up security policies

## 🎯 Buckets Created

### 1. **Gallery Bucket** (Primary)
- **Bucket ID**: `gallery`
- **Public**: Yes (public read access)
- **File Size Limit**: 50MB
- **Allowed Types**: JPEG, JPG, PNG, WebP, GIF
- **Purpose**: Store gallery images for the Zynora website

### 2. **Event Posters Bucket** (Optional)
- **Bucket ID**: `event-posters`
- **Public**: Yes (public read access)
- **File Size Limit**: 50MB
- **Allowed Types**: JPEG, JPG, PNG, WebP
- **Purpose**: Store event poster images

### 3. **Admin Documents Bucket** (Optional - Private)
- **Bucket ID**: `admin-documents`
- **Public**: No (admin-only access)
- **File Size Limit**: 100MB
- **Allowed Types**: PDF, DOC, DOCX
- **Purpose**: Store private admin documents

## 🔐 RLS Policies Explained

Each bucket has 4 RLS policies:

### 1. **SELECT Policy (Read Access)**
```sql
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');
```
- **Who**: Anyone (public)
- **Action**: View/download files
- **Applies to**: Public buckets only

### 2. **INSERT Policy (Upload Access)**
```sql
CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);
```
- **Who**: Authenticated admins only (verified against `admins` table)
- **Action**: Upload new files
- **Security**: Checks if user's email exists in `admins` table

### 3. **UPDATE Policy (Modify Access)**
```sql
CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
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
```
- **Who**: Authenticated admins only
- **Action**: Update file metadata
- **Security**: Double-checks admin status

### 4. **DELETE Policy (Remove Access)**
```sql
CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery'
  AND EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);
```
- **Who**: Authenticated admins only
- **Action**: Delete files
- **Security**: Verifies admin credentials

## 🚀 How to Execute

### Method 1: Supabase Dashboard (Recommended)

1. Open your Supabase project: https://hznnvopjudrjwuaadltf.supabase.co
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy and paste the content from `supabase_storage_buckets.sql`
5. Click **"Run"**

### Method 2: Supabase CLI

```bash
# Execute the storage bucket SQL file
supabase db push --file supabase_storage_buckets.sql
```

## ✅ Verification

After executing the SQL file, verify:

```sql
-- 1. Check all buckets created
SELECT * FROM storage.buckets;

-- 2. Check all storage policies
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';

-- 3. List files in gallery bucket (should be empty initially)
SELECT * FROM storage.objects WHERE bucket_id = 'gallery';
```

Expected results:
- ✅ 3 buckets created: `gallery`, `event-posters`, `admin-documents`
- ✅ 12 total policies (4 per bucket)
- ✅ No files initially (empty buckets)

## 💻 Usage in Application

### Upload File
```javascript
const { data, error } = await supabase.storage
  .from('gallery')
  .upload('path/to/image.jpg', file);
```

### Get Public URL
```javascript
const { data } = supabase.storage
  .from('gallery')
  .getPublicUrl('path/to/image.jpg');
  
console.log(data.publicUrl); // Use this URL in <img> tags
```

### Download File
```javascript
const { data, error } = await supabase.storage
  .from('gallery')
  .download('path/to/image.jpg');
```

### Delete File
```javascript
const { data, error } = await supabase.storage
  .from('gallery')
  .remove(['path/to/image.jpg']);
```

### List Files
```javascript
const { data, error } = await supabase.storage
  .from('gallery')
  .list('path/');
```

## 🔒 Security Features

1. **RLS Enabled**: All storage operations are protected by RLS policies
2. **Admin Verification**: Write operations check `admins` table
3. **JWT Validation**: Uses `auth.jwt() ->> 'email'` to verify user identity
4. **File Type Restrictions**: Only allowed MIME types can be uploaded
5. **Size Limits**: Prevents oversized file uploads
6. **Public vs Private**: Separate buckets for different access levels

## 🎨 Customization

### Create a New Bucket

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'your-bucket-name',
  'your-bucket-name',
  true,  -- or false for private
  52428800,  -- 50MB
  ARRAY['image/jpeg', 'image/png']  -- allowed types
)
ON CONFLICT (id) DO NOTHING;
```

### Add Policies for New Bucket

Follow the same pattern as the existing buckets, replacing `'gallery'` with your bucket name.

## 📝 Important Notes

1. **Bucket Names**: Must be unique, lowercase, and URL-safe
2. **Public Buckets**: Files are accessible via direct URL (no auth needed)
3. **Private Buckets**: Require authentication to access files
4. **File Paths**: Use forward slashes for directories (e.g., `2024/events/image.jpg`)
5. **MIME Types**: Restrict to prevent malicious file uploads
6. **Anon Key**: Safe to use in frontend (RLS protects data)
7. **Service Role Key**: NEVER expose in frontend code

## 🔗 Related Files

- `supabase_migration.sql` - Database schema and tables
- `SUPABASE_SETUP.md` - Full setup instructions
- `supabase_storage_buckets.sql` - Storage bucket SQL queries (this file's companion)

## 📞 Support

If you encounter issues:
1. Check RLS is enabled: `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`
2. Verify admin email exists in both Auth and `admins` table
3. Ensure using correct bucket name in queries
4. Check Supabase logs for detailed error messages

---

**Generated for**: Zynora Cultural Fest Website  
**Date**: January 2025  
**Supabase Project**: hznnvopjudrjwuaadltf
