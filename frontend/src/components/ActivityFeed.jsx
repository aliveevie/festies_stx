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
import { formatAddress, getTimeAgo, copyToClipboard } from '../utils';

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
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <FaBell className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Activity Feed</h3>
            <p className="text-sm text-gray-600">
              {activities.length} recent activities
              {autoRefresh && (
                <span className="ml-2 text-blue-600">
                  • Auto-refresh enabled
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRefreshing && (
            <FaSpinner className="text-blue-500 animate-spin" />
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <FaRefresh />
            Refresh
          </button>
        </div>
      </div>

      {/* Last refresh indicator */}
      <div className="mb-4 text-xs text-gray-500">
        Last updated: {getTimeAgo(lastRefresh)}
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              {/* Activity Icon */}
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activityTypes[activity.type].color}`}>
                  {activityTypes[activity.type].icon}
                </div>
              </div>

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
                <button
                  onClick={() => handleCopyTxId(activity.txId)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy Transaction ID"
                >
                  <FaCopy className="text-sm" />
                </button>
                
                <a
                  href={activity.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View on Explorer"
                >
                  <FaExternalLinkAlt className="text-sm" />
                </a>
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
    </div>
  );
};

export default ActivityFeed;
// Activity build 1
