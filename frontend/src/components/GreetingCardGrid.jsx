import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaExclamationTriangle, FaRefresh, FaFilter, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import GreetingCard from './GreetingCard';
import AdvancedSearchFilter from './AdvancedSearchFilter';
import { 
  getTotalSupply, 
  getLastTokenId, 
  getTokenMetadata, 
  getTokenOwner, 
  getApproved,
  transferNFT,
  approveNFT,
  revokeApproval,
  burnNFT
} from '../utils/blockchain';
import { searchNFTs, debounceSearch, getFilterStats } from '../utils/search';

const GreetingCardGrid = ({ 
  filterByOwner = null, 
  showActions = true, 
  maxItems = 20,
  className = ""
}) => {
  const [nfts, setNfts] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    festival: '',
    dateRange: '',
    owner: '',
    hasImage: false,
    messageLength: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  });
  const [filterStats, setFilterStats] = useState(null);

  // Load NFTs from blockchain
  const loadNFTs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const totalSupply = await getTotalSupply();
      const lastTokenId = await getLastTokenId();
      
      if (totalSupply === 0) {
        setNfts([]);
        setIsLoading(false);
        return;
      }

      const nftPromises = [];
      const startId = Math.max(1, lastTokenId - maxItems + 1);
      
      for (let tokenId = startId; tokenId <= lastTokenId; tokenId++) {
        nftPromises.push(loadSingleNFT(tokenId));
      }

      const results = await Promise.allSettled(nftPromises);
      const loadedNFTs = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);

      setNfts(loadedNFTs);
      setFilterStats(getFilterStats(loadedNFTs));
    } catch (error) {
      console.error('Failed to load NFTs:', error);
      setError('Failed to load greeting cards');
      toast.error('Failed to load greeting cards');
    } finally {
      setIsLoading(false);
    }
  };

  // Load individual NFT data
  const loadSingleNFT = async (tokenId) => {
    try {
      const [metadata, owner, approvedOperator] = await Promise.all([
        getTokenMetadata(tokenId),
        getTokenOwner(tokenId),
        getApproved(tokenId)
      ]);

      if (!metadata) return null;

      return {
        tokenId,
        metadata,
        owner,
        approvedOperator
      };
    } catch (error) {
      console.error(`Failed to load NFT ${tokenId}:`, error);
      return null;
    }
  };

  // Filter and sort NFTs
  const filteredAndSortedNFTs = nfts
    .filter(nft => {
      // Filter by owner if specified
      if (filterByOwner && nft.owner !== filterByOwner) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          nft.metadata.name.toLowerCase().includes(searchLower) ||
          nft.metadata.message.toLowerCase().includes(searchLower) ||
          nft.metadata.festival.toLowerCase().includes(searchLower)
        );
      }

      // Filter by festival
      if (filters.festival) {
        return nft.metadata.festival.toLowerCase().includes(filters.festival.toLowerCase());
      }

      return true;
    })
    .sort((a, b) => {
      const sortBy = filters.sortBy || 'newest';
      const sortOrder = filters.sortOrder || 'desc';

      switch (sortBy) {
        case 'newest':
          return b.metadata.createdAt - a.metadata.createdAt;
        case 'oldest':
          return a.metadata.createdAt - b.metadata.createdAt;
        case 'name':
          return sortOrder === 'asc'
            ? a.metadata.name.localeCompare(b.metadata.name)
            : b.metadata.name.localeCompare(a.metadata.name);
        case 'festival':
          return sortOrder === 'asc'
            ? a.metadata.festival.localeCompare(b.metadata.festival)
            : b.metadata.festival.localeCompare(a.metadata.festival);
        default:
          return 0;
      }
    });

  // Debounced search function
  const debouncedSearch = debounceSearch((term, filterOptions) => {
    const results = searchNFTs(nfts, term, filterOptions);
    setFilteredNFTs(results);
  }, 300);

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    debouncedSearch(term, filters);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    debouncedSearch(searchTerm, newFilters);
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    const newFilters = { ...filters, sortBy, sortOrder };
    setFilters(newFilters);
    debouncedSearch(searchTerm, newFilters);
  };

  // Load NFTs on component mount
  useEffect(() => {
    loadNFTs();
  }, [filterByOwner, maxItems]);

  // Update filtered NFTs when NFTs change
  useEffect(() => {
    if (nfts.length > 0) {
      const results = searchNFTs(nfts, searchTerm, filters);
      setFilteredNFTs(results);
    }
  }, [nfts, searchTerm, filters]);

  // Handle NFT actions
  const handleTransfer = async (tokenId) => {
    const recipient = prompt('Enter recipient address:');
    if (!recipient) return;
    
    try {
      await transferNFT(tokenId, recipient);
      toast.success('NFT transferred successfully!');
      loadNFTs(); // Reload to update the list
    } catch (error) {
      toast.error('Transfer failed: ' + error.message);
    }
  };

  const handleApprove = async (tokenId) => {
    const operator = prompt('Enter operator address:');
    if (!operator) return;
    
    try {
      await approveNFT(tokenId, operator);
      toast.success('NFT approved successfully!');
      loadNFTs(); // Reload to update the list
    } catch (error) {
      toast.error('Approval failed: ' + error.message);
    }
  };

  const handleRevokeApproval = async (tokenId) => {
    try {
      await revokeApproval(tokenId);
      toast.success('Approval revoked successfully!');
      loadNFTs(); // Reload to update the list
    } catch (error) {
      toast.error('Revoke failed: ' + error.message);
    }
  };

  const handleBurn = async (tokenId) => {
    if (!confirm('Are you sure you want to burn this NFT? This action cannot be undone.')) {
      return;
    }
    
    try {
      await burnNFT(tokenId);
      toast.success('NFT burned successfully!');
      loadNFTs(); // Reload to update the list
    } catch (error) {
      toast.error('Burn failed: ' + error.message);
    }
  };

  // Get unique festivals for filter
  const uniqueFestivals = [...new Set(nfts.map(nft => nft.metadata.festival))];

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="text-blue-500 text-4xl mx-auto mb-4" />
          </motion.div>
          <motion.p 
            className="text-gray-600 text-lg font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading greeting cards...
          </motion.p>
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className={`text-center py-12 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Cards</h3>
        <p className="text-gray-600 mb-6 text-lg">{error}</p>
        <motion.button
          onClick={loadNFTs}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRefresh />
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (filteredAndSortedNFTs.length === 0) {
    return (
      <motion.div 
        className={`text-center py-16 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-8xl mb-6"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎁
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">No Greeting Cards Found</h3>
        <p className="text-gray-600 mb-6 text-lg max-w-md mx-auto">
          {nfts.length === 0 
            ? "No greeting cards have been minted yet. Be the first to create one!"
            : "No cards match your current filters. Try adjusting your search criteria."
          }
        </p>
        {nfts.length > 0 && (
          <motion.button
            onClick={() => {
              setSearchTerm('');
              setFilters((prev) => ({
                ...prev,
                festival: '',
                sortBy: 'newest',
                sortOrder: 'desc'
              }));
            }}
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <div className={className}>
      {/* Advanced Search and Filter */}
      <AdvancedSearchFilter
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        totalResults={filteredNFTs.length}
        className="mb-8"
      />

      {/* Refresh Button */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-sm text-gray-600 font-medium">
          Showing <span className="font-bold text-blue-600">{filteredAndSortedNFTs.length}</span> of <span className="font-bold text-gray-800">{nfts.length}</span> cards
        </div>
        <motion.button
          onClick={loadNFTs}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRefresh />
          Refresh
        </motion.button>
      </motion.div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredNFTs.map((nft) => (
            <motion.div
              key={nft.tokenId}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <GreetingCard
                tokenId={nft.tokenId}
                metadata={nft.metadata}
                owner={nft.owner}
                approvedOperator={nft.approvedOperator}
                onTransfer={handleTransfer}
                onApprove={handleApprove}
                onRevokeApproval={handleRevokeApproval}
                onBurn={handleBurn}
                showActions={showActions}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GreetingCardGrid;
// Grid build 1
// Grid build 2
// Grid optimization 1
// Grid refactor 1
// Grid docs update
// Grid style update
// Grid v1.1.0
// Grid cleanup
// Style improvement 30
