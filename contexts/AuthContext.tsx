import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache admin status to reduce database queries
const adminStatusCache = new Map<string, { status: boolean; timestamp: number }>();
const ADMIN_CACHE_TTL = 60 * 1000; // 1 minute

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  // Check if user is in admins table with caching
  const checkAdminStatus = async (email: string): Promise<boolean> => {
    try {
      // Check cache first
      const cached = adminStatusCache.get(email);
      if (cached && Date.now() - cached.timestamp < ADMIN_CACHE_TTL) {
        return cached.status;
      }

      const { data, error } = await supabase
        .from('admins')
        .select('email')
        .eq('email', email)
        .single();

      const status = !error && !!data;
      
      // Update cache
      adminStatusCache.set(email, { status, timestamp: Date.now() });
      
      return status;
    } catch {
      return false;
    }
  };

  // Initialize auth state with improved timeout handling
  useEffect(() => {
    mountedRef.current = true;

    const initAuth = async () => {
      try {
        // Use a more reliable approach with proper cleanup
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const { data: { session } } = await supabase.auth.getSession();
          clearTimeout(timeoutId);

          if (!mountedRef.current) return;

          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user?.email) {
            const adminStatus = await checkAdminStatus(session.user.email);
            if (mountedRef.current) {
              setIsAdmin(adminStatus);
            }
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mountedRef.current) {
          // Continue with no session on error
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes with debounce to prevent rapid updates
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mountedRef.current) return;

      // Debounce auth state changes
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(async () => {
        if (!mountedRef.current) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          const adminStatus = await checkAdminStatus(session.user.email);
          if (mountedRef.current) {
            setIsAdmin(adminStatus);
          }
        } else {
          setIsAdmin(false);
        }
      }, 100); // 100ms debounce
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: 'Incorrect email or password' };
      }

      if (!data.user?.email) {
        return { success: false, error: 'Incorrect email or password' };
      }

      // Check if user is in admins table
      const adminStatus = await checkAdminStatus(data.user.email);

      if (!adminStatus) {
        // User authenticated but not an admin - sign them out
        await supabase.auth.signOut();
        return { success: false, error: 'Incorrect email or password' };
      }

      setIsAdmin(true);
      return { success: true };
    } catch {
      return { success: false, error: 'Incorrect email or password' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
