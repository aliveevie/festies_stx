import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaGift, FaChartLine, FaCog, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import GreetingCardGrid from '../components/GreetingCardGrid';
import ConnectWalletButton from '../components/ConnectWalletButton';

const Collection = () => {
    const { isConnected, userAddress } = useAuth();
    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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
            <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8"
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaWallet className="text-white text-4xl" />
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                            <span className="text-gradient-rainbow">My Collection</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Connect your wallet to view and manage your greeting card collection. 
                            See all your NFTs in one place.
                        </p>
                        <ConnectWalletButton className="mx-auto" />
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header Section */}
                    <motion.div 
                        className="text-center mb-12"
                        variants={itemVariants}
                    >
                        <motion.h1 
                            className="text-5xl md:text-7xl font-extrabold mb-6"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-gradient-rainbow">My Collection</span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            variants={itemVariants}
                        >
                            View and manage your greeting cards. Transfer, approve, or burn your NFTs.
                        </motion.p>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        variants={itemVariants}
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaGift className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">0</p>
                                    <p className="text-blue-100 text-sm">Total Cards</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaChartLine className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">0</p>
                                    <p className="text-purple-100 text-sm">Total Value</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaCog className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold">Active</p>
                                    <p className="text-green-100 text-sm">Status</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filter and View Controls */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <FaFilter className="text-gray-400" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white font-medium"
                                >
                                    <option value="all">All Cards</option>
                                    <option value="recent">Recently Added</option>
                                    <option value="favorites">Favorites</option>
                                    <option value="by-festival">By Festival</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        viewMode === 'grid' 
                                            ? 'bg-white shadow-md text-blue-600' 
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        viewMode === 'list' 
                                            ? 'bg-white shadow-md text-blue-600' 
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Collection Grid */}
                    <motion.div variants={itemVariants}>
                        <GreetingCardGrid
                            showActions={true}
                            maxItems={100}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Collection;
// Style improvement 39
// Performance optimization 62
// Refactor improvement 81
// Documentation update 106
// Version 131
// Final polish 156
// Release prep 181
