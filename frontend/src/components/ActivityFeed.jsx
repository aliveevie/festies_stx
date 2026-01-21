import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBell, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimes, 
  FaGift,
  FaShare,
  FaEye,
  FaFlag,
  FaUser,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaCopy,
  FaRefresh
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { formatAddress } from '../utils/formatters';
import { getTimeAgo } from '../utils/time';
import { copyToClipboard } from '../utils/browser';

const ActivityFeed = ({ 
  userAddress,
  maxActivities = 20,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  className = ""
}) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Activity types
  const activityTypes = {
    mint: { 
      label: 'New Greeting Card Minted', 
      icon: <FaGift className="text-green-500" />, 
      color: 'bg-green-100 text-green-800' 
    },
    transfer: { 
      label: 'Greeting Card Transferred', 
      icon: <FaShare className="text-blue-500" />, 
      color: 'bg-blue-100 text-blue-800' 
    },
    approve: { 
      label: 'Approval Granted', 
      icon: <FaEye className="text-purple-500" />, 
      color: 'bg-purple-100 text-purple-800' 
    },
    revoke: { 
      label: 'Approval Revoked', 
      icon: <FaTimes className="text-orange-500" />, 
      color: 'bg-orange-100 text-orange-800' 
    },
    burn: { 
      label: 'Greeting Card Burned', 
      icon: <FaFlag className="text-red-500" />, 
      color: 'bg-red-100 text-red-800' 
    },
    contract_update: { 
      label: 'Contract Updated', 
      icon: <FaBell className="text-indigo-500" />, 
      color: 'bg-indigo-100 text-indigo-800' 
    }
  };

  // Load activities
  const loadActivities = useCallback(async (showLoading = true) => {
    if (!userAddress) {
      setIsLoading(false);
      return;
    }

    if (showLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    setError(null);

    try {
      // In a real implementation, this would fetch from Stacks API or WebSocket
      const mockActivities = generateMockActivities(userAddress, maxActivities);
      setActivities(mockActivities);
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Failed to load activities:', error);
      setError('Failed to load activity feed');
      if (showLoading) {
        toast.error('Failed to load activity feed');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userAddress, maxActivities]);

  // Generate mock activity data
  const generateMockActivities = (address, count) => {
    const types = Object.keys(activityTypes);
    const activities = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const timestamp = Date.now() - (i * 10 * 60 * 1000); // Spread over hours
      
      activities.push({
        id: `activity_${i + 1}`,
        type,
        tokenId: Math.floor(Math.random() * 100) + 1,
        user: address,
        timestamp,
        status: Math.random() > 0.05 ? 'success' : 'failed',
        metadata: {
          name: `Greeting Card #${Math.floor(Math.random() * 100) + 1}`,
          festival: ['Christmas', 'Birthday', 'New Year', 'Valentine\'s Day'][Math.floor(Math.random() * 4)],
          recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
        },
        txId: `tx_${i + 1}`,
        explorerUrl: `https://explorer.stacks.co/txid/tx_${i + 1}`
      });
    }

    return activities.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Manual refresh
  const handleRefresh = useCallback(() => {
    loadActivities(false);
    toast.success('Activity feed refreshed');
  }, [loadActivities]);

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !userAddress) return;

    const interval = setInterval(() => {
      loadActivities(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, userAddress, loadActivities]);

  // Handle copy transaction ID
  const handleCopyTxId = async (txId) => {
    const success = await copyToClipboard(txId);
    if (success) {
      toast.success('Transaction ID copied to clipboard!');
    } else {
      toast.error('Failed to copy transaction ID');
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="text-blue-500 text-3xl animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading activity feed...</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Feed</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadActivities()}
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
          <FaBell className="text-gray-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Wallet Connected</h3>
          <p className="text-gray-600">Connect your wallet to view activity feed.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FaBell className="text-white text-xl" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Activity Feed
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              <span className="font-bold text-blue-600">{activities.length}</span> recent activities
              {autoRefresh && (
                <motion.span 
                  className="ml-2 text-green-600 font-semibold"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  • Auto-refresh enabled
                </motion.span>
              )}
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          {isRefreshing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="text-blue-500 text-xl" />
            </motion.div>
          )}
          
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isRefreshing ? 1 : 1.05 }}
            whileTap={{ scale: isRefreshing ? 1 : 0.95 }}
          >
            <FaRefresh />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Last refresh indicator */}
      <motion.div 
        className="mb-6 text-xs text-gray-500 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Last updated: <span className="font-semibold">{getTimeAgo(lastRefresh)}</span></span>
        </div>
      </motion.div>

      {/* Activity List */}
      <div className="space-y-4">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4 p-5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              whileHover={{ y: -2 }}
            >
              {/* Activity Icon */}
              <motion.div 
                className="flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${activityTypes[activity.type].color}`}>
                  {activityTypes[activity.type].icon}
                </div>
              </motion.div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800">
                    {activityTypes[activity.type].label}
                  </h4>
                  {activity.status === 'success' ? (
                    <FaCheckCircle className="text-green-500 text-sm" />
                  ) : (
                    <FaTimes className="text-red-500 text-sm" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  Token #{activity.tokenId} • {activity.metadata.name}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{getTimeAgo(activity.timestamp)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <FaUser />
                    <span>{formatAddress(activity.user)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => handleCopyTxId(activity.txId)}
                  className="p-2.5 text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  title="Copy Transaction ID"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaCopy className="text-sm" />
                </motion.button>
                
                <motion.a
                  href={activity.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-gray-400 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 rounded-lg transition-all duration-300"
                  title="View on Explorer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaExternalLinkAlt className="text-sm" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <FaBell className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Recent Activity</h3>
            <p className="text-gray-600">
              No recent activities found for this address.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {activities.length} activities
          </span>
          <span>
            Auto-refresh: {autoRefresh ? 'On' : 'Off'}
          </span>
        </div>
      </div>
	    </motion.div>
	  );
	};
	
export default ActivityFeed;
