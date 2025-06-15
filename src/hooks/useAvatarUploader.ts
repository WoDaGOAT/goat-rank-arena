
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useAvatarUploader = () => {
    const { user, profile, refetchUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const file = event.target.files?.[0];
        if (!file) return;
    
        setIsUploading(true);
    
        try {
          if (profile?.avatar_url) {
              const oldAvatarPath = profile.avatar_url.split('/').pop();
              if(oldAvatarPath) {
                await supabase.storage.from('avatars').remove([oldAvatarPath]);
              }
          }
    
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
    
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);
    
          if (uploadError) {
            throw uploadError;
          }
    
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);
          
          if (updateError) {
            throw updateError;
          }
    
          toast.success("Avatar updated successfully!");
          await refetchUser();
    
        } catch (error: any) {
          toast.error(error.message || "Failed to upload avatar.");
        } finally {
          setIsUploading(false);
          if (event.target) {
            event.target.value = '';
          }
        }
      };

      return { isUploading, handleAvatarUpload };
};
