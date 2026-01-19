import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHistory, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimes, 
  FaExternalLinkAlt,
  FaCopy,
  FaCalendarAlt,
  FaUser,
  FaGift,
  FaShare,
  FaEye,
  FaFlag,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { formatAddress, getTimeAgo, copyToClipboard } from '../utils';

const TransactionHistory = ({ 
  userAddress, 
  maxTransactions = 50,
  className = ""
}) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Transaction types
  const transactionTypes = {
    mint: { label: 'Mint', icon: <FaGift className="text-green-500" />, color: 'text-green-600' },
    transfer: { label: 'Transfer', icon: <FaShare className="text-blue-500" />, color: 'text-blue-600' },
    approve: { label: 'Approve', icon: <FaEye className="text-purple-500" />, color: 'text-purple-600' },
    revoke: { label: 'Revoke', icon: <FaTimes className="text-orange-500" />, color: 'text-orange-600' },
    burn: { label: 'Burn', icon: <FaFlag className="text-red-500" />, color: 'text-red-600' }
  };

  // Load transaction history
  const loadTransactionHistory = async () => {
    if (!userAddress) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would fetch from Stacks API
      // For now, we'll simulate with mock data
      const mockTransactions = generateMockTransactions(userAddress, maxTransactions);
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
      setError('Failed to load transaction history');
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock transaction data
  const generateMockTransactions = (address, count) => {
    const types = Object.keys(transactionTypes);
    const transactions = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000); // Spread over days
      
      transactions.push({
        id: `tx_${i + 1}`,
        type,
        tokenId: Math.floor(Math.random() * 100) + 1,
        from: type === 'mint' ? null : address,
        to: type === 'burn' ? null : (type === 'mint' ? address : 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'),
        timestamp,
        status: Math.random() > 0.1 ? 'success' : 'failed',
        fee: Math.floor(Math.random() * 10000) + 1000,
        explorerUrl: `https://explorer.stacks.co/txid/tx_${i + 1}`,
        metadata: {
          name: `Greeting Card #${Math.floor(Math.random() * 100) + 1}`,
          festival: ['Christmas', 'Birthday', 'New Year', 'Valentine\'s Day'][Math.floor(Math.random() * 4)]
        }
      });
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Filter and search transactions
  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchLower) ||
        tx.metadata.name.toLowerCase().includes(searchLower) ||
        tx.metadata.festival.toLowerCase().includes(searchLower) ||
        (tx.from && tx.from.toLowerCase().includes(searchLower)) ||
        (tx.to && tx.to.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'tokenId':
          return a.tokenId - b.tokenId;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  // Load transactions on mount and when user address changes
  useEffect(() => {
    loadTransactionHistory();
  }, [userAddress, maxTransactions]);

  // Filter transactions when filters change
  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, searchTerm, sortBy]);

  // Handle copy transaction ID
  const handleCopyTxId = async (txId) => {
    const success = await copyToClipboard(txId);
    if (success) {
      toast.success('Transaction ID copied to clipboard!');
    } else {
      toast.error('Failed to copy transaction ID');
    }
  };

  // Handle copy address
  const handleCopyAddress = async (address) => {
    const success = await copyToClipboard(address);
    if (success) {
      toast.success('Address copied to clipboard!');
    } else {
      toast.error('Failed to copy address');
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="text-blue-500 text-3xl animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading transaction history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading History</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTransactionHistory}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userAddress) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Wallet Connected</h3>
          <p className="text-gray-600">Connect your wallet to view transaction history.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FaHistory className="text-white text-xl" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transaction History
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              <span className="font-bold text-purple-600">{filteredTransactions.length}</span> of <span className="font-bold text-gray-800">{transactions.length}</span> transactions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="mb-6 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          <motion.div 
            className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border-2 border-gray-200 shadow-sm"
            whileHover={{ scale: 1.02, borderColor: "#a855f7" }}
          >
            <FaFilter className="text-purple-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border-none focus:ring-0 focus:outline-none bg-transparent font-semibold text-gray-700 cursor-pointer"
            >
              <option value="all">All Types</option>
              {Object.entries(transactionTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
          </motion.div>

          <motion.div 
            className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border-2 border-gray-200 shadow-sm"
            whileHover={{ scale: 1.02, borderColor: "#a855f7" }}
          >
            <span className="text-gray-600 font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border-none focus:ring-0 focus:outline-none bg-transparent font-semibold text-gray-700 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="type">Type</option>
              <option value="tokenId">Token ID</option>
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* Transaction List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                {/* Left side - Type and details */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {transactionTypes[tx.type].icon}
                    <span className={`font-semibold ${transactionTypes[tx.type].color}`}>
                      {transactionTypes[tx.type].label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Token #{tx.tokenId}</span>
                      <span>•</span>
                      <span>{tx.metadata.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{getTimeAgo(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Right side - Status and actions */}
                <div className="flex items-center gap-3">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {tx.status === 'success' ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      tx.status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyTxId(tx.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy Transaction ID"
                    >
                      <FaCopy className="text-sm" />
                    </button>
                    
                    <a
                      href={tx.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View on Explorer"
                    >
                      <FaExternalLinkAlt className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Additional details for specific transaction types */}
              {(tx.from || tx.to) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {tx.from && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">From:</span>
                        <span className="font-mono">{formatAddress(tx.from)}</span>
                        <button
                          onClick={() => handleCopyAddress(tx.from)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FaCopy className="text-xs" />
                        </button>
                      </div>
                    )}
                    
                    {tx.to && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">To:</span>
                        <span className="font-mono">{formatAddress(tx.to)}</span>
                        <button
                          onClick={() => handleCopyAddress(tx.to)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FaCopy className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">
              {transactions.length === 0 
                ? "No transactions found for this address."
                : "No transactions match your current filters."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
// Style improvement 34
// Performance optimization 53
// Refactor improvement 78
// Documentation update 103
// Version 128
