
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { AppRole } from '@/types/auth';

export const useUserRoles = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isModeratorOrAdmin, setIsModeratorOrAdmin] = useState(false);

  const fetchUserRoles = useCallback(async (userId: string): Promise<AppRole[]> => {
    console.log('useUserRoles: Fetching roles for user', userId);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('useUserRoles: Error fetching roles:', rolesError);
        return [];
      }

      const roles = rolesData?.map(r => r.role) || [];
      console.log('useUserRoles: User roles fetched:', roles);
      return roles;
    } catch (error) {
      console.error('useUserRoles: Role fetch failed:', error);
      return [];
    }
  }, []);

  const updateRoleStates = useCallback((roles: AppRole[]) => {
    const adminRole = roles.includes('admin');
    const moderatorRole = roles.includes('moderator');
    
    setIsAdmin(adminRole);
    setIsModerator(moderatorRole);
    setIsModeratorOrAdmin(adminRole || moderatorRole);
    
    console.log('useUserRoles: Role states updated', { 
      isAdmin: adminRole, 
      isModerator: moderatorRole, 
      isModeratorOrAdmin: adminRole || moderatorRole 
    });
  }, []);

  const clearRoles = useCallback(() => {
    setIsAdmin(false);
    setIsModerator(false);
    setIsModeratorOrAdmin(false);
  }, []);

  return {
    isAdmin,
    isModerator,
    isModeratorOrAdmin,
    fetchUserRoles,
    updateRoleStates,
    clearRoles,
  };
};
