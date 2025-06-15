
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import RankingActivity from "@/components/profile/RankingActivity";
import UserCommentsActivity from "@/components/profile/UserCommentsActivity";
import FriendsList from "@/components/profile/FriendsList";
import { useLikedCategories } from "@/hooks/useLikedCategories";
import { useUserComments } from "@/hooks/useUserComments";
import { useUserRankings } from "@/hooks/useUserRankings";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useProfileUpdater } from "@/hooks/useProfileUpdater";
import { useAvatarUploader } from "@/hooks/useAvatarUploader";
import { useUserQuizAttempts } from "@/hooks/useUserQuizAttempts";
import QuizActivity from "@/components/profile/QuizActivity";
import Footer from "@/components/Footer";

const UserProfilePage = () => {
  const { user, profile, loading } = useAuth();
  
  const { 
    name, setName, country, setCountry, favoriteSports, handleSportChange 
  } = useProfileForm(profile);

  const { isSaving, handleSaveChanges } = useProfileUpdater();
  const { isUploading, handleAvatarUpload } = useAvatarUploader();

  const { data: likedCategories, isLoading: isLoadingLikedCategories } = useLikedCategories();
  const { data: userComments, isLoading: isLoadingUserComments } = useUserComments();
  const { data: userRankings, isLoading: isLoadingUserRankings } = useUserRankings();
  const { data: quizAttempts, isLoading: isLoadingQuizAttempts } = useUserQuizAttempts();

  const availableSports = ["American Football", "Baseball", "Basketball", "Boxe", "Cricket", "F1", "MMA", "Soccer", "Tennis"].sort();

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

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}
      >
        <main className="container mx-auto px-4 py-12 flex-grow">
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
                
                <RankingActivity 
                  likedCategories={likedCategories} 
                  isLoading={isLoadingLikedCategories}
                  userRankings={userRankings}
                  isLoadingUserRankings={isLoadingUserRankings}
                />

                <QuizActivity 
                  quizAttempts={quizAttempts}
                  isLoading={isLoadingQuizAttempts}
                />

                <UserCommentsActivity userComments={userComments} isLoading={isLoadingUserComments} />

                <div className="border-t border-gray-700"></div>

                <FriendsList />
              </div>

              <div className="flex justify-end pt-6">
                <Button variant="cta" onClick={() => handleSaveChanges({name, country, favoriteSports})} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UserProfilePage;
