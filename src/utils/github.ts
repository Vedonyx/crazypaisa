import { User, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const CONFIG_URL = import.meta.env.VITE_CONFIG_URL;
const TRANSACTIONS_URL = import.meta.env.VITE_TRANSACTIONS_URL;

interface GitHubResponse {
  content: string;
  sha: string;
}

// Helper function to encode string to base64
function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

// Helper function to decode base64 to string
function decodeBase64(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

async function getFileContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch file content');
    }

    const data: GitHubResponse = await response.json();
    const content = JSON.parse(decodeBase64(data.content));
    return { content, sha: data.sha };
  } catch (error) {
    console.error('Error fetching file content:', error);
    return { content: { users: [], transactions: [] }, sha: '' };
  }
}

async function updateFileContent(url: string, content: any, sha: string) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: 'Update file content',
      content: encodeBase64(JSON.stringify(content, null, 2)),
      sha: sha || undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('GitHub API Error:', errorData);
    throw new Error('Failed to update file content');
  }
}

// User Management Functions
export async function getUserData(username: string, password: string): Promise<User | null> {
  const { content } = await getFileContent(CONFIG_URL);
  const users: User[] = content.users || [];
  return users.find(user => user.username === username && user.password === password) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'points' | 'peopleReferKey'>): Promise<User> {
  const { content, sha } = await getFileContent(CONFIG_URL);
  const users: User[] = content.users || [];

  // Check if username already exists
  if (users.some(user => user.username === userData.username)) {
    throw new Error('Username already exists');
  }

  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already exists');
  }

  const newUser: User = {
    id: uuidv4(),
    points: 5, // Initial points
    peopleReferKey: uuidv4(), // Generate referral key
    ...userData,
  };

  // Handle referral bonus
  if (userData.referralCode) {
    const referrer = users.find(user => user.peopleReferKey === userData.referralCode);
    if (referrer) {
      newUser.referredBy = referrer.id;
    }
  }

  users.push(newUser);
  await updateFileContent(CONFIG_URL, { users }, sha);
  return newUser;
}

export async function updateUserPoints(userId: string, newPoints: number): Promise<void> {
  const { content, sha } = await getFileContent(CONFIG_URL);
  const users: User[] = content.users;
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  users[userIndex].points = newPoints;

  // Check if this user was referred and reached 100 points
  if (users[userIndex].referredBy && newPoints >= 100) {
    const referrer = users.find(user => user.id === users[userIndex].referredBy);
    if (referrer && !users[userIndex].referralPaid) {
      const referrerIndex = users.findIndex(user => user.id === referrer.id);
      users[referrerIndex].points += 5; // Add bonus points to referrer
      users[userIndex].referralPaid = true; // Mark referral as paid
    }
  }

  await updateFileContent(CONFIG_URL, { users }, sha);
}

// Transaction Management
export async function saveTransaction(transaction: Omit<Transaction, 'id'>): Promise<void> {
  const { content, sha } = await getFileContent(TRANSACTIONS_URL);
  const transactions: Transaction[] = content.transactions || [];

  const newTransaction: Transaction = {
    ...transaction,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  transactions.push(newTransaction);
  await updateFileContent(TRANSACTIONS_URL, { transactions }, sha);
}

// Referral Management
export async function getReferralStats(referralKey: string) {
  const { content } = await getFileContent(CONFIG_URL);
  const users: User[] = content.users || [];
  
  const referredUsers = users
    .filter(user => user.referredBy === referralKey)
    .map(user => ({
      username: user.username,
      points: user.points,
      paid: user.referralPaid || false,
    }));

  return {
    totalReferrals: referredUsers.length,
    paidReferrals: referredUsers.filter(user => user.paid).length,
    pendingReferrals: referredUsers.filter(user => !user.paid).length,
    referredUsers,
  };
}

// Update user's winning chances
export async function updateUserWinningChances(userId: string, newChances: number): Promise<void> {
  const { content, sha } = await getFileContent(CONFIG_URL);
  const users: User[] = content.users;
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  users[userIndex].winningChances = newChances;
  await updateFileContent(CONFIG_URL, { users }, sha);
}