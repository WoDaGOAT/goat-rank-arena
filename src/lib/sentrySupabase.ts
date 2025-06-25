
import { supabase } from "@/integrations/supabase/client";
import * as Sentry from "@sentry/react";

// Wrapper function to add Sentry monitoring to Supabase calls
export const withSentrySupabase = <T>(
  operation: () => Promise<T>,
  context: {
    operation: string;
    table?: string;
    method?: string;
  }
) => {
  return Sentry.startSpan(
    { 
      name: `supabase.${context.operation}`,
      op: 'db.query'
    },
    async () => {
      try {
        const result = await operation();
        
        // Add breadcrumb for successful operations
        Sentry.addBreadcrumb({
          category: 'supabase',
          message: `${context.operation} succeeded`,
          level: 'info',
          data: {
            table: context.table,
            method: context.method
          }
        });
        
        return result;
      } catch (error) {
        // Capture Supabase errors with context
        Sentry.captureException(error, {
          tags: {
            component: 'supabase',
            operation: context.operation,
            table: context.table
          },
          extra: {
            method: context.method
          }
        });
        
        throw error;
      }
    }
  );
};

// Enhanced Supabase client with automatic error tracking
export const sentrySupabase = {
  from: (table: string) => ({
    select: (columns?: string) => 
      withSentrySupabase(
        async () => {
          const query = supabase.from(table as any);
          const result = columns ? query.select(columns) : query.select();
          return await result;
        },
        { operation: 'select', table, method: 'select' }
      ),
    
    insert: (data: any) => 
      withSentrySupabase(
        async () => await supabase.from(table as any).insert(data),
        { operation: 'insert', table, method: 'insert' }
      ),
    
    update: (data: any) => ({
      eq: (column: string, value: any) =>
        withSentrySupabase(
          async () => await supabase.from(table as any).update(data).eq(column, value),
          { operation: 'update', table, method: 'update' }
        )
    }),
    
    delete: () => ({
      eq: (column: string, value: any) =>
        withSentrySupabase(
          async () => await supabase.from(table as any).delete().eq(column, value),
          { operation: 'delete', table, method: 'delete' }
        )
    }),
  }),
  
  auth: {
    signUp: (credentials: any) =>
      withSentrySupabase(
        async () => await supabase.auth.signUp(credentials),
        { operation: 'auth.signUp', method: 'signUp' }
      ),
    
    signInWithPassword: (credentials: any) =>
      withSentrySupabase(
        async () => await supabase.auth.signInWithPassword(credentials),
        { operation: 'auth.signIn', method: 'signInWithPassword' }
      ),
    
    signOut: () =>
      withSentrySupabase(
        async () => await supabase.auth.signOut(),
        { operation: 'auth.signOut', method: 'signOut' }
      )
  }
};
