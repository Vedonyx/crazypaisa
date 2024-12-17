import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { updateUserPoints } from '../../utils/github';
import { sendGameLog } from '../../utils/discord';
import { 
  ArrowLeft, Coins, Bomb, Gem, Filter, Layers, 
  ChevronRight, AlertTriangle, Mountain, 
  Cpu, Leaf, Brain, Shield, Rocket, Sparkles, Menu, X
} from 'lucide-react';

interface Cell {
  revealed: boolean;
  isMine: boolean;
  type?: 'standard' | 'bonus' | 'trap';
}

interface GameFilter {
  difficulty: number;
  riskLevel: 'easy' | 'medium' | 'hard' | 'extreme';
  theme: 'classic' | 'nature' | 'tech' | 'cyberpunk' | 'adventure';
}

// Multiplier progression based on safe tiles and number of bombs
const MULTIPLIER_PROGRESSION = {
  24: [1, 1.04, 1.08, 1.12, 1.18, 1.25],
  22: [1, 1.12, 1.25, 1.39, 1.58, 1.80],
  20: [1, 1.20, 1.42, 1.68, 2.04, 2.55],
  15: [1, 1.33, 1.78, 2.47, 3.47, 5.00],
  10: [1, 1.50, 2.25, 3.75, 6.25, 12.50],
  5: [1, 2.00, 5.00, 15.00, 50.00, 250.00]
};

export const Mines = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  
  // Mobile Responsive State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Game Configuration States
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(5);
  
  // Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [cells, setCells] = useState<Cell[]>([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Filter States
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<GameFilter>({
    difficulty: 5,
    riskLevel: 'medium',
    theme: 'classic'
  });
  
  // Game Mechanics States
  const [winningChances, setWinningChances] = useState(45);
  const [currentWinPotential, setCurrentWinPotential] = useState(0);

  // Theme Icons Mapping
  const themeIcons = {
    'classic': <Layers />,
    'nature': <Leaf />,
    'tech': <Cpu />,
    'cyberpunk': <Rocket />,
    'adventure': <Mountain />
  };

  // Theme Background Mapping
  const themeBackgrounds = {
    'classic': 'bg-gray-800',
    'nature': 'bg-green-900',
    'tech': 'bg-blue-900',
    'cyberpunk': 'bg-purple-900',
    'adventure': 'bg-orange-900'
  };

  // Risk Level Color Mapping
  const riskLevelColors = {
    'easy': 'bg-green-600',
    'medium': 'bg-yellow-600',
    'hard': 'bg-orange-600',
    'extreme': 'bg-red-600'
  };

  // Add responsive check on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate Total Safe Tiles
  const calculateSafeTiles = (totalCells: number, mineCount: number) => {
    return totalCells - mineCount;
  };

  // Enhanced Multiplier Calculation
  const calculateMultiplier = (safeTiles: number, revealedSafeCells: number) => {
    // Find the correct progression based on total safe tiles
    const progression = MULTIPLIER_PROGRESSION[safeTiles as keyof typeof MULTIPLIER_PROGRESSION];
    
    if (!progression) {
      // Fallback to a default progression if no exact match
      return 1 + (revealedSafeCells * 0.2);
    }

    // Ensure we don't exceed the maximum index
    const index = Math.min(revealedSafeCells, progression.length - 1);
    return progression[index];
  };

  // Enhanced Probability Calculation
  const calculateProbability = (riskLevel: string, revealedSafeCells: number) => {
    const baseChances = {
      'easy': 40,
      'medium': 35,
      'hard': 30,
      'extreme': 20
    };

    const baseChance = baseChances[riskLevel as keyof typeof baseChances];
    const dynamicAdjustment = Math.min(
      20, 
      revealedSafeCells * (riskLevel === 'extreme' ? 2 : 3)
    );

    return Math.max(10, baseChance + dynamicAdjustment);
  };

  // Sophisticated Mine Placement
  const placeMines = (totalCells: number, mineCount: number, riskLevel: string) => {
    const cells: Cell[] = Array(totalCells).fill({ revealed: false, isMine: false });
    
    const bonusCellChance = riskLevel === 'extreme' ? 0.2 : 
                             riskLevel === 'hard' ? 0.15 : 
                             riskLevel === 'medium' ? 0.1 : 0.05;

    let minesToPlace = mineCount;
    while (minesToPlace > 0) {
      const randomIndex = Math.floor(Math.random() * totalCells);
      if (!cells[randomIndex].isMine) {
        const randomType = Math.random();
        
        if (randomType < bonusCellChance) {
          // Bonus cell with special properties
          cells[randomIndex] = { 
            revealed: false, 
            isMine: true, 
            type: 'bonus' 
          };
        } else {
          cells[randomIndex] = { 
            revealed: false, 
            isMine: true, 
            type: 'standard' 
          };
        }
        minesToPlace--;
      }
    }

    return cells;
  };

  // Reset game to initial state
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setMultiplier(1);
    setCells([]);
    setCurrentWinPotential(0);
    setWinningChances(calculateProbability(filters.riskLevel, 0));
    setShowFilters(true);
    setIsMobileMenuOpen(false);
  };

  const initializeGame = () => {
    if (!user || betAmount > (user?.points || 0)) return;

    const totalCells = 25;
    const newCells = placeMines(totalCells, mineCount, filters.riskLevel);
    const safeTiles = calculateSafeTiles(totalCells, mineCount);

    // Slight delay to make game start feel more dynamic
    setTimeout(() => {
      setCells(newCells);
      setGameStarted(true);
      setMultiplier(1);
      setGameOver(false);
      setCurrentWinPotential(betAmount);
      setWinningChances(calculateProbability(filters.riskLevel, 0));
      setShowFilters(false);
      setIsMobileMenuOpen(false);
    }, 300);
  };

  const handleCellClick = async (index: number) => {
    if (!gameStarted || !user || cells[index].revealed) return;

    const newCells = [...cells];
    newCells[index] = { ...newCells[index], revealed: true };

    const totalCells = 25;
    const safeTiles = calculateSafeTiles(totalCells, mineCount);
    const revealedSafeCells = newCells.filter(cell => cell.revealed && !cell.isMine).length;
    
    // Calculate new multiplier based on revealed safe cells
    const newMultiplier = calculateMultiplier(safeTiles, revealedSafeCells);
    setMultiplier(newMultiplier);

    const dynamicWinningChances = calculateProbability(filters.riskLevel, revealedSafeCells);
    setWinningChances(dynamicWinningChances);

    const newWinPotential = Math.floor(betAmount * newMultiplier);
    setCurrentWinPotential(newWinPotential);

    if (newCells[index].isMine) {
      const pointsLost = newCells[index].type === 'bonus' ? betAmount * 2 : betAmount;
      const newPoints = user.points - pointsLost;
      
      await updateUserPoints(user.id, newPoints);
      await sendGameLog({
        userId: user.id,
        username: user.username,
        game: 'Mines',
        result: 'lose',
        betAmount: pointsLost,
        pointsChange: pointsLost,
        finalPoints: newPoints,
        multiplier: newMultiplier
      });
      
      login({ ...user, points: newPoints });
      setGameOver(true);
    } else {
      const revealedCount = newCells.filter(cell => cell.revealed).length;
      
      if (revealedCount === cells.length - mineCount) {
        const winAmount = Math.floor(betAmount * newMultiplier);
        const pointsChange = winAmount;
        const newPoints = user.points + pointsChange;
        
        await updateUserPoints(user.id, newPoints);
        await sendGameLog({
          userId: user.id,
          username: user.username,
          game: 'Mines',
          result: 'win',
          betAmount,
          pointsChange: pointsChange,
          finalPoints: newPoints,
          multiplier: newMultiplier
        });
        
        login({ ...user, points: newPoints });
        setGameOver(true);
      }
    }

    setCells(newCells);
  };

  const handleHalveBet = () => {
    setBetAmount(prev => Math.max(1, Math.floor(prev / 2)));
  };

  const handleDoubleBet = () => {
    setBetAmount(prev => Math.min(prev * 2, user?.points || 0));
  };

  const handleWithdraw = async () => {
    if (!gameStarted || gameOver || !user) return;

    const winAmount = Math.floor(betAmount * multiplier);
    const pointsChange = winAmount - betAmount;
    const newPoints = user.points + pointsChange;
    
    await updateUserPoints(user.id, newPoints);
    await sendGameLog({
      userId: user.id,
      username: user.username,
      game: 'Mines',
      result: 'withdraw',
      betAmount,
      pointsChange: pointsChange,
      finalPoints: newPoints,
      multiplier
    });
    
    login({ ...user, points: newPoints });
    setGameOver(true);
  };

  // Render Filters (can be used for both mobile and desktop)
  const renderFilters = () => (
    <div className="space-y-6 w-full">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Filter className="mr-2" /> Game Filters
      </h3>

      {/* Difficulty Selection */}
      <div>
        <label className="block text-gray-400 mb-2 font-semibold">Difficulty</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { mines: 3, label: 'Easy', safeTiles: 24 }, 
            { mines: 5, label: 'Medium', safeTiles: 22 }, 
            { mines: 7, label: 'Hard', safeTiles: 20 }
          ].map(({mines, label}) => (
            <button
              key={mines}
              onClick={() => {
                setMineCount(mines);
                setFilters(prev => ({ ...prev, difficulty: mines }));
              }}
              disabled={gameStarted && !gameOver}
              className={`
                px-3 py-2 rounded-lg text-sm transition-colors
                ${mineCount === mines 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }
                ${(gameStarted && !gameOver) ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Level */}
      <div>
        <label className="block text-gray-400 mb-2 font-semibold">Risk Level</label>
        <div className="grid grid-cols-2 gap-2">
          {['easy', 'medium', 'hard', 'extreme'].map(level => (
            <button
              key={level}
              onClick={() => setFilters(prev => ({ ...prev, riskLevel: level as any }))}
              disabled={gameStarted && !gameOver}
              className={`
                px-3 py-2 rounded-lg text-sm capitalize transition-colors
                ${filters.riskLevel === level 
                  ? `${riskLevelColors[level as keyof typeof riskLevelColors]} text-white` 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }
                ${(gameStarted && !gameOver) ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <label className="block text-gray-400 mb-2 font-semibold">Theme</label>
        <div className="grid grid-cols-3 gap-2">
          {['classic', 'nature', 'tech', 'cyberpunk', 'adventure'].map(theme => (
            <button
              key={theme}
              onClick={() => setFilters(prev => ({ ...prev, theme: theme as any }))}
              disabled={gameStarted && !gameOver}
              className={`
                px-3 py-2 rounded-lg text-sm capitalize flex items-center justify-center transition-colors
                ${filters.theme === theme 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }
                ${(gameStarted && !gameOver) ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {themeIcons[theme as keyof typeof themeIcons]}
              <span className="ml-2">{theme}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-4 lg:p-6">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center mb-4 px-2">
        <button
          onClick={() => navigate('/play')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Responsive Filter Drawer */}
      {(isMobileMenuOpen || !isMobile) && (
        <div className={`
          ${isMobile ? 'fixed inset-0 z-50 bg-gray-900 p-6 overflow-y-auto' : 'w-full lg:w-[40%] lg:mr-6'}
          bg-gray-800 rounded-lg transition-all duration-300
        `}>
          {renderFilters()}
          
          {isMobile && (
            <div className="mt-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
              >
                Close Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Game Panel */}
      <div className="w-full lg:w-[60%] mt-4 lg:mt-0">
        <div className={`
          ${themeBackgrounds[filters.theme]} 
          p-4 lg:p-8 rounded-lg h-full shadow-2xl transition-colors duration-300
        `}>
          <div className="flex justify-between items-center mb-4 lg:mb-8">
            <button
              onClick={() => navigate('/play')}
              className="hidden lg:flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </button>
            <div className="flex items-center text-yellow-500">
              <Coins className="w-5 h-5 mr-2" />
              <span className="text-lg">{user?.points || 0} Points</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            {themeIcons[filters.theme]}
            <span className="ml-2 capitalize">Mines - {filters.theme} Theme</span>
          </h2>

          {!gameStarted ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 font-semibold">Bet Amount</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="bg-gray-700 text-white rounded px-4 py-2 w-full"
                    min={1}
                    max={user?.points || 0}
                  />
                  <button 
                    onClick={handleHalveBet}
                    className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    ½
                  </button>
                  <button 
                    onClick={handleDoubleBet}
                    className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    2x
                  </button>
                </div>
              </div>

              <button
                onClick={initializeGame}
                disabled={!user || betAmount > (user?.points || 0)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg disabled:opacity-50 transition-colors"
              >
                Start Game
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {cells.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={gameOver || cell.revealed}
                    className={`
                      aspect-square rounded-lg transition-all duration-300 flex items-center justify-center
                      ${cell.revealed
                        ? cell.isMine
                          ? cell.type === 'bonus' 
                            ? 'bg-yellow-500 animate-pulse' 
                            : 'bg-red-500' 
                          : 'bg-green-500'
                        : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                      }
                    `}
                  >
                    {cell.revealed && (
                      cell.isMine ? (
                        cell.type === 'bonus' ? (
                          <Sparkles className="text-white animate-spin" />
                        ) : (
                          <Bomb className="text-white" />
                        )
                      ) : (
                        <Gem className="text-white" />
                      )
                    )}
                  </button>
                ))}
              </div>

              <div className="text-center space-y-4">
                <div className="flex flex-wrap justify-between text-gray-400">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 text-yellow-500" />
                    {/* <p>Chance of Mine: {winningChances.toFixed(0)}%</p> */}
                  </div>
                  <p>Current Multiplier: {multiplier.toFixed(1)}x</p>
                </div>
                
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center text-green-500">
                    <Coins className="mr-2" />
                    <p>Win Potential: {currentWinPotential} Points</p>
                  </div>
                  {!gameOver && (
                    <button
                      onClick={handleWithdraw}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors mt-2 sm:mt-0"
                    >
                      Withdraw
                    </button>
                  )}
                </div>

                {gameOver && (
                  <div className="flex items-center justify-center space-x-2 animate-bounce">
                    {cells.some(cell => cell.revealed && cell.isMine) ? (
                      <>
                        <AlertTriangle className="text-red-500" />
                        <p className="text-lg font-bold text-red-500">
                          Game Over! You lost {
                            cells.find(cell => cell.revealed && cell.isMine)?.type === 'bonus' 
                              ? betAmount * 2 
                              : betAmount
                          } points
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-green-500">
                        You won {Math.floor(betAmount * multiplier)} points!
                      </p>
                    )}
                  </div>
                )}
                
                <button
                  onClick={resetGame}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Play Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};