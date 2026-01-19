import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState, useEffect } from 'react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import ChainhookActivityFeed from './components/ChainhookActivityFeed';

// Common Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorFallback from './components/common/ErrorFallback';

// Routes
import AppRoutes from './routes/AppRoutes';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

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
      <AuthProvider>
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
              }}
            />

            {/* Header */}
            <Header />

            {/* Main content with page transitions handled in AppRoutes */}
            <main className="flex-1">
              <AppRoutes />
            </main>

            {/* Footer */}
            <Footer />

            {/* Mobile Navigation */}
            <MobileNavigation />

            {/* Real-time Chainhook Activity Feed - Floating Widget */}
            <div className="fixed bottom-24 right-4 z-40 hidden md:block">
              <ChainhookActivityFeed />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
// App build 1
// App build 2
// App optimization 1
// App refactor 1
// App docs update
// App style update
// App v1.1.0
// App cleanup
// Frontend final
// Release v1.0.0
