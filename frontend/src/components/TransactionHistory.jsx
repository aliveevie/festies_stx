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
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <FaHistory className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
          <p className="text-sm text-gray-600">
            {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(transactionTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="type">Type</option>
              <option value="tokenId">Token ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
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
