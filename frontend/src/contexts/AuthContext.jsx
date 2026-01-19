import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getAuthStatus, 
  connectWallet, 
  disconnectWallet, 
  getContractStatus,
  handleBlockchainError 
} from '../utils/blockchain';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contractStatus, setContractStatus] = useState(null);
  const [isContractPaused, setIsContractPaused] = useState(false);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const authStatus = getAuthStatus();
      
      if (authStatus.isSignedIn) {
        setUser(authStatus.userData);
        setIsConnected(true);
        
        // Load contract status
        try {
          const status = await getContractStatus();
          setContractStatus(status);
          setIsContractPaused(status.paused);
        } catch (error) {
          console.error('Failed to load contract status:', error);
        }
      } else {
        setUser(null);
        setIsConnected(false);
        setContractStatus(null);
        setIsContractPaused(false);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      toast.error('Failed to initialize authentication');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect wallet
  const handleConnectWallet = useCallback(async () => {
    try {
      await connectWallet();
      // The wallet connection will trigger a page reload, so we don't need to update state here
    } catch (error) {
      const errorMessage = handleBlockchainError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Disconnect wallet
  const handleDisconnectWallet = useCallback(() => {
    try {
      disconnectWallet();
      // The disconnect will trigger a page reload, so we don't need to update state here
    } catch (error) {
      const errorMessage = handleBlockchainError(error);
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Refresh contract status
  const refreshContractStatus = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      const status = await getContractStatus();
      setContractStatus(status);
      setIsContractPaused(status.paused);
    } catch (error) {
      console.error('Failed to refresh contract status:', error);
      toast.error('Failed to refresh contract status');
    }
  }, [isConnected]);

  // Get user's Stacks address
  const getUserAddress = useCallback(() => {
    if (!user?.profile?.stxAddress) return null;
    return user.profile.stxAddress.mainnet || user.profile.stxAddress.testnet;
  }, [user]);

  // Check if user owns a specific NFT
  const userOwnsNFT = useCallback((ownerAddress) => {
    const userAddress = getUserAddress();
    return userAddress && ownerAddress && userAddress === ownerAddress;
  }, [getUserAddress]);

  // Get user's display name
  const getUserDisplayName = useCallback(() => {
    if (!user?.profile) return 'Anonymous User';
    return user.profile.name || user.profile.username || 'Anonymous User';
  }, [user]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen for storage changes (wallet connect/disconnect)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'stacks-session') {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeAuth]);

  // Listen for focus events to refresh auth state
  useEffect(() => {
    const handleFocus = () => {
      initializeAuth();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [initializeAuth]);

  const value = {
    // State
    user,
    isConnected,
    isLoading,
    contractStatus,
    isContractPaused,
    
    // Actions
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    refreshContractStatus,
    
    // Utilities
    getUserAddress,
    userOwnsNFT,
    getUserDisplayName,
    
    // Computed values
    userAddress: getUserAddress(),
    userDisplayName: getUserDisplayName(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
// Logic phase 21
// Logic phase 22
// Logic phase 23
// Logic phase 24
// Logic phase 25
// Logic phase 26
// Logic phase 27
// Logic phase 28
// Logic phase 29
// Logic phase 30
// Logic phase 31
// Logic phase 32
// Logic phase 33
// Logic phase 34
// Logic phase 35
// Auth build 1
// Auth build 2
// Auth optimization 1
// Auth refactor 1
// Auth docs update
// Auth style update
// Auth v1.1.0
