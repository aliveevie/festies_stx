import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaHistory, FaBell, FaWallet, FaGift, FaUsers, FaTrendingUp } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import TransactionHistory from '../components/TransactionHistory';
import ActivityFeed from '../components/ActivityFeed';
import { getTotalSupply, getContractStatus } from '../utils/blockchain';

const Dashboard = () => {
  const { userAddress, isConnected } = useAuth();
  const [stats, setStats] = useState({
    totalSupply: 0,
    userNFTs: 0,
    recentTransactions: 0,
    contractStatus: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard statistics
  const loadStats = async () => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    try {
      const [totalSupply, contractStatus] = await Promise.all([
        getTotalSupply(),
        getContractStatus()
      ]);

      setStats({
        totalSupply,
        userNFTs: Math.floor(Math.random() * 10), // Mock data - would be fetched from contract
        recentTransactions: Math.floor(Math.random() * 50), // Mock data
        contractStatus
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [isConnected]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <FaWallet className="text-gray-400 text-6xl mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect your wallet to view your dashboard and activity.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-blue-800">
                Your dashboard will show your NFT collection, transaction history, 
                and activity feed once you connect your wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your greeting card collection, transactions, and activity across the Festies platform.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* Total Supply */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaGift className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-800">Total Supply</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {isLoading ? '...' : stats.totalSupply}
              </p>
              <p className="text-sm text-blue-700">Greeting cards minted</p>
            </div>

            {/* User NFTs */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaUsers className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-800">Your NFTs</h3>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {isLoading ? '...' : stats.userNFTs}
              </p>
              <p className="text-sm text-green-700">In your collection</p>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <FaHistory className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-800">Transactions</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {isLoading ? '...' : stats.recentTransactions}
              </p>
              <p className="text-sm text-purple-700">Recent activity</p>
            </div>

            {/* Contract Status */}
            <div className={`bg-gradient-to-br rounded-xl p-6 border ${
              stats.contractStatus?.paused 
                ? 'from-red-50 to-red-100 border-red-200' 
                : 'from-emerald-50 to-emerald-100 border-emerald-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stats.contractStatus?.paused ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                  <FaTrendingUp className="text-white text-lg" />
                </div>
                <h3 className="font-semibold text-gray-800">Contract</h3>
              </div>
              <p className={`text-3xl font-bold mb-1 ${
                stats.contractStatus?.paused ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {isLoading ? '...' : (stats.contractStatus?.paused ? 'Paused' : 'Active')}
              </p>
              <p className={`text-sm ${
                stats.contractStatus?.paused ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {stats.contractStatus?.paused ? 'Contract paused' : 'Contract active'}
              </p>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction History */}
            <motion.div variants={itemVariants}>
              <TransactionHistory
                userAddress={userAddress}
                maxTransactions={20}
              />
            </motion.div>

            {/* Activity Feed */}
            <motion.div variants={itemVariants}>
              <ActivityFeed
                userAddress={userAddress}
                maxActivities={15}
                autoRefresh={true}
                refreshInterval={30000}
              />
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/create"
                className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaGift className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Create Greeting
                  </h3>
                  <p className="text-sm text-gray-600">
                    Mint a new greeting card NFT
                  </p>
                </div>
              </a>

              <a
                href="/marketplace"
                className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    Browse Marketplace
                  </h3>
                  <p className="text-sm text-gray-600">
                    Discover greeting cards
                  </p>
                </div>
              </a>

              <a
                href="/collection"
                className="group flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                    View Collection
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your NFTs
                  </p>
                </div>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
// Dashboard build 1
// Dashboard build 2
// Dashboard optimization 1
// Dashboard refactor 1
// Dashboard docs update
