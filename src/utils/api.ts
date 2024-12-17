import { getUserData, createUser, saveTransaction, getReferralStats } from './github';
import { User, Transaction } from '../types';

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<User | null> => {
      return await getUserData(username, password);
    },
    register: async (userData: Omit<User, 'id' | 'points' | 'peopleReferKey'>): Promise<User> => {
      return await createUser(userData);
    }
  },
  transactions: {
    create: async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
      return await saveTransaction(transaction);
    }
  },
  referrals: {
    getStats: async (referralKey: string) => {
      return await getReferralStats(referralKey);
    }
  }
};