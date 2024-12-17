import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Award, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden perspective-1000">
      {/* Advanced 3D Background Effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-[#1a1a2e] transform preserve-3d"
        initial={{ opacity: 0, rotateX: -20, rotateY: 10 }}
        animate={{ 
          opacity: 1, 
          rotateX: 0, 
          rotateY: 0,
          transition: { 
            duration: 1.5, 
            ease: "easeOut" 
          }
        }}
      >
        {/* 3D Floating Elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-gray-700/20 rounded-full"
              style={{
                width: `${Math.random() * 80 + 20}px`,
                height: `${Math.random() * 80 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateZ(${Math.random() * 300 - 150}px) rotate(${Math.random() * 360}deg)`
              }}
              animate={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                rotate: 360,
                transition: { 
                  duration: Math.random() * 10 + 5, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut" 
                }
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content Container with 3D Transformation */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-16 text-white"
        initial={{ opacity: 0, rotateX: 15, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          rotateX: 0, 
          scale: 1,
          transition: { 
            duration: 1, 
            ease: "easeOut" 
          }
        }}
      >
        <div className="max-w-4xl mx-auto transform preserve-3d">
          {/* Logo/Brand Section with 3D Effect */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, z: -100 }}
            animate={{ 
              opacity: 1, 
              z: 0,
              transition: { 
                duration: 1, 
                delay: 0.5 
              }
            }}
          >
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4 transform preserve-3d">
              Crazy Paisa Casino
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto transform preserve-3d">
              Where excitement meets luxury in the world of online gaming
            </p>
          </motion.div>

          {/* Mission Section with Advanced 3D Card Effect */}
          <motion.div 
            className="bg-gray-900/60 backdrop-blur-lg rounded-xl p-8 mb-12 border border-gray-700 shadow-2xl transform preserve-3d"
            initial={{ 
              opacity: 0, 
              rotateX: 15, 
              rotateY: -10,
              z: -50 
            }}
            animate={{ 
              opacity: 1, 
              rotateX: 0, 
              rotateY: 0,
              z: 0,
              transition: { 
                duration: 1, 
                delay: 0.7 
              }
            }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-center">Our Mission</h2>
            <p className="text-gray-300 text-center">
              To provide an unparalleled gaming environment that combines cutting-edge technology, 
              fair play, and thrilling entertainment. We're committed to creating memorable moments 
              for our players while maintaining the highest standards of integrity and excitement.
            </p>
          </motion.div>

          {/* Features Section with Enhanced 3D Card Effects */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Gamepad2 className="w-12 h-12 text-blue-500" />, 
                title: "Premium Gaming", 
                desc: "Cutting-edge games with stunning graphics and immersive experiences",
                color: "from-blue-500 to-blue-700"
              },
              { 
                icon: <Award className="w-12 h-12 text-green-500" />, 
                title: "Fair Play", 
                desc: "Guaranteed fairness and transparent gaming with certified RNG",
                color: "from-green-500 to-green-700"
              },
              { 
                icon: <Globe className="w-12 h-12 text-purple-500" />, 
                title: "Global Experience", 
                desc: "Connect with players worldwide in a secure, exciting platform",
                color: "from-purple-500 to-purple-700"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="relative group"
                initial={{ 
                  opacity: 0, 
                  rotateX: 20 * (index - 1),
                  rotateY: 15 * (index - 1),
                  z: -100 * (index + 1)
                }}
                animate={{ 
                  opacity: 1, 
                  rotateX: 0,
                  rotateY: 0,
                  z: 0,
                  transition: { 
                    delay: index * 0.3, 
                    duration: 1 
                  }
                }}
              >
                {/* 3D Card Background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-xl transform -rotate-3 scale-105 transition-all duration-300 group-hover:opacity-40`}
                ></div>

                {/* Main Card Content */}
                <div 
                  className="relative bg-gray-800/50 backdrop-blur-md rounded-xl p-6 text-center border border-gray-700 transform preserve-3d"
                  style={{
                    transform: `rotateX(5deg) rotateY(${index * 5 - 5}deg) translateZ(20px)`
                  }}
                >
                  <div className="flex justify-center mb-4 transform preserve-3d">
                    <motion.div 
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        transition: { 
                          delay: 0.5 + (index * 0.2), 
                          duration: 0.6 
                        }
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;