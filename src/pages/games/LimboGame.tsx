import React from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Limbo } from '../../components/games/Limbo';

export const LimboGame = () => {
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full h-full">
        <Limbo />
      </div>
    </div>
  );
};
