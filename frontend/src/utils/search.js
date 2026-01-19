/**
 * Advanced search and filtering utilities for NFT collections
 * Provides sophisticated search algorithms and filter functions
 */

/**
 * Search NFT by multiple criteria
 * @param {Array} nfts - Array of NFT objects
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered and sorted NFTs
 */
export const searchNFTs = (nfts, searchTerm, filters) => {
  let filteredNFTs = [...nfts];

  // Apply text search
  if (searchTerm) {
    filteredNFTs = filteredNFTs.filter(nft => {
      const searchLower = searchTerm.toLowerCase();
      return (
        nft.metadata.name.toLowerCase().includes(searchLower) ||
        nft.metadata.message.toLowerCase().includes(searchLower) ||
        nft.metadata.festival.toLowerCase().includes(searchLower) ||
        nft.metadata.sender.toLowerCase().includes(searchLower) ||
        (nft.owner && nft.owner.toLowerCase().includes(searchLower))
      );
    });
  }

  // Apply filters
  filteredNFTs = applyFilters(filteredNFTs, filters);

  // Apply sorting
  filteredNFTs = applySorting(filteredNFTs, filters.sortBy, filters.sortOrder);

  return filteredNFTs;
};

/**
 * Apply filters to NFT array
 * @param {Array} nfts - Array of NFT objects
 * @param {Object} filters - Filter options
 * @returns {Array} Filtered NFTs
 */
export const applyFilters = (nfts, filters) => {
  return nfts.filter(nft => {
    // Festival filter
    if (filters.festival && !nft.metadata.festival.toLowerCase().includes(filters.festival.toLowerCase())) {
      return false;
    }

    // Date range filter
    if (filters.dateRange && !isWithinDateRange(nft.metadata.createdAt, filters.dateRange)) {
      return false;
    }

    // Owner filter
    if (filters.owner && nft.owner && !nft.owner.toLowerCase().includes(filters.owner.toLowerCase())) {
      return false;
    }

    // Has image filter
    if (filters.hasImage && (!nft.metadata.imageUri || nft.metadata.imageUri.includes('dicebear'))) {
      return false;
    }

    // Message length filter
    if (filters.messageLength && !isMessageLengthMatch(nft.metadata.message, filters.messageLength)) {
      return false;
    }

    return true;
  });
};

/**
 * Apply sorting to NFT array
 * @param {Array} nfts - Array of NFT objects
 * @param {string} sortBy - Sort criteria
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Array} Sorted NFTs
 */
export const applySorting = (nfts, sortBy, sortOrder = 'desc') => {
  const sortedNFTs = [...nfts].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'newest':
      case 'oldest':
        comparison = a.metadata.createdAt - b.metadata.createdAt;
        break;
      case 'name':
        comparison = a.metadata.name.localeCompare(b.metadata.name);
        break;
      case 'festival':
        comparison = a.metadata.festival.localeCompare(b.metadata.festival);
        break;
      case 'messageLength':
        comparison = a.metadata.message.length - b.metadata.message.length;
        break;
      case 'popular':
        // For now, use creation time as popularity proxy
        comparison = a.metadata.createdAt - b.metadata.createdAt;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sortedNFTs;
};

/**
 * Check if timestamp is within date range
 * @param {number} timestamp - Unix timestamp
 * @param {string} dateRange - Date range string
 * @returns {boolean} True if within range
 */
export const isWithinDateRange = (timestamp, dateRange) => {
  if (!timestamp || !dateRange) return true;

  const now = Date.now();
  const date = new Date(timestamp * 1000);

  switch (dateRange) {
    case 'today':
      const today = new Date();
      return date.toDateString() === today.toDateString();
    
    case 'week':
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    
    case 'month':
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      return date >= monthAgo;
    
    case 'year':
      const yearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);
      return date >= yearAgo;
    
    default:
      return true;
  }
};

/**
 * Check if message length matches filter
 * @param {string} message - Message text
 * @param {string} lengthFilter - Length filter
 * @returns {boolean} True if matches
 */
export const isMessageLengthMatch = (message, lengthFilter) => {
  if (!message || !lengthFilter) return true;

  const length = message.length;

  switch (lengthFilter) {
    case 'short':
      return length >= 1 && length <= 50;
    case 'medium':
      return length >= 51 && length <= 200;
    case 'long':
      return length >= 201 && length <= 500;
    default:
      return true;
  }
};

/**
 * Get search suggestions based on NFT data
 * @param {Array} nfts - Array of NFT objects
 * @param {string} query - Search query
 * @returns {Array} Search suggestions
 */
export const getSearchSuggestions = (nfts, query) => {
  if (!query || query.length < 2) return [];

  const suggestions = new Set();
  const queryLower = query.toLowerCase();

  nfts.forEach(nft => {
    // Add festival suggestions
    if (nft.metadata.festival.toLowerCase().includes(queryLower)) {
      suggestions.add(nft.metadata.festival);
    }

    // Add name suggestions
    if (nft.metadata.name.toLowerCase().includes(queryLower)) {
      suggestions.add(nft.metadata.name);
    }

    // Add sender suggestions
    if (nft.metadata.sender.toLowerCase().includes(queryLower)) {
      suggestions.add(nft.metadata.sender);
    }
  });

  return Array.from(suggestions).slice(0, 10);
};

/**
 * Get filter statistics for NFT collection
 * @param {Array} nfts - Array of NFT objects
 * @returns {Object} Filter statistics
 */
export const getFilterStats = (nfts) => {
  const stats = {
    total: nfts.length,
    festivals: {},
    messageLengths: {
      short: 0,
      medium: 0,
      long: 0
    },
    withImages: 0,
    dateRanges: {
      today: 0,
      week: 0,
      month: 0,
      year: 0
    }
  };

  nfts.forEach(nft => {
    // Festival stats
    const festival = nft.metadata.festival;
    stats.festivals[festival] = (stats.festivals[festival] || 0) + 1;

    // Message length stats
    const messageLength = nft.metadata.message.length;
    if (messageLength <= 50) stats.messageLengths.short++;
    else if (messageLength <= 200) stats.messageLengths.medium++;
    else stats.messageLengths.long++;

    // Image stats
    if (nft.metadata.imageUri && !nft.metadata.imageUri.includes('dicebear')) {
      stats.withImages++;
    }

    // Date range stats
    const now = Date.now();
    const createdAt = nft.metadata.createdAt * 1000;
    
    if (createdAt >= now - 24 * 60 * 60 * 1000) stats.dateRanges.today++;
    if (createdAt >= now - 7 * 24 * 60 * 60 * 1000) stats.dateRanges.week++;
    if (createdAt >= now - 30 * 24 * 60 * 60 * 1000) stats.dateRanges.month++;
    if (createdAt >= now - 365 * 24 * 60 * 60 * 1000) stats.dateRanges.year++;
  });

  return stats;
};

/**
 * Generate search query from filters
 * @param {Object} filters - Filter options
 * @returns {string} Search query string
 */
export const generateSearchQuery = (filters) => {
  const queryParts = [];

  if (filters.festival) queryParts.push(`festival:${filters.festival}`);
  if (filters.owner) queryParts.push(`owner:${filters.owner}`);
  if (filters.dateRange) queryParts.push(`date:${filters.dateRange}`);
  if (filters.messageLength) queryParts.push(`length:${filters.messageLength}`);
  if (filters.hasImage) queryParts.push('has:image');

  return queryParts.join(' ');
};

/**
 * Parse search query into filters
 * @param {string} query - Search query string
 * @returns {Object} Parsed filters
 */
export const parseSearchQuery = (query) => {
  const filters = {};
  
  if (!query) return filters;

  const parts = query.split(' ');
  
  parts.forEach(part => {
    if (part.includes(':')) {
      const [key, value] = part.split(':');
      switch (key) {
        case 'festival':
          filters.festival = value;
          break;
        case 'owner':
          filters.owner = value;
          break;
        case 'date':
          filters.dateRange = value;
          break;
        case 'length':
          filters.messageLength = value;
          break;
        case 'has':
          if (value === 'image') filters.hasImage = true;
          break;
      }
    }
  });

  return filters;
};

/**
 * Debounced search function
 * @param {Function} searchFn - Search function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced search function
 */
export const debounceSearch = (searchFn, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => searchFn(...args), delay);
  };
};

export default {
  searchNFTs,
  applyFilters,
  applySorting,
  isWithinDateRange,
  isMessageLengthMatch,
  getSearchSuggestions,
  getFilterStats,
  generateSearchQuery,
  parseSearchQuery,
  debounceSearch,
};
// Search build 1
// Search build 2
// Search optimization 1
// Search refactor 1
