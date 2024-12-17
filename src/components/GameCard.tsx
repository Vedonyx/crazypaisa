import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  path: string;
}

export const GameCard: React.FC<GameCardProps> = ({ title, description, image, path }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        type: "spring", 
        stiffness: 100 
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="game-card-container relative"
    >
      <div className="game-card-inner relative w-full h-full">
        {/* Dark Gradient Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] 
          opacity-90 blur-sm rounded-2xl" 
        />
        
        {/* Content Layer */}
        <div className="relative z-10 game-card-content bg-opacity-80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl">
          {/* Image Layer */}
          <div className="image-layer relative overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-48 object-cover transition-transform duration-500 ease-in-out"
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 mix-blend-overlay"></div>
          </div>
          
          {/* Content Layer */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-3">
              {title}
            </h3>
            <p className="text-gray-300 opacity-80 mb-4">
              {description}
            </p>
            
            {/* Play Now Button */}
            <Link 
              to={path} 
              className="inline-block w-full text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 
              text-white font-bold rounded-lg transition-colors duration-300 ease-in-out"
            >
              Play Now
            </Link>
          </div>
          
          {/* Dynamic Glowing Border */}
          <div 
            className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at center, 
                  rgba(99, 102, 241, 0.3), 
                  rgba(168, 85, 247, 0.1)
                )
              `,
              opacity: 0.7
            }}
          />
        </div>
        
        {/* Floating Shadow */}
        <motion.div 
          className="absolute -bottom-4 left-0 right-0 h-4 bg-black opacity-30 blur-md transform -skew-x-6 -rotate-3"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default GameCard;