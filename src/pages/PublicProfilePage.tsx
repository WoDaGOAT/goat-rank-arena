import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Ignore "no rows found" error
            console.error('Error fetching public profile:', error);
            toast.error('Failed to load profile.');
        }
        return null;
      }
      return data;
    },
    enabled: !!userId,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
          <div>
            <Skeleton className="h-6 w-48 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-lg text-gray-400 mb-4">The user profile you are looking for does not exist.</p>
            <Link to="/feed" className="text-blue-400 hover:text-blue-300 underline">
            Return to Feed
            </Link>
        </div>
      );
    }

    return (
       <div className="space-y-6">
         <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
              <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name || 'Anonymous User'}</h2>
              {profile.country && <p className="text-gray-400">{profile.country}</p>}
            </div>
          </div>

          <div className="pt-6 text-center text-gray-500 border-t border-gray-700/50">
            <p className="pt-4">More profile details and activity will be shown here soon.</p>
          </div>
       </div>
    );
  };

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
            <CardContent>
              {renderContent()}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PublicProfilePage;
