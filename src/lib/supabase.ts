
import { supabase as integrationClient } from '@/integrations/supabase/client';
import { createEnhancedSupabaseClient, testDatabaseConnection } from './supabaseClient';
import { SupabaseClient } from '@supabase/supabase-js';

// Use the integration client as primary, with enhanced client as fallback
export const supabase: SupabaseClient = integrationClient || createEnhancedSupabaseClient();

// A flag to check if Supabase is configured
export const isSupabaseConfigured: boolean = !!supabase;

// Test connection on initialization
if (typeof window !== 'undefined') {
  testDatabaseConnection(supabase).catch(error => {
    console.error("Supabase connection test failed:", error);
  });
}

if (!isSupabaseConfigured) {
  console.error("Supabase client could not be initialized. Please check your Supabase integration.");
}
