import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Image as ImageIcon, Loader2 } from 'lucide-react';

const UserProfilePage = () => {
  const { user, profile, loading, refetchUser } = useAuth();
  
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const availableSports = ["Football", "Basketball", "Tennis", "Formula 1", "MMA"];

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
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={name} />
                    <AvatarFallback>{name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
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
                  <h2 className="text-xl font-semibold">{name || user.email}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Basic Info</h3>
                    <div>
                      <Label htmlFor="name-profile">Display Name</Label>
                      <Input id="name-profile" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/10 border-gray-600 focus:border-blue-500" />
                    </div>
                    <div>
                      <Label htmlFor="email-profile">Email</Label>
                      <Input id="email-profile" type="email" value={user.email || ''} readOnly className="bg-white/10 border-gray-600 cursor-not-allowed" />
                    </div>
                    <div>
                      <Label htmlFor="country-profile">Country</Label>
                      <Input id="country-profile" value={country} onChange={(e) => setCountry(e.target.value)} className="bg-white/10 border-gray-600 focus:border-blue-500" placeholder="e.g. United States" />
                    </div>
                    <div>
                      <Label>Favorite Sport(s)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                        {availableSports.map(sport => (
                          <div key={sport} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sport-${sport}`}
                              checked={favoriteSports.includes(sport)}
                              onCheckedChange={() => handleSportChange(sport)}
                              className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                            <Label htmlFor={`sport-${sport}`} className="font-normal cursor-pointer">{sport}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                     <div>
                      <Label>Date Joined</Label>
                      <p className="text-gray-300 pt-2">{user.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'N/A'}</p>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Ranking Activity</h3>
                    <div className="text-gray-400">
                        <p>Total Rankings Submitted: 0</p>
                        <p>Categories Voted In: None</p>
                        <p>Last Ranking Submitted: N/A</p>
                        <p className="text-sm mt-2 italic">(Ranking features are coming soon!)</p>
                    </div>
                </div>
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
