import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

/**
 * Beautiful Notification Center Component
 * Displays and manages application notifications
 */
const NotificationCenter = ({ className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const notificationTypes = {
    success: { icon: <FaCheckCircle />, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: <FaTimesCircle />, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: <FaExclamationTriangle />, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    info: { icon: <FaInfoCircle />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  };

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications = [
      { id: 1, type: 'success', title: 'NFT Minted', message: 'Your greeting card has been successfully minted!', timestamp: Date.now() - 1000 * 60 * 5 },
      { id: 2, type: 'info', title: 'New Feature', message: 'Check out our new marketplace filters!', timestamp: Date.now() - 1000 * 60 * 30 },
      { id: 3, type: 'warning', title: 'Low Balance', message: 'Your wallet balance is running low.', timestamp: Date.now() - 1000 * 60 * 60 },
    ];
    setNotifications(mockNotifications);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const unreadCount = notifications.length;

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaBell className="text-white text-xl" />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-14 w-96 max-w-[90vw] bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-200 z-50 max-h-[600px] overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
                <h3 className="text-xl font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-white/80 hover:text-white text-sm font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[500px]">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <FaBell className="text-gray-300 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {notifications.map((notification, index) => {
                        const type = notificationTypes[notification.type] || notificationTypes.info;
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl border-2 ${type.border} ${type.bg} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`text-xl ${type.color} flex-shrink-0`}>
                                {type.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(notification.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                              >
                                <FaTimes className="text-sm" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
// Style improvement
