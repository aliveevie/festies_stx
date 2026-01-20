/**
 * Gallery page - NFT gallery with filters
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Filter, Search } from 'lucide-react';
import { GreetingCard } from '../components/GreetingCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const Gallery = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'popular', 'recent', 'trending', 'featured'];

  const mockNFTs = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Festival Greeting #${i + 1}`,
    message: `This is a beautiful festival greeting card ${i + 1}`,
    festival: ['New Year', 'Christmas', 'Halloween', 'Easter'][i % 4],
    image: `https://picsum.photos/400/400?random=${i + 1}`,
    owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  }));

  const filteredNFTs = mockNFTs.filter((nft) => {
    const matchesSearch =
      searchQuery === '' ||
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            NFT Gallery
          </h1>
          <p className="text-gray-400">
            Browse and discover beautiful festival greeting cards
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search NFTs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`
                      px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                      ${
                        selectedFilter === filter
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      viewMode === 'grid'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${
                      viewMode === 'list'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* NFT Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GreetingCard
                    id={nft.id}
                    name={nft.name}
                    message={nft.message}
                    festival={nft.festival}
                    image={nft.image}
                    owner={nft.owner}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:border-purple-500/50 transition-colors">
                    <div className="flex gap-6">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {nft.name}
                        </h3>
                        <p className="text-gray-400 mb-4">{nft.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Festival: {nft.festival}</span>
                          <span>Owner: {nft.owner.slice(0, 10)}...</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">No NFTs found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
// Style improvement
