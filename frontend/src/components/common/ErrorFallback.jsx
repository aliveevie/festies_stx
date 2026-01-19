import { motion } from 'framer-motion';

/**
 * Error boundary fallback component with a friendly UI.
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="max-w-lg w-full bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border-2 border-red-200"
    >
      <motion.div 
        className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-4xl">⚠️</span>
      </motion.div>
      
      <motion.h1 
        className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Something went wrong
      </motion.h1>
      
      <motion.p 
        className="text-gray-600 mb-8 text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
      </motion.p>
      
      {error && (
        <motion.div 
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm font-mono text-red-700 break-all">{error.toString()}</p>
        </motion.div>
      )}
      
      <div className="space-y-3">
        <motion.button
          onClick={resetErrorBoundary}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
        <motion.button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Refresh Page
        </motion.button>
      </div>
    </motion.div>
  </div>
);

export default ErrorFallback;
// Style improvement 36
// Performance optimization 69
// Refactor improvement 97
