import React from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Blackjack } from '../../components/games/Blackjack';

export const BlackjackGame = () => {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Blackjack />
      </div>
    </div>
  );
};