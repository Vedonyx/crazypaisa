export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  points: number;
  winningChances: number;
  referralCode?: string;
  peopleReferKey?: string;
  referredBy?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  transactionId: string;
  timestamp: string;
  status: 'pending' | 'completed';
}