# 🏗️ ZYNORA Backend Architecture Documentation

> **Complete technical guide to the Zynora database architecture, storage systems, and RPC functions**

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Database Tables](#database-tables)
3. [Storage Buckets](#storage-buckets)
4. [RPC Functions](#rpc-functions)
5. [Security Policies](#security-policies)
6. [Indexes & Performance](#indexes--performance)
7. [Schema Modifications](#schema-modifications)
8. [Usage Examples](#usage-examples)

---

## 🎯 Overview

**Database System**: Supabase (PostgreSQL)  
**Authentication**: Supabase Auth with Row Level Security (RLS)  
**Storage**: Supabase Storage with custom buckets  
**Total Tables**: 11  
**Total Storage Buckets**: 3  
**Total RPC Functions**: 1  

### Architecture Principles
- ✅ Public read access for all content tables (website visitors)
- ✅ Admin-only write access (controlled via admins table)
- ✅ Row Level Security enabled on all tables
- ✅ Optimized data fetching with single RPC call
- ✅ Separate storage buckets for different content types

---

## 📊 Database Tables

### 1. `admins` - Authentication Allowlist

**Purpose**: Stores authorized admin email addresses for authentication

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Auto-generated unique identifier |
| `email` | TEXT | UNIQUE, NOT NULL | Admin email address |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp when admin was added |

**Indexes**:
- `idx_admins_email` on `email` column

**Security**:
- RLS enabled
- Used for checking admin permissions across all tables

---

### 2. `hero_content` - Homepage Hero Section

**Purpose**: Stores hero section content (title, subtitle, CTA buttons)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `title` | TEXT | NOT NULL | Main hero title (e.g., "ZYNORA") |
| `subtitle` | TEXT | NOT NULL | Hero subtitle/tagline |
| `description` | TEXT | - | Additional description text |
| `primary_button_text` | TEXT | NOT NULL | Primary CTA button text |
| `secondary_button_text` | TEXT | NOT NULL | Secondary CTA button text |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Initial Data**:
```sql
id: 'hero-1'
title: 'ZYNORA'
subtitle: 'You have entered the rift...'
primary_button_text: 'Secure Entry'
secondary_button_text: 'Explore Vault'
```

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 3. `onboarding_content` - Welcome/Onboarding Screen

**Purpose**: Stores content for the initial onboarding/welcome screen

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `title` | TEXT | NOT NULL | Onboarding title |
| `subtitle` | TEXT | NOT NULL | Onboarding subtitle |
| `button_text` | TEXT | NOT NULL | CTA button text |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Initial Data**:
```sql
id: 'onboarding-1'
title: 'ZYNORA'
subtitle: 'The Reality Before The Rift'
button_text: 'Enter The Void'
```

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 4. `about_content` - About Section Content

**Purpose**: Stores multiple paragraphs for the About section

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `paragraphs` | TEXT[] | NOT NULL | Array of paragraph strings |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Initial Data**:
```sql
id: 'about-1'
paragraphs: [
  'Zynora is not just a cultural fest—it is a celebration...',
  'It brings together the brightest talents...'
]
```

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 5. `section_content` - Dynamic Section Configurations

**Purpose**: Stores labels, titles, and descriptions for various website sections

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `section_key` | TEXT | UNIQUE, NOT NULL | Section identifier (e.g., 'home-intro') |
| `label` | TEXT | NOT NULL | Section label/category |
| `title` | TEXT | NOT NULL | Section title |
| `description` | TEXT | - | Section description (optional) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Sections Configured**:
- `home-intro` - Home page intro section
- `stats` - Statistics section
- `events` - Events/competitions section
- `coordinators` - Team coordinators section
- `gallery-preview` - Gallery preview section
- `gallery-full` - Full gallery section
- `register` - Registration CTA section

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 6. `button_labels` - Reusable Button Text

**Purpose**: Centralized storage for button labels used throughout the site

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `key` | TEXT | UNIQUE, NOT NULL | Button key identifier |
| `text` | TEXT | NOT NULL | Button display text |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Button Keys**:
- `register-now` - "REGISTER NOW"
- `register-now-short` - "Register Now"
- `secure-entry` - "Secure Entry"
- `explore-vault` - "Explore Vault"
- `claim-throne` - "Claim Your Throne"
- `join-battle` - "Join the Battle"
- `view-full-gallery` - "View Full Gallery"
- `phase-01` - "Phase 01"
- `phase-02` - "Phase 02"
- `enter-void` - "Enter The Void"

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 7. `footer_content` - Footer Information

**Purpose**: Stores footer copyright and notes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `copyright_text` | TEXT | NOT NULL | Copyright notice |
| `note` | TEXT | - | Additional footer note |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Initial Data**:
```sql
id: 'footer-1'
copyright_text: 'ZYNORA CINEMATIC FEST. ALL RIGHTS RESERVED.'
note: '* Limited slots available per universe'
```

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 8. `team_members` - Staff & Student Coordinators

**Purpose**: Stores team member information (staff and students)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `name` | TEXT | NOT NULL | Team member name |
| `role` | TEXT | NOT NULL | Role/position |
| `phone` | TEXT | NOT NULL | Contact phone number |
| `type` | TEXT | NOT NULL, CHECK IN ('staff', 'student') | Member type |
| `order` | INTEGER | - | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_team_members_type` on `type`
- `idx_team_members_order` on `order`

**Initial Data**: 2 staff members, 3 student members

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 9. `statistics` - Event Statistics Display

**Purpose**: Stores key statistics shown on homepage (days, events, prizes, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `label` | TEXT | NOT NULL | Statistic label (e.g., "DAYS") |
| `value` | TEXT | NOT NULL | Statistic value (e.g., "2") |
| `order` | INTEGER | NOT NULL | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_statistics_order` on `order`

**Initial Data**:
- DAYS: 2
- EVENTS: 13
- PRIZES: 300+
- STALLS: 8

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 10. `events` - Competition Events

**Purpose**: Stores event/competition details for the festival

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier |
| `title` | TEXT | NOT NULL | Event title |
| `description` | TEXT | NOT NULL | Event description |
| `image` | TEXT | NOT NULL | Event image URL |
| ~~`color`~~ | ~~TEXT~~ | ~~NOT NULL~~ | **REMOVED** - Border/theme color |
| ~~`symbols`~~ | ~~TEXT[]~~ | ~~NOT NULL~~ | **REMOVED** - Event symbol emojis |
| `day` | INTEGER | NOT NULL, CHECK IN (1, 2) | Event day (1 or 2) |
| `vibe` | TEXT | NOT NULL, CHECK IN ('thriller', 'fantasy', 'action', 'horror', 'adventure', 'crime') | Event theme/vibe |
| `google_forms` | TEXT | NULL | **NEW** - Google Forms registration link |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_events_day` on `day`

**Schema Changes**:
- ❌ Removed: `color` column
- ❌ Removed: `symbols` column
- ✅ Added: `google_forms` column (nullable TEXT)

**Initial Events**:
1. The Heist Protocol (Day 1, Crime)
2. The Red Light Trial (Day 1, Thriller)
3. The Iron Throne Challenge (Day 1, Fantasy)
4. The Upside Rift (Day 2, Horror)
5. The Black Pearl Quest (Day 2, Adventure)
6. The Blue Lab Experiment (Day 2, Action)

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

### 11. `gallery_images` - Image Gallery

**Purpose**: Stores gallery image URLs with ordering and featured flag

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Auto-generated identifier |
| `image_url` | TEXT | NOT NULL | Image URL (Unsplash or Storage bucket) |
| `order` | INTEGER | - | Display order |
| `is_featured` | BOOLEAN | DEFAULT FALSE | **NEW** - Highlight in carousel |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- `idx_gallery_images_order` on `order`
- `idx_gallery_images_featured` on `is_featured` (WHERE is_featured = TRUE)
- `idx_gallery_images_is_featured` on `is_featured`

**Schema Changes**:
- ✅ Added: `is_featured` column (BOOLEAN, DEFAULT FALSE)
- ✅ Added: Index on `is_featured` for performance

**Initial Data**: 12 gallery images from Unsplash

**Security**:
- Public read access
- Admin-only INSERT, UPDATE, DELETE

---

## 🗄️ Storage Buckets

### 1. `gallery` - Public Gallery Images

**Configuration**:
```sql
Bucket ID: 'gallery'
Public: true (public read access)
File Size Limit: 50MB (52428800 bytes)
Allowed MIME Types:
  - image/jpeg
  - image/jpg
  - image/png
  - image/webp
  - image/gif
```

**Purpose**: Store gallery images uploaded by admins

**Policies**:
- ✅ Public SELECT (anyone can view/download)
- ✅ Admin INSERT (upload)
- ✅ Admin UPDATE (modify)
- ✅ Admin DELETE (remove)

**Usage Example**:
```javascript
// Upload image
const { data, error } = await supabase.storage
  .from('gallery')
  .upload('image-name.jpg', fileBlob);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('gallery')
  .getPublicUrl('image-name.jpg');
```

---

### 2. `event-posters` - Public Event Posters

**Configuration**:
```sql
Bucket ID: 'event-posters'
Public: true (public read access)
File Size Limit: 50MB (52428800 bytes)
Allowed MIME Types:
  - image/jpeg
  - image/jpg
  - image/png
  - image/webp
```

**Purpose**: Store event poster images for competitions

**Policies**:
- ✅ Public SELECT (anyone can view/download)
- ✅ Admin INSERT (upload)
- ✅ Admin UPDATE (modify)
- ✅ Admin DELETE (remove)

**Usage Example**:
```javascript
// Upload event poster
const { data, error } = await supabase.storage
  .from('event-posters')
  .upload('heist-poster.jpg', fileBlob);

// Update events table with poster URL
const { data: { publicUrl } } = supabase.storage
  .from('event-posters')
  .getPublicUrl('heist-poster.jpg');

await supabase
  .from('events')
  .update({ image: publicUrl })
  .eq('id', 'heist');
```

---

### 3. `admin-documents` - Private Admin Files

**Configuration**:
```sql
Bucket ID: 'admin-documents'
Public: false (private bucket, admin-only access)
File Size Limit: 100MB (104857600 bytes)
Allowed MIME Types:
  - application/pdf
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

**Purpose**: Store private admin documents (reports, plans, etc.)

**Policies**:
- ✅ Admin SELECT (view/download)
- ✅ Admin INSERT (upload)
- ✅ Admin UPDATE (modify)
- ✅ Admin DELETE (remove)
- ❌ Public access denied

**Usage Example**:
```javascript
// Upload private document (admin only)
const { data, error } = await supabase.storage
  .from('admin-documents')
  .upload('event-plan.pdf', fileBlob);

// Get signed URL (temporary access)
const { data, error } = await supabase.storage
  .from('admin-documents')
  .createSignedUrl('event-plan.pdf', 3600); // 1 hour expiry
```

---

## ⚡ RPC Functions

### `get_all_site_content()`

**Purpose**: Fetch all website content in a single optimized API call

**Type**: `STABLE SECURITY DEFINER`

**Returns**: JSON object with all site content

**Performance Features**:
- ✅ Single database round-trip (vs. 11+ separate queries)
- ✅ Optimized query planning with STABLE modifier
- ✅ Better connection pooling support
- ✅ Explicit column names (schema-change safe)
- ✅ Ordered results with COALESCE for empty arrays

**Response Structure**:
```json
{
  "hero_content": {
    "id": "hero-1",
    "title": "ZYNORA",
    "subtitle": "You have entered the rift...",
    "description": "",
    "primary_button_text": "Secure Entry",
    "secondary_button_text": "Explore Vault",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  "about_content": {
    "id": "about-1",
    "paragraphs": ["paragraph 1", "paragraph 2"],
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  "onboarding_content": {
    "id": "onboarding-1",
    "title": "ZYNORA",
    "subtitle": "The Reality Before The Rift",
    "button_text": "Enter The Void",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  "footer_content": {
    "id": "footer-1",
    "copyright_text": "ZYNORA CINEMATIC FEST. ALL RIGHTS RESERVED.",
    "note": "* Limited slots available per universe",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  "statistics": [
    {
      "id": "stat-1",
      "label": "DAYS",
      "value": "2",
      "order": 1,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "team_members": [
    {
      "id": "staff-1",
      "name": "Prof. Sarah Miller",
      "role": "Faculty Head",
      "phone": "+91 98765 43210",
      "type": "staff",
      "order": 1,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "events": [
    {
      "id": "heist",
      "title": "The Heist Protocol",
      "description": "Strategy games and puzzle cracking...",
      "image": "https://images.unsplash.com/...",
      "day": 1,
      "vibe": "crime",
      "google_forms": null,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "gallery_images": [
    {
      "id": "uuid-here",
      "image_url": "https://images.unsplash.com/...",
      "order": 1,
      "is_featured": false,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "featured_gallery_images": [
    {
      "id": "uuid-here",
      "image_url": "https://images.unsplash.com/...",
      "order": 1,
      "is_featured": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "section_content": [
    {
      "id": "home-intro-1",
      "section_key": "home-intro",
      "label": "The Cinematic Converge",
      "title": "Experience where reality dissolves...",
      "description": "",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "button_labels": [
    {
      "id": "btn-1",
      "key": "register-now",
      "text": "REGISTER NOW",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Usage Example**:
```javascript
// Frontend: Fetch all site content
const { data, error } = await supabase.rpc('get_all_site_content');

if (error) {
  console.error('Error fetching site content:', error);
} else {
  // Access individual content sections
  const heroTitle = data.hero_content.title;
  const events = data.events; // Array of events
  const featuredImages = data.featured_gallery_images; // Only featured images
}
```

**Permissions**:
- ✅ Accessible to `authenticated` users
- ✅ Accessible to `anon` (anonymous/public) users

---

## 🔒 Security Policies

### Row Level Security (RLS) Overview

**Status**: ✅ Enabled on all tables

**Access Pattern**:
- **Public (SELECT)**: Anyone can read all content
- **Admin (INSERT/UPDATE/DELETE)**: Only authenticated users in `admins` table

### Admin Authorization Check

All admin policies use this pattern:
```sql
EXISTS (
  SELECT 1 FROM admins 
  WHERE admins.email = auth.jwt() ->> 'email'
)
```

### Policy Matrix

| Table | Public Read | Admin Write | Admin Check |
|-------|-------------|-------------|-------------|
| `admins` | ❌ | ✅ | Via email in table |
| `hero_content` | ✅ | ✅ | Via admins table |
| `onboarding_content` | ✅ | ✅ | Via admins table |
| `about_content` | ✅ | ✅ | Via admins table |
| `section_content` | ✅ | ✅ | Via admins table |
| `button_labels` | ✅ | ✅ | Via admins table |
| `footer_content` | ✅ | ✅ | Via admins table |
| `team_members` | ✅ | ✅ | Via admins table |
| `statistics` | ✅ | ✅ | Via admins table |
| `events` | ✅ | ✅ | Via admins table |
| `gallery_images` | ✅ | ✅ | Via admins table |

### Storage Bucket Policies

| Bucket | Public Read | Admin Write | Access Level |
|--------|-------------|-------------|--------------|
| `gallery` | ✅ | ✅ | Public bucket |
| `event-posters` | ✅ | ✅ | Public bucket |
| `admin-documents` | ❌ | ✅ | Private bucket |

---

## 📈 Indexes & Performance

### Performance Optimization Strategy

1. **Ordering Indexes**: For frequently sorted columns
2. **Filter Indexes**: For boolean/enum columns with WHERE clauses
3. **Email Lookup**: For admin authentication checks

### Index Summary

| Table | Index Name | Column(s) | Purpose |
|-------|------------|-----------|---------|
| `admins` | `idx_admins_email` | `email` | Fast admin lookup |
| `team_members` | `idx_team_members_type` | `type` | Filter by staff/student |
| `team_members` | `idx_team_members_order` | `order` | Ordered display |
| `statistics` | `idx_statistics_order` | `order` | Ordered display |
| `events` | `idx_events_day` | `day` | Filter by day (1/2) |
| `gallery_images` | `idx_gallery_images_order` | `order` | Ordered display |
| `gallery_images` | `idx_gallery_images_featured` | `is_featured` (WHERE TRUE) | Featured images only |
| `gallery_images` | `idx_gallery_images_is_featured` | `is_featured` | Boolean lookup |

### Query Performance Tips

✅ **DO**:
- Use the `get_all_site_content()` RPC for initial page load
- Leverage indexed columns in WHERE clauses
- Order by indexed columns (`order`, `day`)

❌ **DON'T**:
- Make 11+ individual queries when RPC is available
- Filter by non-indexed columns in hot paths
- Forget to use `LIMIT 1` for single-row tables

---

## 🔧 Schema Modifications

### ALTER: `events` Table

**File**: `alter_events_table.sql`

**Changes**:
```sql
-- Removed columns
❌ DROP COLUMN color (TEXT)
❌ DROP COLUMN symbols (TEXT[])

-- Added columns
✅ ADD COLUMN google_forms (TEXT, nullable)
```

**Reason**: Simplify event structure and add registration link support

**Migration Safe**: ✅ Yes (uses IF EXISTS/IF NOT EXISTS)

---

### ALTER: `gallery_images` Table

**File**: `alter_gallery_table.sql`

**Changes**:
```sql
-- Added columns
✅ ADD COLUMN is_featured (BOOLEAN, DEFAULT FALSE)

-- Added indexes
✅ CREATE INDEX idx_gallery_images_is_featured ON gallery_images(is_featured)
```

**Reason**: Support featured image carousel/highlight functionality

**Migration Safe**: ✅ Yes (uses IF NOT EXISTS)

**Usage**:
```sql
-- Mark image as featured
UPDATE gallery_images SET is_featured = TRUE WHERE id = 'image-uuid';

-- Get only featured images
SELECT * FROM gallery_images WHERE is_featured = TRUE ORDER BY "order";
```

---

## 💡 Usage Examples

### Frontend Integration

#### 1. Fetch All Content (Recommended)

```javascript
import { supabase } from './lib/supabase';

// Single optimized call
const fetchAllContent = async () => {
  const { data, error } = await supabase.rpc('get_all_site_content');
  
  if (error) {
    console.error('Error:', error);
    return null;
  }
  
  return data;
};

// Use in React
const [content, setContent] = useState(null);

useEffect(() => {
  fetchAllContent().then(setContent);
}, []);
```

#### 2. Upload Gallery Image (Admin)

```javascript
// Upload to storage bucket
const uploadGalleryImage = async (file) => {
  // 1. Upload to storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName);

  // 3. Insert into gallery_images table
  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      image_url: publicUrl,
      order: 1, // or calculate next order
      is_featured: false
    })
    .select()
    .single();

  return data;
};
```

#### 3. Update Event with Google Form Link (Admin)

```javascript
const updateEventForm = async (eventId, formUrl) => {
  const { data, error } = await supabase
    .from('events')
    .update({ google_forms: formUrl })
    .eq('id', eventId)
    .select()
    .single();

  return data;
};

// Usage
await updateEventForm('heist', 'https://forms.google.com/...');
```

#### 4. Mark Gallery Images as Featured (Admin)

```javascript
const toggleFeaturedImage = async (imageId, isFeatured) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update({ is_featured: isFeatured })
    .eq('id', imageId)
    .select()
    .single();

  return data;
};

// Usage
await toggleFeaturedImage('uuid-123', true); // Mark as featured
await toggleFeaturedImage('uuid-456', false); // Unmark
```

#### 5. Get Featured Images Only

```javascript
const fetchFeaturedImages = async () => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_featured', true)
    .order('order', { ascending: true });

  return data;
};

// Or use the RPC function result
const { featured_gallery_images } = await supabase.rpc('get_all_site_content');
```

#### 6. Add New Admin (Admin)

```javascript
const addAdmin = async (email) => {
  const { data, error } = await supabase
    .from('admins')
    .insert({ email })
    .select()
    .single();

  return data;
};

// Usage
await addAdmin('newadmin@example.com');
```

#### 7. Update Statistics (Admin)

```javascript
const updateStatistic = async (statId, newValue) => {
  const { data, error } = await supabase
    .from('statistics')
    .update({ value: newValue })
    .eq('id', statId)
    .select()
    .single();

  return data;
};

// Usage
await updateStatistic('stat-2', '15'); // Update events count from 13 to 15
```

---

## 🎯 Best Practices

### 1. Data Fetching
- ✅ Use `get_all_site_content()` RPC for initial page load
- ✅ Use individual queries only for admin updates
- ✅ Cache RPC results in frontend state (React Context, Zustand, etc.)

### 2. Image Management
- ✅ Upload images to appropriate bucket (`gallery`, `event-posters`)
- ✅ Store public URLs in database tables
- ✅ Use `is_featured` flag for carousel/highlight features
- ✅ Optimize images before upload (WebP, compressed JPEG)

### 3. Admin Operations
- ✅ Always check authentication before admin mutations
- ✅ Verify email exists in `admins` table
- ✅ Use Supabase Auth with proper JWT configuration
- ✅ Handle RLS policy errors gracefully

### 4. Performance
- ✅ Use indexed columns in WHERE clauses
- ✅ Order by indexed columns (`order`, `day`)
- ✅ Limit results when fetching single rows (LIMIT 1)
- ✅ Use `COALESCE` for empty arrays in aggregations

### 5. Security
- ✅ Keep RLS enabled on all tables
- ✅ Never expose database credentials in frontend
- ✅ Use Supabase service role key only in backend/server-side
- ✅ Validate user inputs before database operations

---

## 📝 Summary

### Database Architecture
- **11 Tables**: Content management for website sections
- **3 Storage Buckets**: Gallery, event posters, admin documents
- **1 RPC Function**: Optimized data fetching
- **Row Level Security**: Public read, admin write
- **Performance Indexes**: 11 indexes for optimized queries

### Key Features
- ✅ Single API call for all site content (`get_all_site_content()`)
- ✅ Admin allowlist authentication via `admins` table
- ✅ Featured image support for gallery carousel
- ✅ Google Forms integration for event registration
- ✅ Public storage buckets for images
- ✅ Private storage bucket for admin documents
- ✅ Comprehensive RLS policies for security
- ✅ Performance-optimized with strategic indexes

### Files Reference
1. `supabase_migration.sql` - Main database schema + initial data
2. `supabase_rpc_functions.sql` - RPC function for data fetching
3. `supabase_storage_buckets.sql` - Storage bucket configuration
4. `alter_events_table.sql` - Events table modifications
5. `alter_gallery_table.sql` - Gallery table modifications

---

**Last Updated**: January 2025  
**Database**: Supabase (PostgreSQL)  
**Project**: Zynora Cinematic Fest Website

