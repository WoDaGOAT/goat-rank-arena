
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import RankingActivity from "@/components/profile/RankingActivity";
import { useQuery } from "@tanstack/react-query";
import UserCommentsActivity from "@/components/profile/UserCommentsActivity";
import { UserComment } from "@/types";

const UserProfilePage = () => {
  const { user, profile, loading, refetchUser } = useAuth();
  
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const availableSports = ["American Football", "Baseball", "Basketball", "Boxe", "Cricket", "F1", "MMA", "Soccer", "Tennis"].sort();

  const { data: likedCategories, isLoading: isLoadingLikedCategories } = useQuery({
    queryKey: ['likedCategories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('category_likes')
        .select(`categories (id, name)`)
        .eq('user_id', user.id);

      if (error) {
        toast.error("Failed to fetch liked leaderboards.");
        console.error('Error fetching liked categories:', error);
        return [];
      }
      if (!data) {
        return [];
      }
      // The relationship might be incorrectly typed as one-to-many, causing a nested array.
      // .flat() will correct this structure if needed.
      return data
        .map(item => item.categories)
        .flat()
        .filter(Boolean) as { id: string, name: string | null }[];
    },
    enabled: !!user && !loading,
  });

  const { data: userComments, isLoading: isLoadingUserComments } = useQuery({
    queryKey: ['userComments', user?.id],
    queryFn: async () => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('category_comments')
            .select(`
                id,
                comment,
                created_at,
                category_id,
                categories ( name )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            toast.error("Failed to fetch your comments.");
            console.error('Error fetching user comments:', error);
            return [] as UserComment[];
        }
        
        if (!data) {
            return [];
        }

        const formattedData = data.map((comment) => ({
            ...comment,
            categories: Array.isArray(comment.categories) ? (comment.categories[0] || null) : (comment.categories || null),
        }));

        return formattedData as UserComment[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setCountry(profile.country || '');
      setFavoriteSports(profile.favorite_sports || []);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase!
        .from('profiles')
        .update({ 
          full_name: name,
          country: country,
          favorite_sports: favoriteSports,
        })
        .eq('id', user.id)

    setIsSaving(false);

    if (error) {
        toast.error(error.message);
    } else {
        toast.success("Profile updated successfully!");
        await refetchUser();
    }
  };

  const handleSportChange = (sport: string) => {
    setFavoriteSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // First, remove old avatar if it exists
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
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto bg-white/5 text-white border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProfileHeader
                profile={profile}
                user={user}
                name={name}
                isUploading={isUploading}
                handleAvatarUpload={handleAvatarUpload}
              />
              
              <div className="space-y-6">
                <ProfileForm
                  name={name}
                  setName={setName}
                  country={country}
                  setCountry={setCountry}
                  user={user}
                  favoriteSports={favoriteSports}
                  handleSportChange={handleSportChange}
                  availableSports={availableSports}
                />
                
                <RankingActivity likedCategories={likedCategories} isLoading={isLoadingLikedCategories} />

                <UserCommentsActivity userComments={userComments} isLoading={isLoadingUserComments} />
              </div>

              <div className="flex justify-end pt-6">
                <Button variant="cta" onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default UserProfilePage;
