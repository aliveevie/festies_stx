/**
 * Blockchain integration utilities for Festies NFT Frontend
 * Handles Stacks blockchain interactions, contract calls, and transaction management
 */

import {
  makeContractCall,
  broadcastTransaction,
  callReadOnlyFunction,
  cvToValue,
  standardPrincipalCV,
  contractPrincipalCV,
  uintCV,
  stringAsciiCV,
  someCV,
  noneCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  PostConditionMode,
  TransactionVersion,
  AnchorMode,
  StacksNetwork,
  StacksTestnet,
  StacksMainnet,
} from '@stacks/transactions';
import { AppConfig, UserSession } from '@stacks/connect';

// Contract configuration
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Replace with actual deployed address
const CONTRACT_NAME = 'festies';
const CONTRACT_ID = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;

// Network configuration
const NETWORK_CONFIG = {
  testnet: {
    network: new StacksTestnet(),
    coreApiUrl: 'https://stacks-node-api.testnet.stacks.co',
    explorerUrl: 'https://explorer.stacks.co',
  },
  mainnet: {
    network: new StacksMainnet(),
    coreApiUrl: 'https://stacks-node-api.mainnet.stacks.co',
    explorerUrl: 'https://explorer.stacks.co',
  },
};

// Get current network (default to testnet for development)
const getCurrentNetwork = () => {
  const network = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';
  return NETWORK_CONFIG[network];
};

// Initialize Stacks configuration
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

/**
 * Get user session and authentication status
 */
export const getAuthStatus = () => {
  return {
    isSignedIn: userSession.isUserSignedIn(),
    userData: userSession.isUserSignedIn() ? userSession.loadUserData() : null,
    userSession,
  };
};

/**
 * Validate Stacks address
 */
export const validateAddress = (address) => {
  if (!address) return false;
  // Basic validation for mainnet (SP) or testnet (ST) addresses
  return /^[S][MP][0-9A-Z]{38,39}$/.test(address);
};

/**
 * Connect wallet
 */
export const connectWallet = async () => {
  try {
    const { showConnect } = await import('@stacks/connect');

    await showConnect({
      appDetails: {
        name: 'Festies - Stacks NFT Experience',
        icon: 'https://assets.website-files.com/5f8b9e7o/f3.png', // Placeholder for real logo
      },
      userSession,
      onFinish: () => {
        window.location.reload();
      },
    });
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw new Error('Failed to connect wallet');
  }
};

/**
 * Sign a message for verification
 */
export const signMessage = async (message) => {
  try {
    const { openSignatureRequestPopup } = await import('@stacks/connect');
    const network = getCurrentNetwork();

    return new Promise((resolve, reject) => {
      openSignatureRequestPopup({
        message,
        network: network.network,
        appDetails: {
          name: 'Festies - Stacks NFT Experience',
          icon: 'https://assets.website-files.com/5f8b9e7o/f3.png',
        },
        onFinish: (data) => {
          resolve(data);
        },
        onCancel: () => {
          reject(new Error('Signature request cancelled'));
        },
      });
    });
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw new Error('Failed to sign message');
  }
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = () => {
  userSession.signUserOut();
  window.location.reload();
};

/**
 * Get contract information
 */
export const getContractInfo = async () => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-contract-info',
      functionArgs: [],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get contract info:', error);
    throw new Error('Failed to fetch contract information');
  }
};

/**
 * Get contract status (owner, paused, supply, etc.)
 */
export const getContractStatus = async () => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-contract-status',
      functionArgs: [],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get contract status:', error);
    throw new Error('Failed to fetch contract status');
  }
};

/**
 * Get total supply of NFTs
 */
export const getTotalSupply = async () => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-total-supply',
      functionArgs: [],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get total supply:', error);
    throw new Error('Failed to fetch total supply');
  }
};

/**
 * Get last token ID
 */
export const getLastTokenId = async () => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-last-token-id',
      functionArgs: [],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get last token ID:', error);
    throw new Error('Failed to fetch last token ID');
  }
};

/**
 * Get NFT owner
 */
export const getTokenOwner = async (tokenId) => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-owner',
      functionArgs: [uintCV(tokenId)],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get token owner:', error);
    throw new Error('Failed to fetch token owner');
  }
};

/**
 * Get token metadata
 */
export const getTokenMetadata = async (tokenId) => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-token-metadata',
      functionArgs: [uintCV(tokenId)],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get token metadata:', error);
    throw new Error('Failed to fetch token metadata');
  }
};

/**
 * Get token URI
 */
export const getTokenUri = async (tokenId) => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-token-uri',
      functionArgs: [uintCV(tokenId)],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get token URI:', error);
    throw new Error('Failed to fetch token URI');
  }
};

/**
 * Get greeting card data
 */
export const getGreetingCard = async (tokenId) => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-greeting-card',
      functionArgs: [uintCV(tokenId)],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get greeting card:', error);
    throw new Error('Failed to fetch greeting card data');
  }
};

/**
 * Get royalty information
 */
export const getRoyaltyInfo = async () => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-royalty-info',
      functionArgs: [],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get royalty info:', error);
    throw new Error('Failed to fetch royalty information');
  }
};

/**
 * Calculate royalty amount
 */
export const calculateRoyalty = async (salePrice) => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'calculate-royalty',
      functionArgs: [uintCV(salePrice)],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to calculate royalty:', error);
    throw new Error('Failed to calculate royalty');
  }
};

/**
 * Mint a new greeting card NFT
 */
export const mintGreetingCard = async (greetingData) => {
  try {
    const { isSignedIn, userData } = getAuthStatus();

    if (!isSignedIn) {
      throw new Error('User must be signed in to mint NFTs');
    }

    const network = getCurrentNetwork();
    const senderKey = userData.profile.stxAddress.mainnet;

    const functionArgs = [
      standardPrincipalCV(greetingData.recipient),
      stringAsciiCV(greetingData.name),
      stringAsciiCV(greetingData.message),
      stringAsciiCV(greetingData.festival),
      stringAsciiCV(greetingData.imageUri),
      stringAsciiCV(greetingData.metadataUri),
    ];

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'mint-greeting-card',
      functionArgs,
      network: network.network,
      anchorMode: AnchorMode.Any,
      fee: 10000, // 0.01 STX fee
      onFinish: (data) => {
        console.log('Mint transaction submitted:', data);
      },
      onCancel: () => {
        console.log('Mint transaction cancelled');
      },
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network.network);

    return {
      txId: broadcastResponse.txid,
      explorerUrl: `${network.explorerUrl}/txid/${broadcastResponse.txid}`,
    };
  } catch (error) {
    console.error('Failed to mint greeting card:', error);
    throw new Error('Failed to mint greeting card');
  }
};

/**
 * Transfer NFT to another address
 */
export const transferNFT = async (tokenId, recipient) => {
  try {
    const { isSignedIn, userData } = getAuthStatus();

    if (!isSignedIn) {
      throw new Error('User must be signed in to transfer NFTs');
    }

    const network = getCurrentNetwork();
    const senderKey = userData.profile.stxAddress.mainnet;

    const functionArgs = [
      uintCV(tokenId),
      standardPrincipalCV(senderKey),
      standardPrincipalCV(recipient),
    ];

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'transfer',
      functionArgs,
      network: network.network,
      anchorMode: AnchorMode.Any,
      fee: 5000, // 0.005 STX fee
      onFinish: (data) => {
        console.log('Transfer transaction submitted:', data);
      },
      onCancel: () => {
        console.log('Transfer transaction cancelled');
      },
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network.network);

    return {
      txId: broadcastResponse.txid,
      explorerUrl: `${network.explorerUrl}/txid/${broadcastResponse.txid}`,
    };
  } catch (error) {
    console.error('Failed to transfer NFT:', error);
    throw new Error('Failed to transfer NFT');
  }
};

/**
 * Approve NFT for transfer
 */
export const approveNFT = async (tokenId, operator) => {
  try {
    const { isSignedIn, userData } = getAuthStatus();

    if (!isSignedIn) {
      throw new Error('User must be signed in to approve NFTs');
    }

    const network = getCurrentNetwork();

    const functionArgs = [
      uintCV(tokenId),
      standardPrincipalCV(operator),
    ];

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'approve',
      functionArgs,
      network: network.network,
      anchorMode: AnchorMode.Any,
      fee: 5000, // 0.005 STX fee
      onFinish: (data) => {
        console.log('Approve transaction submitted:', data);
      },
      onCancel: () => {
        console.log('Approve transaction cancelled');
      },
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network.network);

    return {
      txId: broadcastResponse.txid,
      explorerUrl: `${network.explorerUrl}/txid/${broadcastResponse.txid}`,
    };
  } catch (error) {
    console.error('Failed to approve NFT:', error);
    throw new Error('Failed to approve NFT');
  }
};

/**
 * Revoke NFT approval
 */
export const revokeApproval = async (tokenId) => {
  try {
    const { isSignedIn, userData } = getAuthStatus();

    if (!isSignedIn) {
      throw new Error('User must be signed in to revoke approvals');
    }

    const network = getCurrentNetwork();

    const functionArgs = [uintCV(tokenId)];

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'revoke-approval',
      functionArgs,
      network: network.network,
      anchorMode: AnchorMode.Any,
      fee: 5000, // 0.005 STX fee
      onFinish: (data) => {
        console.log('Revoke approval transaction submitted:', data);
      },
      onCancel: () => {
        console.log('Revoke approval transaction cancelled');
      },
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network.network);

    return {
      txId: broadcastResponse.txid,
      explorerUrl: `${network.explorerUrl}/txid/${broadcastResponse.txid}`,
    };
  } catch (error) {
    console.error('Failed to revoke approval:', error);
    throw new Error('Failed to revoke approval');
  }
};

/**
 * Burn NFT
 */
export const burnNFT = async (tokenId) => {
  try {
    const { isSignedIn, userData } = getAuthStatus();

    if (!isSignedIn) {
      throw new Error('User must be signed in to burn NFTs');
    }

    const network = getCurrentNetwork();

    const functionArgs = [uintCV(tokenId)];

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'burn-greeting-card',
      functionArgs,
      network: network.network,
      anchorMode: AnchorMode.Any,
      fee: 5000, // 0.005 STX fee
      onFinish: (data) => {
        console.log('Burn transaction submitted:', data);
      },
      onCancel: () => {
        console.log('Burn transaction cancelled');
      },
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network.network);

    return {
      txId: broadcastResponse.txid,
      explorerUrl: `${network.explorerUrl}/txid/${broadcastResponse.txid}`,
    };
  } catch (error) {
    console.error('Failed to burn NFT:', error);
    throw new Error('Failed to burn NFT');
  }
};

/**
 * Get approved operator for token
 */
export const getApproved = async (tokenId) => {
  try {
    const network = getCurrentNetwork();
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-approved',
      functionArgs: [uintCV(tokenId)],
      network: network.network,
    });

    return cvToValue(result);
  } catch (error) {
    console.error('Failed to get approved operator:', error);
    throw new Error('Failed to fetch approved operator');
  }
};

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (txId, maxAttempts = 30) => {
  try {
    const network = getCurrentNetwork();
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${network.coreApiUrl}/extended/v1/tx/${txId}`);
        const txData = await response.json();

        if (txData.tx_status === 'success') {
          return { success: true, data: txData };
        } else if (txData.tx_status === 'abort_by_response' || txData.tx_status === 'abort_by_post_condition') {
          return { success: false, error: 'Transaction failed', data: txData };
        }

        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    throw new Error('Transaction confirmation timeout');
  } catch (error) {
    console.error('Failed to wait for transaction:', error);
    throw new Error('Failed to confirm transaction');
  }
};

/**
 * Format transaction result for display
 */
export const formatTransactionResult = (result) => {
  return {
    txId: result.txId,
    explorerUrl: result.explorerUrl,
    success: true,
    message: 'Transaction submitted successfully',
  };
};

/**
 * Handle blockchain errors
 */
export const handleBlockchainError = (error) => {
  console.error('Blockchain error:', error);

  if (error.message.includes('insufficient')) {
    return 'Insufficient balance for transaction';
  } else if (error.message.includes('not authorized')) {
    return 'You are not authorized to perform this action';
  } else if (error.message.includes('not found')) {
    return 'Token not found';
  } else if (error.message.includes('paused')) {
    return 'Contract is currently paused';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

export default {
  getAuthStatus,
  connectWallet,
  disconnectWallet,
  getContractInfo,
  getContractStatus,
  getTotalSupply,
  getLastTokenId,
  getTokenOwner,
  getTokenMetadata,
  getTokenUri,
  getGreetingCard,
  getRoyaltyInfo,
  calculateRoyalty,
  mintGreetingCard,
  transferNFT,
  approveNFT,
  revokeApproval,
  burnNFT,
  getApproved,
  waitForTransaction,
  formatTransactionResult,
  handleBlockchainError,
};
