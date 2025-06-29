
const UserRankingLoadingState = ({ rankingId }: { rankingId?: string }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}>
      <main className="container mx-auto px-4 py-8 text-center text-white flex-grow flex items-center justify-center">
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your ranking...</p>
          <p className="text-sm text-gray-400 mt-2">Ranking ID: {rankingId}</p>
        </div>
      </main>
    </div>
  );
};

export default UserRankingLoadingState;
