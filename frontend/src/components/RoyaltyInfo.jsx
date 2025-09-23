import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPercentage, FaUser, FaInfoCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getRoyaltyInfo, calculateRoyalty, formatSTX } from '../utils/blockchain';

const RoyaltyInfo = ({ salePrice = 0, className = "" }) => {
  const [royaltyInfo, setRoyaltyInfo] = useState(null);
  const [calculatedRoyalty, setCalculatedRoyalty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load royalty information
  const loadRoyaltyInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await getRoyaltyInfo();
      setRoyaltyInfo(info);
      
      if (salePrice > 0) {
        const royalty = await calculateRoyalty(salePrice);
        setCalculatedRoyalty(royalty);
      }
    } catch (error) {
      console.error('Failed to load royalty info:', error);
      setError('Failed to load royalty information');
      toast.error('Failed to load royalty information');
    } finally {
      setIsLoading(false);
    }
  };

  // Load royalty info on component mount
  useEffect(() => {
    loadRoyaltyInfo();
  }, [salePrice]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <FaSpinner className="text-blue-500 text-2xl animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading royalty information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-2xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Royalty Info</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRoyaltyInfo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!royaltyInfo) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <FaInfoCircle className="text-gray-400 text-2xl mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Royalty Information</h3>
          <p className="text-gray-600">Royalty information is not available for this contract.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <FaPercentage className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Royalty Information</h3>
          <p className="text-gray-600">Creator earnings from secondary sales</p>
        </div>
      </div>

      {/* Royalty Details */}
      <div className="space-y-4">
        {/* Percentage */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FaPercentage className="text-purple-500" />
            <span className="font-semibold text-gray-700">Royalty Rate</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {royaltyInfo.percentage}%
          </span>
        </div>

        {/* Recipient */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FaUser className="text-blue-500" />
            <span className="font-semibold text-gray-700">Recipient</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-gray-600 break-all">
              {royaltyInfo.recipient}
            </p>
          </div>
        </div>

        {/* Calculated Royalty (if sale price provided) */}
        {salePrice > 0 && calculatedRoyalty !== null && (
          <motion.div
            className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Royalty Amount</h4>
                <p className="text-sm text-gray-600">
                  For sale price: {formatSTX(salePrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {formatSTX(calculatedRoyalty)}
                </p>
                <p className="text-sm text-gray-500">
                  ({royaltyInfo.percentage}% of {formatSTX(salePrice)})
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-500 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">How Royalties Work</h4>
              <p className="text-sm text-blue-700">
                When someone sells a greeting card NFT on a secondary marketplace, 
                the creator receives {royaltyInfo.percentage}% of the sale price as a royalty. 
                This ensures creators continue to benefit from their work even after the initial sale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoyaltyInfo;
