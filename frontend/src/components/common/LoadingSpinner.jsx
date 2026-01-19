import { motion } from 'framer-motion';
import { FaGift, FaHeart, FaRocket } from 'react-icons/fa';

/**
 * A beautiful loading spinner with festive gradients and animations.
 */
const LoadingSpinner = () => {
  const icons = [<FaGift key="gift" />, <FaHeart key="heart" />, <FaRocket key="rocket" />];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center z-50 overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Main spinner with gradient */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto relative"
          >
            <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
            </div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl text-white"
                >
                  {icons[Math.floor(Math.random() * icons.length)]}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
        >
          Festies
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="text-white/90 text-lg font-medium"
        >
          Loading your festive experience...
        </motion.p>

        {/* Progress dots */}
        <motion.div
          className="flex gap-2 justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
// Style improvement 37
// Performance optimization 60
// Refactor improvement 96
// Documentation update 121
