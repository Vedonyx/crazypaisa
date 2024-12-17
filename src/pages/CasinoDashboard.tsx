import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Award, BarChart2, Star } from 'lucide-react';

// Enhanced 3D Background Effect Component
const Background3D = () => (
  <div className="absolute inset-0 overflow-hidden z-0 bg-black">
    {[...Array(50)].map((_, i) => {
      const size = Math.random() * 3 + 1;
      const delay = Math.random() * 10;
      const duration = Math.random() * 15 + 10;

      return (
        <motion.div 
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -100,
            opacity: 0,
            scale: size
          }}
          animate={{ 
            y: window.innerHeight + 100,
            x: [
              Math.random() * window.innerWidth, 
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            opacity: [0, 0.7, 0],
            rotate: 360,
            transition: { 
              delay: delay,
              duration: duration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: "easeInOut"
            }
          }}
          className={`absolute bg-purple-500 bg-opacity-50 rounded-full blur-md`}
          style={{
            width: `${size}rem`,
            height: `${size}rem`
          }}
        />
      );
    })}
    
    {/* Glowing Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 mix-blend-overlay"></div>
  </div>
);

// 3D Coin Component
const Coin3D = ({ value }) => {
  const [isRotating, setIsRotating] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsRotating(!isRotating)}
      className={`w-32 h-32 relative perspective-1000 cursor-pointer`}
    >
      <motion.div 
        animate={{ 
          rotateY: isRotating ? 180 : 0,
          transition: { duration: 0.8 }
        }}
        className="w-full h-full absolute transition-transform duration-800 [transform-style:preserve-3d]"
      >
        <div className="absolute w-full h-full bg-gradient-to-br from-purple-900 to-indigo-800 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl backface-hidden">
          {value}
        </div>
        <div className="absolute w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl rotate-y-180 backface-hidden">
          <Coins size={48} className="text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Stat Card Component (rest of the code remains the same as in the previous version)
const StatCard = ({ icon, title, value, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.6)"
    }}
    className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm border-2 border-purple-900 rounded-xl p-6 text-white shadow-2xl transform transition-all duration-300"
  >
    <div className="relative z-10">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="ml-4 text-xl font-bold text-purple-300">{title}</h3>
      </div>
      <div className="text-4xl font-extrabold text-purple-500 mb-2">{value}</div>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const CasinoDashboard = () => {
  const [stats, setStats] = useState({
    totalWins: 0,
    totalBets: 0,
    playerCount: 0,
    jackpotAmount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStats({
        totalWins: 1234567,
        totalBets: 9876543,
        playerCount: 45678,
        jackpotAmount: 2500000
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced 3D Background */}
      <Background3D />

      <div className="relative z-10 p-8">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-black text-center mb-12 text-purple-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
        >
          CrazyPaisa Casino Stats
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            icon={<Award color="#8B5CF6" size={40} />}
            title="Total Wins"
            value={`₹${stats.totalWins.toLocaleString()}`}
            description="Winnings across all games"
          />
          <StatCard 
            icon={<BarChart2 color="#6D28D9" size={40} />}
            title="Total Bets"
            value={`₹${stats.totalBets.toLocaleString()}`}
            description="Total amount wagered"
          />
          <StatCard 
            icon={<Star color="#A855F7" size={40} />}
            title="Active Players"
            value={stats.playerCount.toLocaleString()}
            description="Players enjoying games now"
          />
          <StatCard 
            icon={<Coins color="#7C3AED" size={40} />}
            title="Jackpot"
            value={`₹${stats.jackpotAmount.toLocaleString()}`}
            description="Current jackpot amount"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex justify-center space-x-8"
        >
          <Coin3D value="₹50" />
          <Coin3D value="₹100" />
          <Coin3D value="₹500" />
        </motion.div>
      </div>
    </div>
  );
};

export default CasinoDashboard;