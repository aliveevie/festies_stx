import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaFire, FaStar, FaTrendingUp, FaGift } from 'react-icons/fa';
import GreetingCardGrid from '../components/GreetingCardGrid';

const Marketplace = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');

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

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Section */}
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
                            <span className="text-gradient-rainbow">Marketplace</span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            variants={itemVariants}
                        >
                            Discover and collect beautiful greeting cards from our vibrant community. 
                            Each card is a unique piece of art on the blockchain.
                        </motion.p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        variants={itemVariants}
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <FaGift className="text-blue-500 text-2xl" />
                                <span className="text-3xl font-bold text-gray-800">1.2K</span>
                            </div>
                            <p className="text-sm text-gray-600">Total Cards</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <FaFire className="text-orange-500 text-2xl" />
                                <span className="text-3xl font-bold text-gray-800">450</span>
                            </div>
                            <p className="text-sm text-gray-600">Active Listings</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <FaTrendingUp className="text-green-500 text-2xl" />
                                <span className="text-3xl font-bold text-gray-800">89%</span>
                            </div>
                            <p className="text-sm text-gray-600">Volume Up</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <FaStar className="text-yellow-500 text-2xl" />
                                <span className="text-3xl font-bold text-gray-800">4.9</span>
                            </div>
                            <p className="text-sm text-gray-600">Avg Rating</p>
                        </div>
                    </motion.div>

                    {/* Search and Filter Bar */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, festival, or message..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white font-medium"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                </div>
                    </motion.div>

                    {/* Greeting Cards Grid */}
                    <motion.div variants={itemVariants}>
                <GreetingCardGrid
                    showActions={false}
                    maxItems={50}
                />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Marketplace;
// Marketplace build 1
// Marketplace build 2
// Marketplace optimization 1
// Marketplace refactor 1
// Marketplace docs update
// Marketplace style update
// Marketplace v1.1.0
// Marketplace cleanup
// Style improvement 40
// Performance optimization 54
// Refactor improvement 80
