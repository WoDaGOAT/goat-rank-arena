
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useSecurityMonitoring } from './useSecurityMonitoring';

export const useAdminSecurity = () => {
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { logSuspiciousActivity } = useSecurityMonitoring();

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        setIsVerifiedAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Use the secure server-side function to verify admin status
        const { data, error } = await supabase.rpc('is_admin', { 
          p_user_id: user.id 
        });

        if (error) {
          console.error('Admin verification error:', error);
          logSuspiciousActivity({
            action: 'admin_verification_error',
            user_id: user.id,
            error: error.message
          });
          setIsVerifiedAdmin(false);
        } else {
          setIsVerifiedAdmin(!!data);
          
          // Log admin access attempts
          if (data) {
            logSuspiciousActivity({
              action: 'admin_access_granted',
              user_id: user.id,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (error) {
        console.error('Admin verification failed:', error);
        setIsVerifiedAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdminStatus();
  }, [user, logSuspiciousActivity]);

  const executeAdminAction = async <T>(
    action: () => Promise<T>,
    actionName: string,
    actionDetails?: Record<string, any>
  ): Promise<T | null> => {
    if (!isVerifiedAdmin) {
      logSuspiciousActivity({
        action: 'unauthorized_admin_attempt',
        user_id: user?.id,
        attempted_action: actionName,
        details: actionDetails
      });
      throw new Error('Unauthorized: Admin privileges required');
    }

    try {
      const result = await action();
      
      // Log successful admin action
      await supabase.from('admin_audit_log').insert({
        admin_user_id: user!.id,
        action: actionName,
        new_values: actionDetails || {},
        created_at: new Date().toISOString()
      });

      return result;
    } catch (error) {
      console.error(`Admin action ${actionName} failed:`, error);
      throw error;
    }
  };

  return {
    isVerifiedAdmin,
    isLoading,
    executeAdminAction
  };
};
