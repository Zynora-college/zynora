# Supabase Database Setup Instructions

## 📋 Overview
This document provides step-by-step instructions to set up the Zynora database schema in Supabase.

## 🚀 Steps to Execute Migration

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://hznnvopjudrjwuaadltf.supabase.co
   - Navigate to **SQL Editor** (in the left sidebar)

2. **Execute Migration Script**
   - Click **"New Query"**
   - Copy the entire content from `supabase_migration.sql`
   - Paste it into the SQL editor
   - Click **"Run"** button

3. **Verify Tables Created**
   - Navigate to **Table Editor** (in the left sidebar)
   - You should see all these tables:
     - admins
     - hero_content
     - onboarding_content
     - about_content
     - section_content
     - button_labels
     - footer_content
     - team_members
     - statistics
     - events
     - gallery_images

### Method 2: Using Supabase CLI (Alternative)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref hznnvopjudrjwuaadltf

# Run migration
supabase db push
```

## 🗂️ Create Storage Bucket for Gallery Images

1. **Navigate to Storage** in Supabase Dashboard
2. Click **"Create Bucket"**
3. Bucket Configuration:
   - **Name**: `gallery`
   - **Public bucket**: ✅ Yes (checked)
   - Click **"Create bucket"**

4. **Set Storage Policies**:
   - Click on the `gallery` bucket
   - Go to **"Policies"** tab
   - Add the following policies:

   **Public Read Policy:**
   ```sql
   CREATE POLICY "Public can view gallery images"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'gallery');
   ```

   **Admin Upload Policy:**
   ```sql
   CREATE POLICY "Admins can upload gallery images"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'gallery' 
     AND EXISTS (SELECT 1 FROM public.admins WHERE admins.email = auth.jwt() ->> 'email')
   );
   ```

   **Admin Delete Policy:**
   ```sql
   CREATE POLICY "Admins can delete gallery images"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'gallery'
     AND EXISTS (SELECT 1 FROM public.admins WHERE admins.email = auth.jwt() ->> 'email')
   );
   ```

## 👤 Create Admin Account

To create an admin user who can access the admin panel:

1. **Create User in Supabase Auth**:
   - Go to **Authentication** → **Users** in Supabase Dashboard
   - Click **"Add user"** → **"Create new user"**
   - Enter:
     - Email: `admin@zynora.com` (or your preferred email)
     - Password: (create a secure password)
     - ✅ Auto Confirm User: Yes
   - Click **"Create user"**

2. **Add User to Admins Table**:
   - Go to **Table Editor** → Select `admins` table
   - Click **"Insert row"**
   - Enter the **same email** used in step 1
   - Click **"Save"**

## ✅ Verify Setup

After completing the steps above, verify:

1. ✅ All 11 tables exist with data
2. ✅ RLS is enabled on all tables
3. ✅ Storage bucket `gallery` is created
4. ✅ At least one admin user exists in both:
   - Supabase Auth (Authentication → Users)
   - `admins` table (Table Editor → admins)

## 🎯 Next Steps

Once the database is set up:
1. The website will fetch content from Supabase (public read access)
2. Admin users can login to `/admin` to manage content
3. Only users in the `admins` table can perform write operations

## 🔐 Security Notes

- **Never expose the service role key** in frontend code
- Only use the **anon key** in the React application
- RLS policies ensure data protection
- Admin access is controlled via the `admins` table
