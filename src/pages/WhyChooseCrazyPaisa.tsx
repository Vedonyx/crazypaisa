import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Star, Trophy, HeartHandshake, Gem } from 'lucide-react';

const WhyChooseCrazyPaisa: React.FC = () => {
  const premiumFeatures = [
    {
      icon: <Shield className="w-16 h-16 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />,
      title: "Ultimate Security Fortress",
      description: "Quantum-level encryption with military-grade security protocols protecting every transaction.",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: <Gem className="w-16 h-16 text-purple-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" />,
      title: "VIP Elite Experience",
      description: "Exclusive high-roller lounges with personalized concierge and unprecedented winning opportunities.",
      gradient: "from-purple-600 to-indigo-700"
    },
    {
      icon: <Trophy className="w-16 h-16 text-gold-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />,
      title: "Mega Jackpot Extravaganza",
      description: "Revolutionary progressive jackpot networks with life-transforming multi-million prizes.",
      gradient: "from-yellow-500 to-amber-600"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a] text-white">
      {/* 3D Background Effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0a2a] via-[#121236] to-[#1a1a4a] 
        opacity-75 
        animate-gradient-x 
        background-animate"></div>
      
      {/* Particle-like Background Effect */}
      <div className="absolute inset-0 z-10 opacity-20">
        {[...Array(100)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: `${Math.random() * 5}px`,
              height: `${Math.random() * 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`
            }}
            animate={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-20 max-w-6xl mx-auto px-4 py-16"
      >
        <h1 className="text-6xl font-black text-center mb-16 
          text-transparent bg-clip-text 
          bg-gradient-to-r from-cyan-300 via-purple-500 to-pink-500
          animate-text-shimmer">
          Why Crazy Paisa is Your Ultimate Casino Destination
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {premiumFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-[#1e1e3a] 
                rounded-3xl 
                p-8 
                border-2 
                border-transparent 
                hover:border-cyan-500/50
                transition-all
                duration-500
                shadow-2xl
                hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              whileHover={{ 
                scale: 1.05,
                rotate: Math.random() * 2 - 1
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold text-center mb-4 
                text-transparent bg-clip-text 
                bg-gradient-to-r ${feature.gradient}`}>
                {feature.title}
              </h3>
              <p className="text-gray-300 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center bg-[#2a2a4a] rounded-3xl p-12 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold mb-6 
            text-transparent bg-clip-text 
            bg-gradient-to-r from-pink-500 to-purple-600">
            Your Premium Gaming Universe
          </h2>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Crazy Paisa transcends traditional gambling - we're a premium digital entertainment ecosystem 
            meticulously crafted for the most discerning players seeking unparalleled excitement, security, and luxury.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WhyChooseCrazyPaisa;