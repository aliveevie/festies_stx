import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CreateGreeting from './pages/CreateGreeting';
import GreetingCardGrid from './components/GreetingCardGrid';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Loading component
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center z-50"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-white mb-2"
      >
        Festies
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white/80"
      >
        Loading your festive experience...
      </motion.p>
    </div>
  </motion.div>
);

// Error boundary component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
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
    </div>
  </div>
);

// Main App component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Error handler
  const handleError = (error, errorInfo) => {
    console.error('App Error:', error, errorInfo);
    setHasError(true);
  };

  // Reset error state
  const resetError = () => {
    setHasError(false);
    setIsLoading(false);
  };

  if (hasError) {
    return <ErrorFallback error={hasError} resetErrorBoundary={resetError} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Header */}
          <Header />

          {/* Main content with page transitions */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/"
                  element={
                    <motion.div
                      key="home"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Hero />
                    </motion.div>
                  }
                />
                
                <Route
                  path="/create"
                  element={
                    <motion.div
                      key="create"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <CreateGreeting />
                    </motion.div>
                  }
                />

                {/* Marketplace */}
                <Route
                  path="/marketplace"
                  element={
                    <motion.div
                      key="marketplace"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      className="min-h-screen py-12 px-4"
                    >
                      <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                            Marketplace
                          </h1>
                          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Browse and discover all the beautiful greeting cards created by our community
                          </p>
                        </div>
                        <GreetingCardGrid 
                          showActions={false}
                          maxItems={50}
                        />
                      </div>
                    </motion.div>
                  }
                />

                <Route
                  path="/collection"
                  element={
                    <motion.div
                      key="collection"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      className="min-h-screen py-12 px-4"
                    >
                      <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                            My Collection
                          </h1>
                          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            View and manage your greeting cards. Transfer, approve, or burn your NFTs.
                          </p>
                        </div>
                        <GreetingCardGrid 
                          showActions={true}
                          maxItems={100}
                        />
                      </div>
                    </motion.div>
                  }
                />

                <Route
                  path="/about"
                  element={
                    <motion.div
                      key="about"
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                      className="min-h-screen flex items-center justify-center"
                    >
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Festies</h1>
                        <p className="text-xl text-gray-600 mb-8">Learn more about our mission and how it works.</p>
                        <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                          <span className="text-4xl">ℹ️</span>
                        </div>
                      </div>
                    </motion.div>
                  }
                />

                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
