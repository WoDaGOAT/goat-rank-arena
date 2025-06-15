
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import type { User } from "@supabase/supabase-js";
import type { Database } from '@/integrations/supabase/types';
import { sanitize } from "@/lib/sanitize";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileHeaderProps {
  profile: Profile | null;
  user: User;
  name: string;
  isUploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader = ({ profile, user, name, isUploading, handleAvatarUpload }: ProfileHeaderProps) => {
  const sanitizedName = sanitize(name);
  return (
    <div className="flex items-center space-x-4">
      <div className="relative group">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.avatar_url || undefined} alt={sanitizedName} />
          <AvatarFallback>{sanitizedName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
        </Avatar>
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <ImageIcon className="h-8 w-8 text-white" />
          )}
        </label>
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleAvatarUpload}
          disabled={isUploading}
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{sanitizedName || user.email}</h2>
        <p className="text-gray-400">{user.email || ''}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
