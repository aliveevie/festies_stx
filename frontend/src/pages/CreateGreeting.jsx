import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaGift, FaSmile, FaRocket, FaPaperPlane, FaImage, FaPalette, FaFont, FaUndo, FaSave, FaEye, FaEyeSlash, FaWallet, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getAuthStatus, mintGreetingCard, waitForTransaction, handleBlockchainError, getContractStatus } from '../utils/blockchain';
import { processGreetingData, validateMetadata, generatePlaceholderImage } from '../utils/metadata';
import { useAuth } from '../contexts/AuthContext';

const CreateGreeting = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    message: '',
    festival: 'Festival',
    theme: 'festival',
    fontStyle: 'modern',
    colorScheme: 'warm',
    isPrivate: false,
    includeGift: false,
    giftType: 'virtual',
    recipientAddress: '',
    imageUri: '',
    metadataUri: ''
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const { 
    isConnected, 
    contractStatus, 
    isContractPaused, 
    userAddress,
    refreshContractStatus 
  } = useAuth();

  // Refresh contract status on mount
  useEffect(() => {
    refreshContractStatus();
  }, [refreshContractStatus]);

  const themes = [
    { id: 'festival', name: 'Festival', icon: <FaHeart className="text-pink-500" />, colors: 'from-pink-400 to-purple-500' },
    { id: 'birthday', name: 'Birthday', icon: <FaGift className="text-blue-500" />, colors: 'from-blue-400 to-cyan-500' },
    { id: 'celebration', name: 'Celebration', icon: <FaSmile className="text-yellow-500" />, colors: 'from-yellow-400 to-orange-500' },
    { id: 'achievement', name: 'Achievement', icon: <FaRocket className="text-green-500" />, colors: 'from-green-400 to-emerald-500' }
  ];

  const fontStyles = [
    { id: 'modern', name: 'Modern', class: 'font-sans' },
    { id: 'elegant', name: 'Elegant', class: 'font-serif' },
    { id: 'playful', name: 'Playful', class: 'font-mono' },
    { id: 'classic', name: 'Classic', class: 'font-display' }
  ];

  const colorSchemes = [
    { id: 'warm', name: 'Warm', colors: 'from-red-400 to-orange-500' },
    { id: 'cool', name: 'Cool', colors: 'from-blue-400 to-purple-500' },
    { id: 'earth', name: 'Earth', colors: 'from-green-400 to-brown-500' },
    { id: 'pastel', name: 'Pastel', colors: 'from-pink-200 to-blue-200' }
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (isContractPaused) {
      toast.error('Contract is currently paused. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    setTransactionStatus('preparing');
    
    try {
      // Validate required fields
      if (!formData.recipientName.trim() || !formData.message.trim()) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.recipientAddress.trim()) {
        throw new Error('Please enter recipient address');
      }

      // Process greeting data with metadata validation and IPFS integration
      const greetingData = await processGreetingData({
        ...formData,
        sender: userAddress
      }, userAddress);

      setTransactionStatus('minting');
      toast.loading('Minting your greeting card...', { id: 'minting' });

      // Mint the NFT
      const result = await mintGreetingCard(greetingData);
      
      setTransactionStatus('confirming');
      toast.loading('Confirming transaction...', { id: 'confirming' });

      // Wait for transaction confirmation
      const confirmation = await waitForTransaction(result.txId);
      
      if (confirmation.success) {
        setTransactionStatus('success');
        setMintedTokenId(confirmation.data.tx_result?.value?.value || 'Unknown');
        toast.success('Greeting card minted successfully! 🎉', { id: 'success' });
        
        // Reset form
        setFormData({
          recipientName: '',
          message: '',
          festival: 'Festival',
          theme: 'festival',
          fontStyle: 'modern',
          colorScheme: 'warm',
          isPrivate: false,
          includeGift: false,
          giftType: 'virtual',
          recipientAddress: '',
          imageUri: '',
          metadataUri: ''
        });
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      setTransactionStatus('error');
      const errorMessage = handleBlockchainError(error);
      toast.error(errorMessage, { id: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isConnected, isContractPaused, userAddress]);

  const resetForm = useCallback(() => {
    setFormData({
      recipientName: '',
      message: '',
      festival: 'Festival',
      theme: 'festival',
      fontStyle: 'modern',
      colorScheme: 'warm',
      isPrivate: false,
      includeGift: false,
      giftType: 'virtual',
      recipientAddress: '',
      imageUri: '',
      metadataUri: ''
    });
    setTransactionStatus(null);
    setMintedTokenId(null);
    toast.success('Form reset successfully!');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
            variants={itemVariants}
          >
            Create Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Greeting
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Craft a personalized message that will touch hearts and create lasting memories. 
            Choose your theme, style, and make it uniquely yours.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div 
            className="lg:col-span-2"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              {/* Wallet Connection Status */}
              <motion.div 
                className="mb-6 p-4 rounded-xl border-2"
                variants={itemVariants}
                animate={{
                  borderColor: isConnected ? '#10B981' : '#EF4444',
                  backgroundColor: isConnected ? '#F0FDF4' : '#FEF2F2'
                }}
              >
                <div className="flex items-center gap-3">
                  {isConnected ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isConnected 
                        ? 'You can mint greeting cards' 
                        : 'Please connect your wallet to continue'
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Transaction Status */}
              {transactionStatus && (
                <motion.div 
                  className="mb-6 p-4 rounded-xl border-2 border-blue-200 bg-blue-50"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <FaSpinner className="text-blue-500 text-xl animate-spin" />
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        {transactionStatus === 'preparing' && 'Preparing Transaction...'}
                        {transactionStatus === 'minting' && 'Minting NFT...'}
                        {transactionStatus === 'confirming' && 'Confirming Transaction...'}
                        {transactionStatus === 'success' && 'Success!'}
                        {transactionStatus === 'error' && 'Transaction Failed'}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {transactionStatus === 'preparing' && 'Validating your data...'}
                        {transactionStatus === 'minting' && 'Creating your greeting card on the blockchain...'}
                        {transactionStatus === 'confirming' && 'Waiting for blockchain confirmation...'}
                        {transactionStatus === 'success' && `Token ID: ${mintedTokenId}`}
                        {transactionStatus === 'error' && 'Please try again'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Recipient Name */}
                <motion.div variants={itemVariants}>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Recipient's Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    placeholder="Enter the name of your loved one"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
                    required
                  />
                </motion.div>

                {/* Recipient Address */}
                <motion.div variants={itemVariants}>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    <FaWallet className="inline mr-2" />
                    Recipient's Stacks Address
                  </label>
                  <input
                    type="text"
                    value={formData.recipientAddress}
                    onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                    placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg font-mono"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the Stacks address where the NFT will be sent
                  </p>
                </motion.div>

                {/* Festival */}
                <motion.div variants={itemVariants}>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Festival/Occasion
                  </label>
                  <input
                    type="text"
                    value={formData.festival}
                    onChange={(e) => handleInputChange('festival', e.target.value)}
                    placeholder="e.g., Christmas, Birthday, New Year, etc."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
                    required
                  />
                </motion.div>

                {/* Message */}
                <motion.div variants={itemVariants}>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Your Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Write your heartfelt message here..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg resize-none"
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {formData.message.length}/500 characters
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {previewMode ? <FaEyeSlash /> : <FaEye />}
                        {previewMode ? 'Hide' : 'Preview'}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Theme Selection */}
                <motion.div variants={itemVariants}>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Choose Theme
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleInputChange('theme', theme.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          formData.theme === theme.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{theme.icon}</div>
                          <div className="font-medium text-gray-700">{theme.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Style Options */}
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Font Style */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        <FaFont className="inline mr-2" />
                        Font Style
                      </label>
                      <select
                        value={formData.fontStyle}
                        onChange={(e) => handleInputChange('fontStyle', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      >
                        {fontStyles.map((style) => (
                          <option key={style.id} value={style.id}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        <FaPalette className="inline mr-2" />
                        Color Scheme
                      </label>
                      <select
                        value={formData.colorScheme}
                        onChange={(e) => handleInputChange('colorScheme', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      >
                        {colorSchemes.map((scheme) => (
                          <option key={scheme.id} value={scheme.id}>
                            {scheme.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Options */}
                <motion.div variants={itemVariants}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="text-lg font-semibold text-gray-700">Private Message</label>
                        <p className="text-sm text-gray-500">Only visible to the recipient</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPrivate}
                          onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="text-lg font-semibold text-gray-700">Include Gift</label>
                        <p className="text-sm text-gray-500">Add a virtual gift to your message</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.includeGift}
                          onChange={(e) => handleInputChange('includeGift', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {formData.includeGift && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                      >
                        <label className="block text-lg font-semibold text-gray-700 mb-3">
                          Gift Type
                        </label>
                        <select
                          value={formData.giftType}
                          onChange={(e) => handleInputChange('giftType', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                        >
                          <option value="virtual">Virtual Gift</option>
                          <option value="digital">Digital Asset</option>
                          <option value="nft">NFT Badge</option>
                          <option value="custom">Custom Design</option>
                        </select>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 pt-6"
                  variants={itemVariants}
                >
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaUndo />
                    Reset Form
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Create Greeting
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div 
            className="lg:col-span-1"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Live Preview
              </h3>
              
              {previewMode && formData.recipientName && formData.message ? (
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${themes.find(t => t.id === formData.theme)?.colors} text-white text-center`}>
                    <h4 className="text-2xl font-bold mb-4">
                      Dear {formData.recipientName}
                    </h4>
                    <p className="text-lg leading-relaxed">
                      {formData.message}
                    </p>
                    {formData.includeGift && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <FaGift className="text-2xl mx-auto mb-2" />
                        <p className="text-sm">Includes: {formData.giftType}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>Theme: {themes.find(t => t.id === formData.theme)?.name}</p>
                    <p>Font: {fontStyles.find(f => f.id === formData.fontStyle)?.name}</p>
                    <p>Colors: {colorSchemes.find(c => c.id === formData.colorScheme)?.name}</p>
                    {formData.isPrivate && <p className="text-blue-600 font-medium">🔒 Private Message</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <FaImage className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>Fill out the form to see a live preview of your greeting</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateGreeting; 