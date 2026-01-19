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
        <div className="text-center">
          <FaSpinner className="text-blue-500 text-3xl animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading greeting cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Cards</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadNFTs}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
        >
          <FaRefresh />
          Try Again
        </button>
      </div>
    );
  }

  if (filteredAndSortedNFTs.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🎁</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Greeting Cards Found</h3>
        <p className="text-gray-600 mb-4">
          {nfts.length === 0 
            ? "No greeting cards have been minted yet. Be the first to create one!"
            : "No cards match your current filters. Try adjusting your search criteria."
          }
        </p>
        {nfts.length > 0 && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters((prev) => ({
                ...prev,
                festival: '',
                sortBy: 'newest',
                sortOrder: 'desc'
              }));
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
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
      <div className="flex justify-end mb-6">
        <button
          onClick={loadNFTs}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FaRefresh />
          Refresh
        </button>
      </div>

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
