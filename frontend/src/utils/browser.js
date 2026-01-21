/**
 * Browser Utilities
 * Functions for browser detection, feature detection, and browser-specific operations
 */

/**
 * Get browser name and version
 */
export const getBrowser = () => {
  if (typeof navigator === 'undefined') {
    return { name: 'unknown', version: '0' };
  }

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = '0';

  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    name = 'chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (ua.includes('Firefox')) {
    name = 'firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    name = 'safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (ua.includes('Edg')) {
    name = 'edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (ua.includes('Opera') || ua.includes('OPR')) {
    name = 'opera';
    const match = ua.match(/(?:Opera|OPR)\/(\d+)/);
    version = match ? match[1] : '0';
  }

  return { name, version: parseInt(version, 10) };
};

/**
 * Check if browser supports a feature
 */
export const supportsFeature = (feature) => {
  if (typeof window === 'undefined') return false;

  const features = {
    localStorage: () => {
      try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    },
    sessionStorage: () => {
      try {
        const test = '__sessionStorage_test__';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    },
    geolocation: () => 'geolocation' in navigator,
    notifications: () => 'Notification' in window,
    serviceWorker: () => 'serviceWorker' in navigator,
    webGL: () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    },
    canvas: () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
      } catch {
        return false;
      }
    },
    webAudio: () => 'AudioContext' in window || 'webkitAudioContext' in window,
    fullscreen: () =>
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled,
    clipboard: () => 'clipboard' in navigator,
    share: () => 'share' in navigator,
    intersectionObserver: () => 'IntersectionObserver' in window,
    resizeObserver: () => 'ResizeObserver' in window,
    mutationObserver: () => 'MutationObserver' in window,
    fetch: () => 'fetch' in window,
    promise: () => typeof Promise !== 'undefined',
    async: () => {
      try {
        eval('(async () => {})');
        return true;
      } catch {
        return false;
      }
    },
  };

  const checker = features[feature];
  return checker ? checker() : false;
};

/**
 * Get screen information
 */
export const getScreenInfo = () => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      availWidth: 0,
      availHeight: 0,
      colorDepth: 0,
      pixelDepth: 0,
      orientation: null,
    };
  }

  return {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
    orientation: window.screen.orientation
      ? {
          angle: window.screen.orientation.angle,
          type: window.screen.orientation.type,
        }
      : null,
  };
};

/**
 * Get viewport dimensions
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  if (!supportsFeature('clipboard')) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Read text from clipboard
 */
export const readFromClipboard = async () => {
  if (!supportsFeature('clipboard')) {
    throw new Error('Clipboard API not supported');
  }

  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch {
    throw new Error('Failed to read from clipboard');
  }
};

/**
 * Share content using Web Share API
 */
export const shareContent = async (data) => {
  if (!supportsFeature('share')) {
    throw new Error('Web Share API not supported');
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if (error.name !== 'AbortError') {
      throw error;
    }
    return false;
  }
};

/**
 * Request fullscreen
 */
export const requestFullscreen = (element = document.documentElement) => {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }
  return Promise.reject(new Error('Fullscreen not supported'));
};

/**
 * Exit fullscreen
 */
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    return document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    return document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    return document.msExitFullscreen();
  }
  return Promise.reject(new Error('Fullscreen not supported'));
};

/**
 * Check if in fullscreen
 */
export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

/**
 * Get browser language
 */
export const getBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return 'en';
  
  return (
    navigator.language ||
    navigator.userLanguage ||
    navigator.languages?.[0] ||
    'en'
  );
};

/**
 * Check if browser is in dark mode
 */
export const prefersDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};
// Style improvement
// Refactor improvement
