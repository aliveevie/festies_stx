/**
 * ============================================================================
 * Analytics Service
 * ============================================================================
 * Service for tracking user analytics and events
 * ============================================================================
 */

/**
 * Track a page view
 * @param {string} page - Page name
 * @param {object} metadata - Additional metadata
 */
export const trackPageView = (page, metadata = {}) => {
  if (typeof window === 'undefined') return;
  
  const event = {
    type: 'page_view',
    page,
    timestamp: Date.now(),
    ...metadata,
  };
  
  // Store in localStorage for later sync
  const events = JSON.parse(localStorage.getItem('festies_analytics') || '[]');
  events.push(event);
  localStorage.setItem('festies_analytics', JSON.stringify(events.slice(-100))); // Keep last 100 events
  
  // Send to analytics service (if configured)
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: page,
      ...metadata,
    });
  }
};

/**
 * Track a custom event
 * @param {string} eventName - Event name
 * @param {object} properties - Event properties
 */
export const trackEvent = (eventName, properties = {}) => {
  if (typeof window === 'undefined') return;
  
  const event = {
    type: 'custom_event',
    event_name: eventName,
    timestamp: Date.now(),
    ...properties,
  };
  
  // Store in localStorage
  const events = JSON.parse(localStorage.getItem('festies_analytics') || '[]');
  events.push(event);
  localStorage.setItem('festies_analytics', JSON.stringify(events.slice(-100)));
  
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  console.log('Analytics Event:', eventName, properties);
};

/**
 * Track NFT mint
 * @param {string} tokenId - Token ID
 * @param {object} metadata - NFT metadata
 */
export const trackMint = (tokenId, metadata = {}) => {
  trackEvent('nft_mint', {
    token_id: tokenId,
    ...metadata,
  });
};

/**
 * Track NFT transfer
 * @param {string} tokenId - Token ID
 * @param {string} from - Sender address
 * @param {string} to - Recipient address
 */
export const trackTransfer = (tokenId, from, to) => {
  trackEvent('nft_transfer', {
    token_id: tokenId,
    from,
    to,
  });
};

/**
 * Track wallet connection
 * @param {string} address - Wallet address
 */
export const trackWalletConnect = (address) => {
  trackEvent('wallet_connect', {
    address: address.substring(0, 8) + '...', // Partial address for privacy
  });
};

/**
 * Track search query
 * @param {string} query - Search query
 * @param {number} results - Number of results
 */
export const trackSearch = (query, results = 0) => {
  trackEvent('search', {
    query,
    results,
  });
};

/**
 * Get analytics data
 * @returns {Array} - Array of analytics events
 */
export const getAnalyticsData = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('festies_analytics') || '[]');
};

/**
 * Clear analytics data
 */
export const clearAnalytics = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('festies_analytics');
};
