
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { sanitize } from '@/lib/sanitize';

interface ProfileData {
    name: string;
    country: string;
    favoriteSports: string[];
}

export const useProfileUpdater = () => {
    const { user, refetchUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = async ({ name, country, favoriteSports }: ProfileData) => {
        if (!user) return;
        setIsSaving(true);
        const { error } = await supabase!
            .from('profiles')
            .update({ 
              full_name: sanitize(name),
              country: country,
              favorite_sports: favoriteSports,
            })
            .eq('id', user.id);
    
        setIsSaving(false);
    
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Profile updated successfully!");
            await refetchUser();
        }
    };

    return { isSaving, handleSaveChanges };
};
