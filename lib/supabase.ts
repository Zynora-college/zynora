import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with optimized settings for production
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage
    persistSession: true,
    // Auto refresh token before expiry
    autoRefreshToken: true,
    // Detect session changes in other tabs
    detectSessionInUrl: true,
    // Storage key for session
    storageKey: 'zynora-auth-token',
  },
  global: {
    headers: {
      // Add custom header for tracking
      'x-client-info': 'zynora-web-app',
    },
  },
  // Database configuration
  db: {
    // Use public schema
    schema: 'public',
  },
  // Realtime configuration (disabled if not needed to reduce connections)
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});
