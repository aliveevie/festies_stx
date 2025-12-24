import { motion } from 'framer-motion';

/**
 * Error boundary fallback component with a friendly UI.
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
      </p>
      <div className="space-y-3">
        <button
          onClick={resetErrorBoundary}
          className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </motion.div>
  </div>
);

export default ErrorFallback;
