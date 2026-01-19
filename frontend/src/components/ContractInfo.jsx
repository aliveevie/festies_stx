import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaInfoCircle, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaPauseCircle,
  FaPlayCircle,
  FaUsers,
  FaGift,
  FaCrown,
  FaPercentage
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getContractInfo, getContractStatus, getTotalSupply, getLastTokenId, formatSTX } from '../utils/blockchain';

const ContractInfo = ({ className = "" }) => {
  const [contractInfo, setContractInfo] = useState(null);
  const [contractStatus, setContractStatus] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [lastTokenId, setLastTokenId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load contract information
  const loadContractData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [info, status, supply, tokenId] = await Promise.all([
        getContractInfo(),
        getContractStatus(),
        getTotalSupply(),
        getLastTokenId()
      ]);

      setContractInfo(info);
      setContractStatus(status);
      setTotalSupply(supply);
      setLastTokenId(tokenId);
    } catch (error) {
      console.error('Failed to load contract data:', error);
      setError('Failed to load contract information');
      toast.error('Failed to load contract information');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadContractData();
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <FaSpinner className="text-blue-500 text-2xl animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading contract information...</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Contract Info</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadContractData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaInfoCircle className="text-white text-xl" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contract Information
          </h3>
          <p className="text-gray-600 font-medium">Festies NFT Contract Details</p>
        </div>
      </motion.div>

      {/* Contract Details */}
      {contractInfo && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1">Contract Name</h4>
              <p className="text-lg font-bold text-gray-800">{contractInfo.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1">Symbol</h4>
              <p className="text-lg font-bold text-gray-800">{contractInfo.symbol}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1">Version</h4>
              <p className="text-lg font-bold text-gray-800">{contractInfo.version}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
              <p className="text-sm text-gray-600">{contractInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contract Status */}
      {contractStatus && (
        <div className="space-y-4 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Contract Status</h4>
          
          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contract Owner */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaCrown className="text-yellow-500 text-xl" />
              <div>
                <h5 className="font-semibold text-gray-700">Contract Owner</h5>
                <p className="text-sm font-mono text-gray-600 break-all">
                  {contractStatus.owner}
                </p>
              </div>
            </div>

            {/* Contract Status */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {contractStatus.paused ? (
                <FaPauseCircle className="text-red-500 text-xl" />
              ) : (
                <FaPlayCircle className="text-green-500 text-xl" />
              )}
              <div>
                <h5 className="font-semibold text-gray-700">Status</h5>
                <p className={`text-sm font-semibold ${
                  contractStatus.paused ? 'text-red-600' : 'text-green-600'
                }`}>
                  {contractStatus.paused ? 'Paused' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Statistics</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Supply */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <FaGift className="text-blue-500 text-xl" />
            <div>
              <h5 className="font-semibold text-gray-700">Total Supply</h5>
              <p className="text-2xl font-bold text-blue-600">
                {totalSupply !== null ? totalSupply : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Last Token ID */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <FaUsers className="text-green-500 text-xl" />
            <div>
              <h5 className="font-semibold text-gray-700">Last Token ID</h5>
              <p className="text-2xl font-bold text-green-600">
                {lastTokenId !== null ? lastTokenId : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* Royalty Information */}
        {contractStatus && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <FaPercentage className="text-purple-500 text-xl" />
            <div>
              <h5 className="font-semibold text-gray-700">Royalty Rate</h5>
              <p className="text-2xl font-bold text-purple-600">
                {contractStatus.royaltyPercentage}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">About This Contract</h4>
            <p className="text-sm text-blue-700">
              This is a professional NFT contract for Festival Greetings with comprehensive features 
              including royalty support, approval systems, and advanced metadata management. 
              All greeting cards are stored permanently on the Stacks blockchain.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContractInfo;
// Style improvement 29
// Performance optimization 64
// Refactor improvement 92
// Documentation update 117
// Version 142
