import React from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { GameCard } from '../components/GameCard';
import { ReferralSection } from '../components/ReferralSection';
import { Link } from 'react-router-dom';
import { Coins, DiamondIcon, LayoutGridIcon } from 'lucide-react';

const games = [
  {
    title: 'Limbo',
    description: 'Test your luck with this thrilling multiplier game',
    image: 'https://i.postimg.cc/QdCxmWVb/Whats-App-Image-2024-12-17-at-12-54-13-500c7e34.jpg',
    path: '/games/limbo'
  },
  {
    title: 'Mines',
    description: 'Navigate through a minefield to win big',
    image: 'https://i.postimg.cc/B6TqbTwq/Whats-App-Image-2024-12-17-at-22-23-47-1f17eafa.jpg',
    path: '/games/mines'
  }
];

export const Play = () => {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-100 p-6 overflow-hidden relative">
      {/* Blurred background circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header with Glassmorphic Design */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <LayoutGridIcon className="w-10 h-10 text-white/80 backdrop-blur-sm" />
            <h1 className="text-5xl font-bold text-white/90 backdrop-blur-sm">
              Game Arena
            </h1>
          </div>
          
          <Link
            to="/deposit"
            className="flex items-center space-x-3 
              bg-white/10 
              border border-white/20 
              backdrop-blur-xl 
              text-white 
              px-6 py-3 
              rounded-2xl 
              shadow-2xl 
              hover:bg-white/20 
              transition-all 
              duration-300 
              transform 
              hover:scale-105"
          >
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="font-semibold tracking-wider">Deposit</span>
          </Link>
        </div>

    

        {/* Glassmorphic Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {games.map((game) => (
            <div 
              key={game.title} 
              className="
                bg-white/5 
                border border-white/10 
                backdrop-blur-xl 
                rounded-3xl 
                overflow-hidden 
                shadow-2xl 
                transition-all 
                duration-300 
                hover:scale-105 
                hover:border-white/30"
            >
              <GameCard {...game} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center opacity-50">
          {/* <p className="text-sm backdrop-blur-sm">© 2024 Game Arena. All rights reserved.</p> */}
        </div>
      </div>
      <ReferralSection />
    </div>

    
  );
};

export default Play;