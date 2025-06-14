
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

const UserProfilePage = () => {
  const { user, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState("Sports enthusiast and GOAT debater.");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      // You can add more fields from user metadata here in the future
      // setBio(user.user_metadata?.bio || "Sports enthusiast and GOAT debater.");
    }
  }, [user]);

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
    setIsSaving(true);
    const { data, error } = await supabase.auth.updateUser({
        data: { full_name: name, bio: bio }
    })

    setIsSaving(false);

    if (error) {
        toast.error(error.message);
    } else {
        toast.success("Profile updated successfully!");
        // We can optimistically update the name in the auth context or force a refresh
        setName(data.user.user_metadata.full_name);
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
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={name} />
                  <AvatarFallback>{name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name-profile">Name</Label>
                  <Input id="name-profile" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/10 border-gray-600 focus:border-blue-500" />
                </div>
                <div>
                  <Label htmlFor="email-profile">Email</Label>
                  <Input id="email-profile" type="email" defaultValue={user.email} readOnly className="bg-white/10 border-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <Label htmlFor="bio-profile">Bio</Label>
                  <Input id="bio-profile" value={bio} onChange={(e) => setBio(e.target.value)} className="bg-white/10 border-gray-600 focus:border-blue-500" />
                </div>
              </div>

              <div className="flex justify-end">
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
