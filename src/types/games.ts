export interface Card {
  suit: string;
  value: string;
  numericValue: number;
}

export interface GameResult {
  result: 'win' | 'lose' | 'push';
  pointsChange: number;
  newPoints: number;
}

export interface GameState {
  isPlaying: boolean;
  isOver: boolean;
  result: 'win' | 'lose' | 'push' | null;
}