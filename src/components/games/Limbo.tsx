import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { updateUserPoints } from '../../utils/github';
import { sendGameLog } from '../../utils/discord';
import { 
  ArrowLeft, 
  Coins, 
  PlayCircle, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility function to calculate winning probability
const calculateWinningProbability = (multiplier: number, bet: number) => {
  let baseProbability = 0.5;

  if (bet > 10 && bet <= 20) baseProbability -= 0.05;
  else if (bet > 20 && bet <= 50) baseProbability -= 0.08;
  else if (bet > 50 && bet <= 60) baseProbability -= 0.10;
  else if (bet > 60) baseProbability -= 0.15;

  const multiplierReduction = Math.max(0, (multiplier - 2) * 0.1);
  baseProbability -= multiplierReduction;

  return Math.max(0.05, baseProbability);
};

export const Limbo = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [multiplier, setMultiplier] = useState(2.0);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const animationRef = useRef<number | null>(null);
  const multiplierRef = useRef(1.0);
  const [lastBetAmount, setLastBetAmount] = useState(10);
  const [lastMultiplier, setLastMultiplier] = useState(2.0);
  const [gameBackground, setGameBackground] = useState('bg-gradient-to-br from-gray-900 via-purple-900 to-black');

  // Animated Multiplier Counter
  const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const duration = 500; // 500ms animation
      const startTime = Date.now();
      const startValue = displayValue;

      const updateValue = () => {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuad = progress * (2 - progress); // Smooth easing
        const newValue = startValue + (value - startValue) * easeOutQuad;
        
        setDisplayValue(newValue);

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
    }, [value]);

    return <>{displayValue.toFixed(2)}</>;
  };

  const doubleBet = () => {
    const newBet = Math.min(betAmount * 2, user?.points || 0);
    setBetAmount(newBet);
  };

  const halveBet = () => {
    const newBet = Math.max(betAmount / 2, 1);
    setBetAmount(newBet);
  };

  const startGame = () => {
    if (!user || betAmount > user.points) return;

    setLastBetAmount(betAmount);
    setLastMultiplier(multiplier);
    setIsPlaying(true);
    setResult(null);
    setCurrentMultiplier(1.0);
    multiplierRef.current = 1.0;
    
    // Dynamic background during game
    setGameBackground('bg-gradient-to-br from-purple-900 via-black to-gray-900');

    const winProbability = calculateWinningProbability(multiplier, betAmount);
    const won = Math.random() < winProbability;

    const animateMultiplier = () => {
      const baseIncrement = 0.05;
      const spikeChance = Math.random();
      
      let increment = baseIncrement;
      if (spikeChance < 0.05 && betAmount < 50) {
        increment = Math.random() * 5;
      }

      multiplierRef.current = Math.min(
        multiplierRef.current + increment, 
        won ? multiplier + Math.random() * 2 : multiplier - Math.random()
      );
      
      setCurrentMultiplier(multiplierRef.current);

      const shouldStop = won 
        ? multiplierRef.current >= multiplier
        : multiplierRef.current < multiplier;

      if (shouldStop) {
        endGame(won);
      } else {
        animationRef.current = requestAnimationFrame(animateMultiplier);
      }
    };

    animationRef.current = requestAnimationFrame(animateMultiplier);
  };

  const endGame = async (won: boolean) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const winAmount = Math.floor(lastBetAmount * lastMultiplier);
    const pointsChange = won ? winAmount - lastBetAmount : -lastBetAmount;
    const newPoints = user!.points + pointsChange;

    // Restore background
    setGameBackground('bg-gradient-to-br from-gray-900 via-purple-900 to-black');

    await updateUserPoints(user!.id, newPoints);
    await sendGameLog({
      userId: user!.id,
      username: user!.username,
      game: 'Limbo',
      result: won ? 'win' : 'lose',
      betAmount: lastBetAmount,
      pointsChange,
      finalPoints: newPoints,
      multiplier: lastMultiplier
    });

    login({ ...user!, points: newPoints });
    setResult(won ? 'win' : 'lose');
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (result) {
      timeoutId = setTimeout(() => {
        setResult(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [result]);

  return (
    <div className={`${gameBackground} min-h-screen flex flex-col justify-center items-center p-4 transition-all duration-500`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-black/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/play')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Games
          </motion.button>
          <div className="flex items-center text-yellow-500">
            <Coins className="w-5 h-5 mr-2" />
            <span>{user?.points || 0} Points</span>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-white mb-8 text-center">Limbo</h2>

        {/* Multiplier Display */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className={`text-7xl font-bold ${
              result === 'win' 
                ? 'text-green-500' 
                : result === 'lose' 
                ? 'text-red-500' 
                : 'text-white'
            }`}
          >
            {isPlaying ? <AnimatedNumber value={currentMultiplier} /> : `${currentMultiplier.toFixed(2)}x`}
          </div>
        </motion.div>

        {/* Bet Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-400 mb-2">Bet Amount</label>
            <div className="flex">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={halveBet} 
                className="bg-gray-700 px-4 py-3 rounded-l text-white"
              >
                <ChevronDown />
              </motion.button>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="bg-gray-700 text-white px-4 py-2 w-full text-center"
                min={1}
                max={user?.points || 0}
              />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={doubleBet} 
                className="bg-gray-700 px-4 py-3 rounded-r text-white"
              >
                <ChevronUp />
              </motion.button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Multiplier</label>
            <input
              type="number"
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
              className="bg-gray-700 text-white rounded px-4 py-3 w-full"
              min={1.1}
              max={100}
              step={0.1}
            />
          </div>
        </div>

        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          disabled={isPlaying || !user || betAmount > (user?.points || 0)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg disabled:opacity-50 flex items-center justify-center"
        >
          <PlayCircle className="mr-2" />
          {isPlaying ? 'Playing...' : 'Play'}
        </motion.button>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-6 text-center p-4 rounded-lg ${
                result === 'win' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {result === 'win' ? (
                <p>You won {Math.floor(lastBetAmount * lastMultiplier)} points!</p>
              ) : (
                <p>You lost {lastBetAmount} points!</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Limbo;