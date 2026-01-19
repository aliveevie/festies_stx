/**
 * ============================================================================
 * Application Constants
 * ============================================================================
 * Centralized constants for the Festies application
 * ============================================================================
 */

// Application metadata
export const APP_NAME = "Festies";
export const APP_VERSION = "2.0.0";
export const APP_DESCRIPTION = "Blockchain Greetings Platform";
export const APP_TAGLINE = "Making festivals unforgettable with personalized blockchain greetings";

// Network configuration
export const NETWORKS = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
  DEVNET: "devnet",
};

// API endpoints
export const API_ENDPOINTS = {
  STACKS_MAINNET: "https://stacks-node-api.mainnet.stacks.co",
  STACKS_TESTNET: "https://stacks-node-api.testnet.stacks.co",
  EXPLORER_MAINNET: "https://explorer.stacks.co",
  EXPLORER_TESTNET: "https://explorer.stacks.co",
};

// Contract addresses (update with actual deployed addresses)
export const CONTRACT_ADDRESSES = {
  FESTIES: "SP...", // Update with actual address
  MARKET_STALL: "SP...", // Update with actual address
};

// Festival types
export const FESTIVAL_TYPES = [
  "Christmas",
  "Birthday",
  "New Year",
  "Valentine's Day",
  "Easter",
  "Halloween",
  "Thanksgiving",
  "Anniversary",
  "Graduation",
  "Wedding",
  "Mother's Day",
  "Father's Day",
  "Independence Day",
  "Labor Day",
  "Memorial Day",
  "Veterans Day",
  "Black Friday",
  "Cyber Monday",
  "Other",
];

// Color themes
export const THEME_COLORS = {
  PRIMARY: "#3b82f6", // Blue
  SECONDARY: "#9333ea", // Purple
  ACCENT: "#ec4899", // Pink
  SUCCESS: "#22c55e", // Green
  WARNING: "#f59e0b", // Amber
  ERROR: "#ef4444", // Red
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Search and filter
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 100,
};

// Toast notifications
export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: "top-right",
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "festies_theme",
  WALLET_ADDRESS: "festies_wallet_address",
  USER_PREFERENCES: "festies_user_preferences",
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue",
  TRANSACTION_FAILED: "Transaction failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_ADDRESS: "Invalid Stacks address",
  INSUFFICIENT_BALANCE: "Insufficient balance",
};

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: "Wallet connected successfully!",
  NFT_MINTED: "Greeting card minted successfully!",
  NFT_TRANSFERRED: "NFT transferred successfully!",
  TRANSACTION_CONFIRMED: "Transaction confirmed!",
};

// Validation rules
export const VALIDATION = {
  NAME_MAX_LENGTH: 40,
  MESSAGE_MAX_LENGTH: 500,
  FESTIVAL_MAX_LENGTH: 100,
  URI_MAX_LENGTH: 500,
};
