/**
 * NFT Metadata validation and IPFS integration utilities
 * Handles metadata validation, IPFS uploads, and content verification
 */

import { toast } from 'react-hot-toast';

// IPFS Configuration
const IPFS_CONFIG = {
  gateway: 'https://ipfs.io/ipfs/',
  pinata: {
    apiKey: process.env.REACT_APP_PINATA_API_KEY,
    secretKey: process.env.REACT_APP_PINATA_SECRET_KEY,
    gateway: 'https://gateway.pinata.cloud/ipfs/',
  },
  web3Storage: {
    token: process.env.REACT_APP_WEB3STORAGE_TOKEN,
    gateway: 'https://w3s.link/ipfs/',
  }
};

/**
 * Validate NFT metadata structure
 * @param {Object} metadata - Metadata object to validate
 * @returns {Object} Validation result with success boolean and errors array
 */
export const validateMetadata = (metadata) => {
  const errors = [];
  
  if (!metadata) {
    errors.push('Metadata is required');
    return { success: false, errors };
  }

  // Required fields validation
  const requiredFields = ['name', 'message', 'festival', 'imageUri', 'metadataUri'];
  requiredFields.forEach(field => {
    if (!metadata[field] || metadata[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  // Field length validation
  if (metadata.name && metadata.name.length > 40) {
    errors.push('Name must be 40 characters or less');
  }

  if (metadata.message && metadata.message.length > 500) {
    errors.push('Message must be 500 characters or less');
  }

  if (metadata.festival && metadata.festival.length > 100) {
    errors.push('Festival must be 100 characters or less');
  }

  // URI validation
  if (metadata.imageUri && !isValidUri(metadata.imageUri)) {
    errors.push('Invalid image URI format');
  }

  if (metadata.metadataUri && !isValidUri(metadata.metadataUri)) {
    errors.push('Invalid metadata URI format');
  }

  return {
    success: errors.length === 0,
    errors
  };
};

/**
 * Validate URI format
 * @param {string} uri - URI to validate
 * @returns {boolean} True if valid URI
 */
export const isValidUri = (uri) => {
  if (!uri || typeof uri !== 'string') return false;
  
  try {
    const url = new URL(uri);
    return ['http:', 'https:', 'ipfs:'].includes(url.protocol);
  } catch {
    return false;
  }
};

/**
 * Generate metadata JSON for NFT
 * @param {Object} greetingData - Greeting card data
 * @returns {Object} Formatted metadata object
 */
export const generateMetadata = (greetingData) => {
  const metadata = {
    name: greetingData.name,
    description: `A heartfelt greeting card for ${greetingData.name} during ${greetingData.festival}`,
    image: greetingData.imageUri,
    external_url: greetingData.metadataUri,
    attributes: [
      {
        trait_type: "Festival",
        value: greetingData.festival
      },
      {
        trait_type: "Recipient",
        value: greetingData.name
      },
      {
        trait_type: "Sender",
        value: greetingData.sender || "Anonymous"
      },
      {
        trait_type: "Created At",
        value: new Date().toISOString()
      },
      {
        trait_type: "Message Length",
        value: greetingData.message.length
      }
    ],
    properties: {
      festival: greetingData.festival,
      recipient: greetingData.name,
      message: greetingData.message,
      sender: greetingData.sender || "Anonymous",
      createdAt: greetingData.createdAt || Date.now(),
      imageUri: greetingData.imageUri,
      metadataUri: greetingData.metadataUri
    }
  };

  return metadata;
};

/**
 * Upload metadata to IPFS using Pinata
 * @param {Object} metadata - Metadata object to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    if (!IPFS_CONFIG.pinata.apiKey || !IPFS_CONFIG.pinata.secretKey) {
      throw new Error('Pinata API credentials not configured');
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': IPFS_CONFIG.pinata.apiKey,
        'pinata_secret_api_key': IPFS_CONFIG.pinata.secretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `festies-metadata-${Date.now()}`,
        },
        pinataOptions: {
          cidVersion: 1,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Failed to upload metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

/**
 * Upload image to IPFS using Pinata
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadImageToIPFS = async (imageFile) => {
  try {
    if (!IPFS_CONFIG.pinata.apiKey || !IPFS_CONFIG.pinata.secretKey) {
      throw new Error('Pinata API credentials not configured');
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    
    const metadata = JSON.stringify({
      name: `festies-image-${Date.now()}`,
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': IPFS_CONFIG.pinata.apiKey,
        'pinata_secret_api_key': IPFS_CONFIG.pinata.secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Failed to upload image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
};

/**
 * Generate IPFS URI from hash
 * @param {string} hash - IPFS hash
 * @param {string} gateway - IPFS gateway (optional)
 * @returns {string} IPFS URI
 */
export const generateIPFSUri = (hash, gateway = IPFS_CONFIG.gateway) => {
  if (!hash) return '';
  return `${gateway}${hash}`;
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('Image file is required');
    return { success: false, errors };
  }

  // File type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Image must be JPEG, PNG, GIF, or WebP format');
  }

  // File size validation (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push('Image size must be less than 5MB');
  }

  return {
    success: errors.length === 0,
    errors
  };
};

/**
 * Generate placeholder image URI
 * @param {string} name - Name to use in placeholder
 * @param {string} festival - Festival type
 * @returns {string} Placeholder image URI
 */
export const generatePlaceholderImage = (name, festival) => {
  const festivalEmojis = {
    'christmas': '🎄',
    'birthday': '🎂',
    'new year': '🎊',
    'valentine': '💕',
    'easter': '🐰',
    'halloween': '🎃',
    'thanksgiving': '🦃',
    'default': '🎁'
  };

  const emoji = festivalEmojis[festival.toLowerCase()] || festivalEmojis.default;
  const encodedName = encodeURIComponent(name);
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&eyes=happy&mouth=smile`;
};

/**
 * Process and prepare greeting data for minting
 * @param {Object} formData - Form data from CreateGreeting component
 * @param {string} senderAddress - Sender's Stacks address
 * @returns {Promise<Object>} Processed greeting data ready for minting
 */
export const processGreetingData = async (formData, senderAddress) => {
  try {
    // Generate image URI if not provided
    let imageUri = formData.imageUri;
    if (!imageUri) {
      imageUri = generatePlaceholderImage(formData.recipientName, formData.festival);
    }

    // Generate metadata
    const metadata = generateMetadata({
      name: formData.recipientName,
      message: formData.message,
      festival: formData.festival,
      sender: senderAddress,
      imageUri,
      createdAt: Date.now()
    });

    // Validate metadata
    const validation = validateMetadata({
      name: formData.recipientName,
      message: formData.message,
      festival: formData.festival,
      imageUri,
      metadataUri: formData.metadataUri || ''
    });

    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Upload metadata to IPFS if configured
    let metadataUri = formData.metadataUri;
    if (!metadataUri && IPFS_CONFIG.pinata.apiKey) {
      try {
        const ipfsHash = await uploadMetadataToIPFS(metadata);
        metadataUri = generateIPFSUri(ipfsHash);
      } catch (error) {
        console.warn('Failed to upload metadata to IPFS, using fallback:', error);
        metadataUri = `https://festies-metadata.com/${Date.now()}`;
      }
    } else if (!metadataUri) {
      metadataUri = `https://festies-metadata.com/${Date.now()}`;
    }

    return {
      recipient: formData.recipientAddress,
      name: formData.recipientName,
      message: formData.message,
      festival: formData.festival,
      imageUri,
      metadataUri
    };
  } catch (error) {
    console.error('Failed to process greeting data:', error);
    throw error;
  }
};

/**
 * Verify IPFS content accessibility
 * @param {string} ipfsUri - IPFS URI to verify
 * @returns {Promise<boolean>} True if content is accessible
 */
export const verifyIPFSContent = async (ipfsUri) => {
  try {
    const response = await fetch(ipfsUri, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get IPFS content with fallback
 * @param {string} ipfsUri - Primary IPFS URI
 * @param {string} fallbackUri - Fallback URI
 * @returns {Promise<string>} Accessible URI
 */
export const getIPFSContentWithFallback = async (ipfsUri, fallbackUri) => {
  try {
    const isAccessible = await verifyIPFSContent(ipfsUri);
    return isAccessible ? ipfsUri : fallbackUri;
  } catch {
    return fallbackUri;
  }
};

export default {
  validateMetadata,
  isValidUri,
  generateMetadata,
  uploadMetadataToIPFS,
  uploadImageToIPFS,
  generateIPFSUri,
  validateImageFile,
  generatePlaceholderImage,
  processGreetingData,
  verifyIPFSContent,
  getIPFSContentWithFallback,
};
// Metadata build 1
// Metadata build 2
// Metadata optimization 1
// Metadata refactor 1
// Metadata docs update
