import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import UserTable from "@/components/admin/UserTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddUserDialog from "@/components/admin/AddUserDialog";
import Footer from "@/components/Footer";

const UserManagementPage = () => {
  const { isAdmin, loading } = useAuth();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-8 w-1/2" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page. Administrator access is required.
          </AlertDescription>
        </Alert>
      );
    }

    return <UserTable />;
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold">User Management</h1>
            {isAdmin && (
              <AddUserDialog>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </AddUserDialog>
            )}
          </div>
          <p className="text-muted-foreground mb-8">View, manage roles, delete, and add new users.</p>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserManagementPage;
