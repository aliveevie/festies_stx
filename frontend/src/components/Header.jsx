import { useState, useEffect } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";
import { FaTicketAlt, FaWallet, FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatAddress } from '../utils';
import { useLocalStorage, useBoolean } from '../hooks';

const navLinks = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Marketplace", href: "/marketplace", icon: "🛒" },
  { name: "Create Greeting", href: "/create", icon: "✨" },
  { name: "My Collection", href: "/collection", icon: "🎨" },
  { name: "About", href: "/about", icon: "ℹ️" },
];

const Header = () => {
  const [userData, setUserData] = useState(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useBoolean(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useBoolean(false);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "Festies NFT",
    icon: "https://freesvg.org/img/1541103084.png",
  };

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(undefined);
    setIsWalletMenuOpen.setFalse();
    window.location.reload();
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen.toggle();
  };

  const toggleWalletMenu = () => {
    setIsWalletMenuOpen.toggle();
  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg rounded-b-2xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between min-h-[72px]">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 pr-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <FaTicketAlt className="text-white text-3xl drop-shadow-lg" />
            <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
              Festies
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-white text-lg font-semibold hover:text-blue-200 transition-all duration-200 px-3 py-2 rounded-lg ${
                    isActive 
                      ? 'bg-white/20 text-blue-100 shadow-lg' 
                      : 'hover:bg-white/10'
                  }`
                }
                end={link.href === '/'}
              >
                <span>{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </motion.button>

            {/* Wallet Connect/User Menu */}
            {!userData ? (
              <motion.button
                onClick={connectWallet}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWallet className="text-lg" />
                Connect Wallet
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  onClick={toggleWalletMenu}
                  className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg hover:bg-white/30 transition-all duration-200 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="text-lg" />
                  <span className="font-mono text-sm font-medium">
                    {formatAddress(userData.profile.stxAddress.mainnet)}
                  </span>
                </motion.button>

                {/* Wallet Dropdown Menu */}
                <AnimatePresence>
                  {isWalletMenuOpen.value && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-lg" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {userData.profile.name || 'Anonymous User'}
                            </p>
                            <p className="text-sm text-gray-500 font-mono">
                              {formatAddress(userData.profile.stxAddress.mainnet)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={disconnectWallet}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <FaSignOutAlt className="text-red-500" />
                          <span>Disconnect Wallet</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMobileMenuOpen.value ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen.value && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-white/20 mt-4 pt-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen.setFalse()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 text-white text-lg font-semibold px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 text-blue-100' 
                          : 'hover:bg-white/10'
                      }`
                    }
                    end={link.href === '/'}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 