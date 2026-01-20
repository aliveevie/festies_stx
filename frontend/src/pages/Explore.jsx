import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaFire, FaStar, FaClock } from 'react-icons/fa';
import GreetingCardGrid from '../components/GreetingCardGrid';
import Tabs from '../components/Tabs';
import Badge from '../components/Badge';
import StatsCard from '../components/StatsCard';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const tabs = [
    {
      label: 'Trending',
      content: (
        <div>
          <GreetingCardGrid maxItems={24} />
        </div>
      ),
    },
    {
      label: 'Newest',
      content: (
        <div>
          <GreetingCardGrid maxItems={24} />
        </div>
      ),
    },
    {
      label: 'Top Rated',
      content: (
        <div>
          <GreetingCardGrid maxItems={24} />
        </div>
      ),
    },
    {
      label: 'Collections',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Festival Collection</h3>
            <p className="text-gray-600 mb-4">Celebrate special moments</p>
            <Badge variant="purple">120 NFTs</Badge>
          </div>
        </div>
      ),
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: <FaSearch /> },
    { id: 'trending', label: 'Trending', icon: <FaFire /> },
    { id: 'featured', label: 'Featured', icon: <FaStar /> },
    { id: 'recent', label: 'Recent', icon: <FaClock /> },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gradient-rainbow">Explore</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing greeting cards and collections
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total NFTs"
            value="1,234"
            icon={<FaStar className="text-white text-2xl" />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Collections"
            value="45"
            icon={<FaFire className="text-white text-2xl" />}
            gradient="from-purple-500 to-pink-500"
          />
          <StatsCard
            title="Creators"
            value="128"
            icon={<FaSearch className="text-white text-2xl" />}
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Volume"
            value="50K STX"
            icon={<FaClock className="text-white text-2xl" />}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search greeting cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300
                  ${activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.icon}
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab={0} />
      </div>
    </div>
  );
};

export default Explore;
