
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import RoleManager from "./RoleManager";
import DeleteUserDialog from "./DeleteUserDialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type UserWithRoles = Database['public']['Functions']['get_all_users_with_roles']['Returns'][number];

const UserTable = () => {
    const { data: users, isLoading, error, refetch } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_all_users_with_roles');
            if (error) throw new Error(error.message);
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user: UserWithRoles) => (
                        <TableRow key={user.user_id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatar_url || ''} />
                                        <AvatarFallback>{user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span>{user.full_name || 'N/A'}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                    {user.roles?.length > 0 ? user.roles.map(role => (
                                        <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>{role}</Badge>
                                    )) : <span className="text-muted-foreground text-sm">No roles</span>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <RoleManager userId={user.user_id} currentRoles={user.roles} />
                                    <DeleteUserDialog userId={user.user_id} userName={user.full_name} onSuccess={refetch} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserTable;

