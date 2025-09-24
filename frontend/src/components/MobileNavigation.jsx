import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaHome, FaChartLine, FaShoppingCart, FaPlus, FaUser, FaInfoCircle, FaWallet } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress } from '../utils';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, userAddress, userDisplayName, connectWallet, disconnectWallet } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Dashboard", href: "/dashboard", icon: <FaChartLine /> },
    { name: "Marketplace", href: "/marketplace", icon: <FaShoppingCart /> },
    { name: "Create", href: "/create", icon: <FaPlus /> },
    { name: "Collection", href: "/collection", icon: <FaUser /> },
    { name: "About", href: "/about", icon: <FaInfoCircle /> },
  ];

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        location.pathname === item.href
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Wallet Section */}
                <div className="p-4 border-t border-gray-200">
                  {!isConnected ? (
                    <button
                      onClick={handleConnectWallet}
                      className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                    >
                      <FaWallet className="text-lg" />
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{userDisplayName}</p>
                            <p className="text-sm text-gray-500 font-mono">
                              {formatAddress(userAddress)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Disconnect Button */}
                      <button
                        onClick={handleDisconnectWallet}
                        className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                      >
                        <FaTimes />
                        Disconnect Wallet
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                  <p>Festies NFT Platform</p>
                  <p className="mt-1">Version 2.0.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
