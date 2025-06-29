
const LoadingFallback = () => {
  console.log('LoadingFallback: Rendering');
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading WoDaGOAT...</p>
        <p className="text-gray-400 text-sm mt-2">Initializing application...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
