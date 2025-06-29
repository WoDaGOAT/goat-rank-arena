
import { ReactNode } from "react";

interface UserRankingPageLayoutProps {
  children: ReactNode;
}

const UserRankingPageLayout = ({ children }: UserRankingPageLayoutProps) => {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: "linear-gradient(135deg, #190749 0%, #070215 100%)" }}>
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
    </div>
  );
};

export default UserRankingPageLayout;
