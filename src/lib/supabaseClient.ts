
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://iqdiaqepjekcqievefvp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZGlhcWVwamVrY3FpZXZlZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTAwOTgsImV4cCI6MjA2NTQ4NjA5OH0.HLyFl9udVKO6NrLVqWdDyJyp6SP73s1IJ8refw1RwqU";

// Create enhanced Supabase client with better error handling
export const createEnhancedSupabaseClient = (): SupabaseClient<Database> => {
  try {
    const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });

    console.log('✅ Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    throw error;
  }
};

// Test database connection
export const testDatabaseConnection = async (client: SupabaseClient) => {
  try {
    console.log('🔍 Testing database connection...');
    const { data, error } = await client.from('categories').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
    
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test error:', error);
    return false;
  }
};
