import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaGift, 
  FaSmile, 
  FaRocket, 
  FaCopy, 
  FaExternalLinkAlt, 
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaShare,
  FaFlag,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { copyToClipboard } from '../utils/browser';

const GreetingCard = ({ 
  tokenId, 
  metadata, 
  owner, 
  approvedOperator, 
  onTransfer, 
  onApprove, 
  onRevokeApproval,
  onBurn,
  showActions = true,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Theme mapping based on festival/occasion
  const getThemeIcon = (festival) => {
    const festivalLower = festival?.toLowerCase() || '';
    if (festivalLower.includes('birthday') || festivalLower.includes('bday')) {
      return <FaGift className="text-blue-500 text-2xl" />;
    } else if (festivalLower.includes('christmas') || festivalLower.includes('holiday')) {
      return <FaHeart className="text-red-500 text-2xl" />;
    } else if (festivalLower.includes('achievement') || festivalLower.includes('success')) {
      return <FaRocket className="text-green-500 text-2xl" />;
    } else {
      return <FaSmile className="text-yellow-500 text-2xl" />;
    }
  };

  const getThemeColors = (festival) => {
    const festivalLower = festival?.toLowerCase() || '';
    if (festivalLower.includes('birthday') || festivalLower.includes('bday')) {
      return 'from-blue-400 to-cyan-500';
    } else if (festivalLower.includes('christmas') || festivalLower.includes('holiday')) {
      return 'from-red-400 to-pink-500';
    } else if (festivalLower.includes('achievement') || festivalLower.includes('success')) {
      return 'from-green-400 to-emerald-500';
    } else {
      return 'from-yellow-400 to-orange-500';
    }
  };

  const handleCopyAddress = async (address) => {
    const success = await copyToClipboard(address);
    if (success) {
      toast.success('Address copied to clipboard!');
    } else {
      toast.error('Failed to copy address');
    }
  };

  const handleAction = async (action, ...args) => {
    setIsLoading(true);
    try {
      await action(...args);
    } catch (error) {
      console.error('Action failed:', error);
      toast.error('Action failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (!metadata) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="text-gray-400 text-2xl animate-spin" />
          <span className="ml-2 text-gray-500">Loading NFT...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Header with theme colors */}
      <div className={`h-2 bg-gradient-to-r ${getThemeColors(metadata.festival)}`} />
      
      {/* NFT Image */}
      <div className="relative p-6">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
          {metadata.imageUri && !imageError ? (
            <img
              src={metadata.imageUri}
              alt={`Greeting card for ${metadata.name}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                {getThemeIcon(metadata.festival)}
                <p className="text-gray-500 mt-2 text-sm">No Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Token ID Badge */}
        <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
          #{tokenId}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Festival/Occasion */}
        <div className="flex items-center gap-2 mb-3">
          {getThemeIcon(metadata.festival)}
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {metadata.festival}
          </span>
        </div>

        {/* Recipient Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Dear {metadata.name}
        </h3>

        {/* Message */}
        <div className="mb-4">
          <p className="text-gray-600 leading-relaxed">
            {showFullMessage ? metadata.message : truncateMessage(metadata.message)}
          </p>
          {metadata.message && metadata.message.length > 100 && (
            <button
              onClick={() => setShowFullMessage(!showFullMessage)}
              className="text-blue-500 text-sm mt-1 hover:text-blue-600 transition-colors"
            >
              {showFullMessage ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaUser className="text-gray-400" />
            <span>From: {metadata.sender}</span>
            <button
              onClick={() => handleCopyAddress(metadata.sender)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaCopy className="text-xs" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt className="text-gray-400" />
            <span>Created: {formatDate(metadata.createdAt)}</span>
          </div>

          {owner && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaFlag className="text-gray-400" />
              <span>Owner: {owner}</span>
              <button
                onClick={() => handleCopyAddress(owner)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaCopy className="text-xs" />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction(onTransfer, tokenId)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaShare />}
              Transfer
            </button>

            {approvedOperator ? (
              <button
                onClick={() => handleAction(onRevokeApproval, tokenId)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaEye />}
                Revoke Approval
              </button>
            ) : (
              <button
                onClick={() => handleAction(onApprove, tokenId)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaEye />}
                Approve
              </button>
            )}

            <button
              onClick={() => handleAction(onBurn, tokenId)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : <FaFlag />}
              Burn
            </button>
          </div>
        )}

        {/* External Links */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Token ID: {tokenId}</span>
            <button
              onClick={() => window.open(`https://explorer.stacks.co/txid/${tokenId}`, '_blank')}
              className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <FaExternalLinkAlt className="text-xs" />
              View on Explorer
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GreetingCard;
// Card build 1
// Card build 2
// Card optimization 1
// Card refactor 1
// Card docs update
// Card style update
// Card v1.1.0
// Card cleanup
// Beautiful padding marker 3/300
// Beautiful padding marker 10/300
// Beautiful padding marker 17/300
// Beautiful padding marker 24/300
// Beautiful padding marker 31/300
// Beautiful padding marker 38/300
// Beautiful padding marker 45/300
// Beautiful padding marker 52/300
// Beautiful padding marker 59/300
// Beautiful padding marker 66/300
// Beautiful padding marker 73/300
// Beautiful padding marker 80/300
// Beautiful padding marker 87/300
// Beautiful padding marker 94/300
// Beautiful padding marker 101/300
// Beautiful padding marker 108/300
// Beautiful padding marker 115/300
// Beautiful padding marker 122/300
// Beautiful padding marker 129/300
// Beautiful padding marker 136/300
// Beautiful padding marker 143/300
// Beautiful padding marker 150/300
