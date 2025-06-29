
import { supabase as integrationClient } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

// The auto-generated client from the integration.
export const supabase: SupabaseClient = integrationClient;

// A flag to check if Supabase is configured, used in App.tsx.
export const isSupabaseConfigured: boolean = !!supabase;

if (!isSupabaseConfigured) {
  console.error("Supabase client could not be initialized. Please check your Supabase integration.");
} else {
  console.log("Supabase client initialized successfully");
  console.log("Supabase URL:", integrationClient.supabaseUrl);
  
  // Test connection
  integrationClient
    .from('categories')
    .select('count')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error("Supabase connection test failed:", error);
      } else {
        console.log("Supabase connection test successful");
      }
    })
    .catch((err) => {
      console.error("Supabase connection test error:", err);
    });
}
