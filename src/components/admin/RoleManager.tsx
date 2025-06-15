
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database['public']['Enums']['app_role'];

const ALL_ROLES: AppRole[] = ['admin', 'moderator', 'user'];

interface RoleManagerProps {
  userId: string;
  currentRoles: AppRole[];
}

const RoleManager = ({ userId, currentRoles }: RoleManagerProps) => {
  const queryClient = useQueryClient();

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: AppRole }) => {
      const { error } = await supabase.rpc('add_role_to_user', { p_user_id: userId, p_role: role });
      if (error) throw error;
    },
    onSuccess: (_, { role }) => {
      toast.success(`Role '${role}' added.`);
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
    onError: (error, { role }) => {
      toast.error(`Failed to add role '${role}'.`, { description: error.message });
    }
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: AppRole }) => {
      const { error } = await supabase.rpc('remove_role_from_user', { p_user_id: userId, p_role: role });
      if (error) throw error;
    },
    onSuccess: (_, { role }) => {
      toast.info(`Role '${role}' removed.`);
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
    onError: (error, { role }) => {
      toast.error(`Failed to remove role '${role}'.`, { description: error.message });
    }
  });

  const handleRoleChange = (role: AppRole, checked: boolean) => {
    if (checked) {
      addRoleMutation.mutate({ userId, role });
    } else {
      removeRoleMutation.mutate({ userId, role });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-40 justify-between">
          <span>Manage Roles</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Assign Roles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ALL_ROLES.map((role) => (
          <DropdownMenuCheckboxItem
            key={role}
            checked={currentRoles.includes(role)}
            onCheckedChange={(checked) => handleRoleChange(role, !!checked)}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleManager;
