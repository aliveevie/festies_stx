import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCog, 
  FaPalette, 
  FaBell, 
  FaShieldAlt, 
  FaLanguage, 
  FaSave,
  FaMoon,
  FaSun,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from '../hooks';
import ThemeToggle from '../components/ThemeToggle';
import ProgressBar from '../components/ProgressBar';

const Settings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [sounds, setSounds] = useLocalStorage('sounds', true);
  const [language, setLanguage] = useLocalStorage('language', 'en');
  const [autoRefresh, setAutoRefresh] = useLocalStorage('autoRefresh', true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-gradient-rainbow">Settings</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Customize your Festies experience with these settings
            </motion.p>
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Appearance */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FaPalette className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Appearance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-800">Theme</h3>
                    <p className="text-sm text-gray-600">Choose your preferred color theme</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaBell className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-800">Enable Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about your NFTs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-800">Sounds</h3>
                    <p className="text-sm text-gray-600">Play sounds for notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sounds}
                      onChange={(e) => setSounds(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <FaCog className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Language</h3>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-800">Auto Refresh</h3>
                    <p className="text-sm text-gray-600">Automatically refresh data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleSave}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSave />
                Save Settings
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
// Style improvement
