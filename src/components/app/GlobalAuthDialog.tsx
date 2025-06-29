
import { useAuth } from "../../contexts/AuthContext";
import AuthDialog from "../auth/AuthDialog";

const GlobalAuthDialog = () => {
  const { authDialogOpen, closeAuthDialog, authDialogMode } = useAuth();
  
  return (
    <AuthDialog 
      open={authDialogOpen} 
      onOpenChange={closeAuthDialog}
      defaultMode={authDialogMode}
    />
  );
};

export default GlobalAuthDialog;
