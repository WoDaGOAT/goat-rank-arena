
import React from 'react';
import { Trophy, Award, Calendar, Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { Helmet } from 'react-helmet-async';

interface ComingSoonPageProps {
  categoryName?: string;
}

const ComingSoonPage = ({ categoryName = "Competition" }: ComingSoonPageProps) => {
  // Set target date to August 16th, 2025
  const targetDate = new Date('2025-08-16T00:00:00');
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  return (
    <>
      <Helmet>
        <title>{`${categoryName} - Coming Soon | Wodagoat`}</title>
        <meta name="description" content={`${categoryName} competition is coming soon! Get ready for the ultimate GOAT debate. Competition starts August 16th, 2025.`} />
      </Helmet>
      
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        style={{ background: 'linear-gradient(135deg, #190749 0%, #070215 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header with Icons */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
            <Award className="h-16 w-16 text-purple-400" />
            <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {categoryName}
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-purple-300 mb-6">
              Coming Soon
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Get ready for the ultimate competition season! The greatest debates in sports history are about to begin.
            </p>
          </div>

          {/* Countdown Timer */}
          {!isExpired ? (
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Calendar className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Competition Starts</h3>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-purple-300 text-lg mb-2">August 16th, 2025</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-purple-300 text-sm uppercase tracking-wide">Days</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-purple-300 text-sm uppercase tracking-wide">Hours</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-purple-300 text-sm uppercase tracking-wide">Minutes</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-purple-300 text-sm uppercase tracking-wide">Seconds</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Competition is Live!</h3>
              <p className="text-green-300">The competition has started. Check back soon for updates!</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Clock className="h-5 w-5" />
              <span className="text-lg">Mark your calendars!</span>
            </div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Be the first to know when the competition launches. Rankings, debates, and the ultimate GOAT discussions await!
            </p>
          </div>

          {/* Visual Elements */}
          <div className="mt-12 opacity-20">
            <div className="flex justify-center items-center gap-8 text-6xl">
              🏆 ⚽ 🥇 🏅 ⭐
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoonPage;
