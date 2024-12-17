import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, Trophy, ChevronRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';


export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleStartPlaying = () => {
    if (isAuthenticated) {
      navigate('/play');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden perspective-1000">
      {/* Background Effects Remain the Same */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              x: [
                Math.random() * window.innerWidth, 
                Math.random() * window.innerWidth, 
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-purple-700/50 rounded-full blur-sm transform rotate-45"
          />
        ))}
      </div>

      {/* Layered Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a2a] to-[#0a0a1a] opacity-90 z-0"></div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotateX: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 1.5,
          ease: "easeInOut"
        }}
        className="container mx-auto px-4 py-20 text-center relative z-10 transform-gpu"
      >
        {/* Logo Section */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <Wallet 
              className="w-32 h-32 text-purple-500 
              transform transition-all hover:scale-110 
              hover:rotate-6 drop-shadow-[0_0_25px_rgba(168,85,247,0.7)] 
              filter brightness-125"
            />
            {/* Glowing Halo Effect */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -inset-6 bg-purple-500/30 rounded-full blur-3xl"
            />
          </div>
        </motion.div>

        {/* Title with Adjusted Size */}
        <motion.h1 
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="text-6xl font-black mb-6 bg-clip-text text-transparent 
          bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
          background-animate drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]
          tracking-tight"
        >
          Crazy Paisa
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1, 
            delay: 0.7,
            type: "spring",
            stiffness: 100
          }}
          className="text-4xl font-bold mb-12 text-gray-200 
          tracking-wide drop-shadow-lg"
        >
          Ultimate Gaming Playground
        </motion.p>

        {/* Start Playing Button */}
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 25px rgba(168,85,247,0.5)"
          }}
          whileTap={{ 
            scale: 0.95,
            rotate: [0, 5, -5, 0]
          }}
          onClick={handleStartPlaying}
          className="bg-gradient-to-r from-purple-700 to-pink-700 
          hover:from-purple-800 hover:to-pink-800 text-white 
          px-16 py-6 rounded-full text-2xl font-bold 
          transition-all shadow-2xl 
          flex items-center justify-center mx-auto group 
          relative overflow-hidden transform-gpu"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r 
            from-purple-500/40 to-pink-500/40 blur-3xl"
          />
          <span className="relative z-10 flex items-center">
            Start Playing
            <ChevronRight 
              className="ml-3 group-hover:translate-x-2 transition-transform" 
            />
          </span>
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: 0
        }}
        transition={{ duration: 1, delay: 1 }}
        className="container mx-auto px-4 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: Gamepad2, 
              color: 'purple', 
              title: 'Diverse Games', 
              description: 'Explore Unlimited Gaming Universes' 
            },
            { 
              icon: Trophy, 
              color: 'yellow', 
              title: 'Win Big', 
              description: 'Massive Rewards Await Champions' 
            },
            { 
              icon: Users, 
              color: 'blue', 
              title: 'Community', 
              description: 'Connect with Global Gaming Elite' 
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9, rotateX: -20 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateX: 0
              }}
              transition={{ 
                duration: 0.8, 
                delay: 1.2 + (index * 0.2),
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 5,
                rotateY: -5,
                boxShadow: "0 0 30px rgba(168,85,247,0.4)"
              }}
              className="bg-[#0a0a1a] border border-purple-900/30 
              rounded-3xl p-10 text-center group cursor-pointer 
              transition-all duration-300 transform-gpu 
              hover:bg-gradient-to-br hover:from-[#1a0a2a] hover:via-[#2a0a3a] hover:to-[#1a0a2a]"
            >
              <div className="relative mb-8">
                <feature.icon 
                  className={`w-24 h-24 text-${feature.color}-500 
                  mx-auto mb-4 group-hover:scale-110 transition-transform 
                  drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] filter brightness-125`} 
                />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-purple-500/30 
                  -z-10 rounded-full blur-3xl"
                />
              </div>
              <h3 className="text-4xl font-bold mb-6 text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-xl text-gray-300 group-hover:text-white transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
  
};

export default Home;