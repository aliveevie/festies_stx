/**
 * Lightweight mock blockchain helpers to keep the UI usable without a live Stacks backend.
 * All functions mirror the real contract interfaces but operate on local state.
 */

import { openContractCall } from '@stacks/connect';
import { principalCV, stringAsciiCV, uintCV } from '@stacks/transactions';
import {
  connectStacksWallet,
  disconnectStacksWallet,
  isSignedIn,
  isWalletInstalled,
  loadUserData
} from './walletconnect';
import { getEnv, getNetwork } from './environment';
import { getFestiesContractAddress, getFestiesContractName } from '../config/stacks';

const MOCK_SESSION_KEY = 'festies-mock-session';
const STATE_KEY = 'festies-mock-chain';
const DEFAULT_OWNER = 'ST3J2GVMMM2R07ZFBJDWTYEYAR8HX1YY6B7Z4KSB9';
const DEFAULT_ROYALTY_RECIPIENT = 'ST2C2YYX8Z9W8Z4G3V1N2N5T2V1G5Q5C6Z7T5KX5Z';
const DEFAULT_ROYALTY_PERCENTAGE = 5;

const canUseStorage = typeof localStorage !== 'undefined';

const sampleTokens = () => {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      tokenId: 1,
      metadata: {
        name: 'Alex',
        message: 'Thanks for celebrating with me!',
        festival: 'Festival',
        imageUri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
        metadataUri: 'https://festies.example.com/meta/1',
        sender: DEFAULT_OWNER,
        recipient: DEFAULT_OWNER,
        createdAt: now - 86400
      },
      owner: DEFAULT_OWNER,
      approvedOperator: null
    },
    {
      tokenId: 2,
      metadata: {
        name: 'Jordan',
        message: 'Happy Birthday! Wishing you all the joy in the world.',
        festival: 'Birthday',
        imageUri: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
        metadataUri: 'https://festies.example.com/meta/2',
        sender: DEFAULT_OWNER,
        recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        createdAt: now - 432000
      },
      owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      approvedOperator: null
    }
  ];
};

const loadState = () => {
  if (canUseStorage) {
    try {
      const stored = localStorage.getItem(STATE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.warn('Unable to load stored mock chain state:', error);
    }
  }

  const tokens = sampleTokens();
  return {
    tokens,
    lastTokenId: tokens.length,
    owner: DEFAULT_OWNER,
    paused: false,
    royalty: {
      recipient: DEFAULT_ROYALTY_RECIPIENT,
      percentage: DEFAULT_ROYALTY_PERCENTAGE
    }
  };
};

let inMemoryState = loadState();

const persistState = () => {
  if (!canUseStorage) return;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(inMemoryState));
  } catch (error) {
    console.warn('Unable to persist mock chain state:', error);
  }
};

const getState = () => {
  if (!inMemoryState) {
    inMemoryState = loadState();
  }
  return inMemoryState;
};

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatSTX = (amount = 0, decimals = 6) => {
  const numericAmount = Number.isFinite(amount) ? amount : 0;
  const stxAmount = numericAmount / Math.pow(10, decimals);

  return `${stxAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  })} STX`;
};

export const getAuthStatus = () => {
  if (isSignedIn()) {
    return { isSignedIn: true, userData: loadUserData() };
  }

  if (canUseStorage) {
    try {
      const stored = localStorage.getItem(MOCK_SESSION_KEY);
      if (stored) return { isSignedIn: true, userData: JSON.parse(stored) };
    } catch (error) {
      console.warn('Failed to read mock auth session:', error);
    }
  }

  return { isSignedIn: false, userData: null };
};

export const connectWallet = async () => {
  const forceMock = String(getEnv(['VITE_USE_MOCK_WALLET'], 'false')).toLowerCase() === 'true';
  const enableConnect = String(getEnv(['VITE_ENABLE_STACKS_CONNECT'], 'true')).toLowerCase() !== 'false';

  if (!forceMock && enableConnect && isWalletInstalled()) {
    return connectStacksWallet();
  }

  const mockUser = {
    profile: {
      name: 'Festies Demo User',
      username: 'festies-user',
      stxAddress: {
        testnet: 'ST2C2YYX8Z9W8Z4G3V1N2N5T2V1G5Q5C6Z7T5KX5Z',
        mainnet: 'SP2C2YYX8Z9W8Z4G3V1N2N5T2V1G5Q5C6Z7T5KX5Z'
      }
    }
  };

  if (canUseStorage) {
    try {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.warn('Failed to persist wallet session:', error);
    }
  }

  return mockUser;
};

export const disconnectWallet = () => {
  disconnectStacksWallet();

  if (!canUseStorage) return;
  try {
    localStorage.removeItem(MOCK_SESSION_KEY);
  } catch (error) {
    console.warn('Failed to clear mock wallet session:', error);
  }
};

const getActiveAddress = () => {
  const session = getAuthStatus();
  const network = getNetwork();
  const stxAddress = session.userData?.profile?.stxAddress;

  if (!stxAddress) return null;
  if (network === 'mainnet') return stxAddress.mainnet || stxAddress.testnet || null;
  return stxAddress.testnet || stxAddress.mainnet || null;
};

export const handleBlockchainError = (error) => {
  if (!error) return 'Unknown error occurred';

  if (typeof error === 'string') return error;
  if (error?.message) return error.message;

  return 'An unexpected blockchain error occurred';
};

export const getContractInfo = async () => ({
  name: 'Festival Greetings',
  symbol: 'FESTIE',
  version: '2.3.0',
  description:
    'Professional NFT contract for festival greetings with royalty support and advanced features - Updated for Clarity 4'
});

export const getContractStatus = async () => {
  const state = getState();
  return {
    owner: state.owner,
    paused: !!state.paused,
    royaltyPercentage: state.royalty.percentage,
    royaltyRecipient: state.royalty.recipient,
    currentBlockTime: state.lastBlockTime || Math.floor(Date.now() / 1000)
  };
};

export const getRoyaltyInfo = async () => {
  const status = await getContractStatus();
  return {
    recipient: status.royaltyRecipient,
    percentage: status.royaltyPercentage
  };
};

export const calculateRoyalty = async (salePrice) => {
  const info = await getRoyaltyInfo();
  const price = Number.isFinite(salePrice) ? salePrice : 0;
  return Math.floor((price * info.percentage) / 100);
};

export const getTotalSupply = async () => getState().tokens.length;

export const getLastTokenId = async () => getState().lastTokenId || 0;

export const getTokenMetadata = async (tokenId) => {
  const token = getState().tokens.find((t) => t.tokenId === Number(tokenId));
  return token ? token.metadata : null;
};

export const getTokenOwner = async (tokenId) => {
  const token = getState().tokens.find((t) => t.tokenId === Number(tokenId));
  return token ? token.owner : null;
};

export const getApproved = async (tokenId) => {
  const token = getState().tokens.find((t) => t.tokenId === Number(tokenId));
  return token ? token.approvedOperator : null;
};

export const mintGreetingCard = async (greetingData) => {
  const enableContractCalls = String(getEnv(['VITE_ENABLE_CONTRACT_CALLS'], 'false')).toLowerCase() === 'true';
  const contractAddress = getFestiesContractAddress();
  const contractName = getFestiesContractName();

  if (enableContractCalls && contractAddress && contractName && isSignedIn()) {
    const recipient = greetingData.recipientAddress || greetingData.recipient;
    if (!recipient) throw new Error('Recipient address is required');

    const name = String(greetingData.recipientName || greetingData.name || '').trim();
    const message = String(greetingData.message || '').trim();
    const festival = String(greetingData.festival || 'Festival').trim();
    const imageUri = String(greetingData.imageUri || '').trim();
    const metadataUri = String(greetingData.metadataUri || '').trim();

    const txId = await new Promise((resolve, reject) => {
      openContractCall({
        contractAddress,
        contractName,
        functionName: 'mint-greeting-card',
        functionArgs: [
          principalCV(recipient),
          stringAsciiCV(name),
          stringAsciiCV(message),
          stringAsciiCV(festival),
          stringAsciiCV(imageUri),
          stringAsciiCV(metadataUri)
        ],
        appDetails: {
          name: getEnv(['VITE_APP_NAME'], 'Festies'),
          icon: getEnv(['VITE_APP_ICON'], typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '')
        },
        onFinish: (data) => resolve(data.txId),
        onCancel: () => reject(new Error('Transaction cancelled'))
      });
    });

    return { txId };
  }

  const state = getState();
  const nextTokenId = (state.lastTokenId || 0) + 1;
  const sender = getActiveAddress() || greetingData.sender || state.owner;
  const owner = greetingData.recipient || greetingData.recipientAddress || sender;

  const metadata = {
    name: greetingData.name || 'Festies Friend',
    message: greetingData.message || '',
    festival: greetingData.festival || 'Festival',
    imageUri: greetingData.imageUri || '',
    metadataUri: greetingData.metadataUri || '',
    sender,
    recipient: owner,
    createdAt: Math.floor(Date.now() / 1000)
  };

  state.tokens.push({
    tokenId: nextTokenId,
    metadata,
    owner,
    approvedOperator: null
  });

  state.lastTokenId = nextTokenId;
  state.lastBlockTime = Math.floor(Date.now() / 1000);
  persistState();

  return { txId: `mock-tx-${nextTokenId}`, tokenId: nextTokenId };
};

export const waitForTransaction = async (txId) => {
  await delay(700);
  const tokenId = Number((txId || '').replace('mock-tx-', '')) || 0;

  return {
    success: true,
    data: {
      tx_status: 'success',
      tx_id: txId,
      tx_result: {
        value: { value: tokenId }
      }
    }
  };
};

export const transferNFT = async (tokenId, recipient) => {
  const enableContractCalls = String(getEnv(['VITE_ENABLE_CONTRACT_CALLS'], 'false')).toLowerCase() === 'true';
  const contractAddress = getFestiesContractAddress();
  const contractName = getFestiesContractName();

  if (enableContractCalls && contractAddress && contractName && isSignedIn()) {
    const sender = getActiveAddress();
    if (!sender) throw new Error('Wallet not connected');

    const txId = await new Promise((resolve, reject) => {
      openContractCall({
        contractAddress,
        contractName,
        functionName: 'transfer',
        functionArgs: [uintCV(BigInt(tokenId)), principalCV(sender), principalCV(recipient)],
        appDetails: {
          name: getEnv(['VITE_APP_NAME'], 'Festies'),
          icon: getEnv(['VITE_APP_ICON'], typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '')
        },
        onFinish: (data) => resolve(data.txId),
        onCancel: () => reject(new Error('Transaction cancelled'))
      });
    });

    return { txId };
  }

  const state = getState();
  const token = state.tokens.find((t) => t.tokenId === Number(tokenId));

  if (!token) throw new Error('Token not found');
  token.owner = recipient;
  token.approvedOperator = null;
  state.lastBlockTime = Math.floor(Date.now() / 1000);
  persistState();
  return true;
};

export const approveNFT = async (tokenId, operator) => {
  const enableContractCalls = String(getEnv(['VITE_ENABLE_CONTRACT_CALLS'], 'false')).toLowerCase() === 'true';
  const contractAddress = getFestiesContractAddress();
  const contractName = getFestiesContractName();

  if (enableContractCalls && contractAddress && contractName && isSignedIn()) {
    const txId = await new Promise((resolve, reject) => {
      openContractCall({
        contractAddress,
        contractName,
        functionName: 'approve',
        functionArgs: [uintCV(BigInt(tokenId)), principalCV(operator)],
        appDetails: {
          name: getEnv(['VITE_APP_NAME'], 'Festies'),
          icon: getEnv(['VITE_APP_ICON'], typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '')
        },
        onFinish: (data) => resolve(data.txId),
        onCancel: () => reject(new Error('Transaction cancelled'))
      });
    });

    return { txId };
  }

  const state = getState();
  const token = state.tokens.find((t) => t.tokenId === Number(tokenId));

  if (!token) throw new Error('Token not found');
  token.approvedOperator = operator;
  state.lastBlockTime = Math.floor(Date.now() / 1000);
  persistState();
  return true;
};

export const revokeApproval = async (tokenId) => {
  const enableContractCalls = String(getEnv(['VITE_ENABLE_CONTRACT_CALLS'], 'false')).toLowerCase() === 'true';
  const contractAddress = getFestiesContractAddress();
  const contractName = getFestiesContractName();

  if (enableContractCalls && contractAddress && contractName && isSignedIn()) {
    const txId = await new Promise((resolve, reject) => {
      openContractCall({
        contractAddress,
        contractName,
        functionName: 'revoke-approval',
        functionArgs: [uintCV(BigInt(tokenId))],
        appDetails: {
          name: getEnv(['VITE_APP_NAME'], 'Festies'),
          icon: getEnv(['VITE_APP_ICON'], typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '')
        },
        onFinish: (data) => resolve(data.txId),
        onCancel: () => reject(new Error('Transaction cancelled'))
      });
    });

    return { txId };
  }

  const state = getState();
  const token = state.tokens.find((t) => t.tokenId === Number(tokenId));

  if (!token) throw new Error('Token not found');
  token.approvedOperator = null;
  state.lastBlockTime = Math.floor(Date.now() / 1000);
  persistState();
  return true;
};

export const burnNFT = async (tokenId) => {
  const enableContractCalls = String(getEnv(['VITE_ENABLE_CONTRACT_CALLS'], 'false')).toLowerCase() === 'true';
  const contractAddress = getFestiesContractAddress();
  const contractName = getFestiesContractName();

  if (enableContractCalls && contractAddress && contractName && isSignedIn()) {
    const txId = await new Promise((resolve, reject) => {
      openContractCall({
        contractAddress,
        contractName,
        functionName: 'burn-greeting-card',
        functionArgs: [uintCV(BigInt(tokenId))],
        appDetails: {
          name: getEnv(['VITE_APP_NAME'], 'Festies'),
          icon: getEnv(['VITE_APP_ICON'], typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : '')
        },
        onFinish: (data) => resolve(data.txId),
        onCancel: () => reject(new Error('Transaction cancelled'))
      });
    });

    return { txId };
  }

  const state = getState();
  const index = state.tokens.findIndex((t) => t.tokenId === Number(tokenId));

  if (index === -1) throw new Error('Token not found');

  state.tokens.splice(index, 1);
  state.lastBlockTime = Math.floor(Date.now() / 1000);
  persistState();
  return true;
};
// Beautiful padding marker 5/300
// Beautiful padding marker 12/300
// Beautiful padding marker 19/300
// Beautiful padding marker 26/300
// Beautiful padding marker 33/300
// Beautiful padding marker 40/300
// Beautiful padding marker 47/300
// Beautiful padding marker 54/300
// Beautiful padding marker 61/300
// Beautiful padding marker 68/300
// Beautiful padding marker 75/300
// Beautiful padding marker 82/300
