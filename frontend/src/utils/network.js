/**
 * Network Utilities
 * Functions for network status, API calls, and connectivity checks
 */

/**
 * Check if online
 */
export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Check network connection quality
 */
export const getNetworkQuality = async () => {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
  }

  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false,
  };
};

/**
 * Measure network speed
 */
export const measureSpeed = async (url, size = 1024) => {
  const startTime = performance.now();
  
  try {
    const response = await fetch(`${url}?size=${size}&t=${Date.now()}`);
    const blob = await response.blob();
    const endTime = performance.now();
    
    const duration = (endTime - startTime) / 1000; // seconds
    const bytes = blob.size;
    const bits = bytes * 8;
    const speedMbps = (bits / duration) / 1000000;
    const speedKbps = (bits / duration) / 1000;
    
    return {
      duration,
      bytes,
      speedMbps,
      speedKbps,
      speedMBps: bytes / duration / 1000000,
    };
  } catch (error) {
    throw new Error(`Speed test failed: ${error.message}`);
  }
};

/**
 * Check if URL is reachable
 */
export const isUrlReachable = async (url, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache',
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Retry a fetch request with exponential backoff
 */
export const fetchWithRetry = async (
  url,
  options = {},
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok && attempt < maxRetries) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Get client IP address (requires external service)
 */
export const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    throw new Error(`Failed to get IP: ${error.message}`);
  }
};

/**
 * Check if request is from mobile device
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get user agent info
 */
export const getUserAgentInfo = () => {
  if (typeof navigator === 'undefined') {
    return {
      browser: 'unknown',
      os: 'unknown',
      device: 'unknown',
      isMobile: false,
    };
  }

  const ua = navigator.userAgent;
  
  // Browser detection
  let browser = 'unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'chrome';
  else if (ua.includes('Firefox')) browser = 'firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'safari';
  else if (ua.includes('Edg')) browser = 'edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'opera';
  
  // OS detection
  let os = 'unknown';
  if (ua.includes('Windows')) os = 'windows';
  else if (ua.includes('Mac')) os = 'macos';
  else if (ua.includes('Linux')) os = 'linux';
  else if (ua.includes('Android')) os = 'android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'ios';
  
  // Device detection
  let device = 'desktop';
  if (isMobileDevice()) {
    if (ua.includes('Tablet') || ua.includes('iPad')) device = 'tablet';
    else device = 'mobile';
  }
  
  return {
    browser,
    os,
    device,
    isMobile: isMobileDevice(),
    userAgent: ua,
  };
};

/**
 * Wait for network to be online
 */
export const waitForOnline = (timeout = 30000) => {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', handleOnline);
      reject(new Error('Network online timeout'));
    }, timeout);

    const handleOnline = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
      resolve(true);
    };

    window.addEventListener('online', handleOnline);
  });
};
// Style improvement
// Performance optimization
// Additional style improvement
// Documentation update
