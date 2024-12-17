export const calculateWinningProbability = (userWinningChances: number): boolean => {
  const randomNumber = Math.random() * 100;
  return randomNumber <= userWinningChances;
};