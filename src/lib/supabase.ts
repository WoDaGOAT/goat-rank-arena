
import { supabase as integrationClient } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

// The auto-generated client from the integration.
export const supabase: SupabaseClient = integrationClient;

// A flag to check if Supabase is configured, used in App.tsx.
export const isSupabaseConfigured: boolean = !!supabase;

if (!isSupabaseConfigured) {
  console.error("Supabase client could not be initialized. Please check your Supabase integration.");
}
