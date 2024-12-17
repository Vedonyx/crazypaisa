import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { updateUserPoints } from '../../utils/github';
import { calculateWinningProbability } from '../../utils/game';
import { sendGameLog } from '../../utils/discord';
import { ArrowLeft, Coins } from 'lucide-react';
import { Card, GameState } from '../../types/games';
import { createDeck, calculateHandValue } from '../../utils/games/cards';

export const Blackjack = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isOver: false,
    result: null
  });

  const dealCard = (currentDeck: Card[], preferGoodCards: boolean = false): [Card, Card[]] => {
    if (currentDeck.length === 0) {
      throw new Error('Deck is empty');
    }

    if (preferGoodCards && calculateWinningProbability(user?.winningChances || 45)) {
      const goodCards = currentDeck.filter(card => card.numericValue >= 8);
      if (goodCards.length > 0) {
        const cardIndex = Math.floor(Math.random() * goodCards.length);
        const card = goodCards[cardIndex];
        const newDeck = currentDeck.filter(c => c !== card);
        return [card, newDeck];
      }
    }
    
    const card = currentDeck[currentDeck.length - 1];
    const newDeck = currentDeck.slice(0, -1);
    return [card, newDeck];
  };

  const startGame = () => {
    if (!user || betAmount > user.points) return;

    try {
      let currentDeck = createDeck();
      let firstCard: Card, secondCard: Card, dealerCard: Card;

      // Deal first card
      [firstCard, currentDeck] = dealCard(currentDeck, true);
      
      // Deal second card
      [secondCard, currentDeck] = dealCard(currentDeck, true);
      
      // Deal dealer's card
      [dealerCard, currentDeck] = dealCard(currentDeck, false);

      setDeck(currentDeck);
      setPlayerHand([firstCard, secondCard]);
      setDealerHand([dealerCard]);
      setGameState({
        isPlaying: true,
        isOver: false,
        result: null
      });
    } catch (error) {
      console.error('Error starting game:', error);
      // Handle error appropriately
    }
  };

  const hit = () => {
    try {
      const [card, newDeck] = dealCard(deck, true);
      setDeck(newDeck);
      const newHand = [...playerHand, card];
      setPlayerHand(newHand);

      if (calculateHandValue(newHand) > 21) {
        endGame('lose');
      }
    } catch (error) {
      console.error('Error during hit:', error);
      // Reset the game if we encounter an error
      startGame();
    }
  };

  const stand = async () => {
    try {
      let currentDealerHand = [...dealerHand];
      let currentDeck = [...deck];

      while (calculateHandValue(currentDealerHand) < 17 && currentDeck.length > 0) {
        const [card, newDeck] = dealCard(currentDeck, false);
        currentDeck = newDeck;
        currentDealerHand.push(card);
      }

      setDeck(currentDeck);
      setDealerHand(currentDealerHand);

      const playerValue = calculateHandValue(playerHand);
      const dealerValue = calculateHandValue(currentDealerHand);

      if (dealerValue > 21 || playerValue > dealerValue) {
        endGame('win');
      } else if (dealerValue > playerValue) {
        endGame('lose');
      } else {
        endGame('push');
      }
    } catch (error) {
      console.error('Error during stand:', error);
      startGame();
    }
  };

  const endGame = async (result: 'win' | 'lose' | 'push') => {
    if (!user) return;

    let pointsChange = 0;
    let newPoints = user.points;

    if (result === 'win') {
      pointsChange = betAmount;
      newPoints += betAmount;
    } else if (result === 'lose') {
      pointsChange = -betAmount;
      newPoints -= betAmount;
    }

    try {
      await updateUserPoints(user.id, newPoints);
      await sendGameLog({
        userId: user.id,
        username: user.username,
        game: 'Blackjack',
        result,
        betAmount,
        pointsChange: Math.abs(pointsChange),
        finalPoints: newPoints
      });

      login({ ...user, points: newPoints });
      setGameState({
        isPlaying: false,
        isOver: true,
        result
      });
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/play')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Games
        </button>
        <div className="flex items-center text-yellow-500">
          <Coins className="w-5 h-5 mr-2" />
          <span>{user?.points || 0} Points</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Blackjack</h2>

      {!gameState.isPlaying ? (
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="bg-gray-700 text-white rounded px-4 py-2 w-full"
              min={1}
              max={user?.points || 0}
            />
          </div>

          <button
            onClick={startGame}
            disabled={!user || betAmount > (user?.points || 0)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-400 mb-2">
              Dealer's Hand ({calculateHandValue(dealerHand)})
            </h3>
            <div className="flex space-x-2">
              {dealerHand.map((card, index) => (
                <div key={index} className="bg-white text-black p-4 rounded-lg">
                  {card.value}{card.suit}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-400 mb-2">
              Your Hand ({calculateHandValue(playerHand)})
            </h3>
            <div className="flex space-x-2">
              {playerHand.map((card, index) => (
                <div key={index} className="bg-white text-black p-4 rounded-lg">
                  {card.value}{card.suit}
                </div>
              ))}
            </div>
          </div>

          {!gameState.isOver ? (
            <div className="flex space-x-4">
              <button
                onClick={hit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Stand
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className={`text-lg font-bold ${
                gameState.result === 'win' ? 'text-green-500' : 
                gameState.result === 'lose' ? 'text-red-500' : 
                'text-yellow-500'
              }`}>
                {gameState.result === 'win' ? `You won ${betAmount} points!` :
                 gameState.result === 'lose' ? `You lost ${betAmount} points!` :
                 'Push - Bet returned'}
              </p>
              <button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};