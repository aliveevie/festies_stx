import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaFire, FaStar, FaTrendingUp, FaGift } from 'react-icons/fa';
import GreetingCardGrid from '../components/GreetingCardGrid';
import StatsCard from '../components/StatsCard';
import { marketplaceStats } from '../data/marketplaceStats';

const Marketplace = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    const sortConfig = useMemo(() => {
        switch (sortBy) {
            case 'oldest':
                return { sortBy: 'oldest', sortOrder: 'asc' };
            case 'name':
                return { sortBy: 'name', sortOrder: 'asc' };
            case 'festival':
                return { sortBy: 'festival', sortOrder: 'asc' };
            case 'message-length':
                return { sortBy: 'messageLength', sortOrder: 'desc' };
            case 'popular':
                return { sortBy: 'popular', sortOrder: 'desc' };
            case 'recent':
            default:
                return { sortBy: 'newest', sortOrder: 'desc' };
        }
    }, [sortBy]);

    const iconMap = {
        gift: <FaGift className="text-white text-2xl" />,
        fire: <FaFire className="text-white text-2xl" />,
        trending: <FaTrendingUp className="text-white text-2xl" />,
        star: <FaStar className="text-white text-2xl" />
    };

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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        variants={itemVariants}
                    >
                        {marketplaceStats.map((stat) => (
                            <StatsCard
                                key={stat.id}
                                title={stat.title}
                                value={stat.value}
                                trend={stat.trend}
                                trendValue={stat.trendValue}
                                icon={iconMap[stat.icon]}
                                gradient={stat.gradient}
                            />
                        ))}
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
                                    <option value="popular">Most Active</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">Name A-Z</option>
                                    <option value="festival">Festival A-Z</option>
                                    <option value="message-length">Longest Messages</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Greeting Cards Grid */}
                    <motion.div variants={itemVariants}>
                        <GreetingCardGrid
                            showActions={false}
                            maxItems={50}
                            externalSearchTerm={searchQuery}
                            showSearch={false}
                            externalSortBy={sortConfig.sortBy}
                            externalSortOrder={sortConfig.sortOrder}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Marketplace;
