export const GITHUB_CONFIG = {
  token: import.meta.env.VITE_GITHUB_TOKEN,
  configUrl: import.meta.env.VITE_CONFIG_URL,
  transactionsUrl: import.meta.env.VITE_TRANSACTIONS_URL,
} as const;