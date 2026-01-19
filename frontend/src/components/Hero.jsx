import { FaHeart, FaGift, FaSmile, FaRocket, FaArrowRight, FaPlay } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const reasons = [
  {
    icon: <FaHeart className="text-pink-500 text-3xl mb-2" />,
    title: "Share the Love",
    desc: "Festivals are about connection. A heartfelt message can make someone's day unforgettable!",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: <FaGift className="text-indigo-500 text-3xl mb-2" />,
    title: "A Gift that Lasts",
    desc: "Digital greetings are timeless. Your words will be cherished long after the festival ends.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <FaSmile className="text-yellow-400 text-3xl mb-2" />,
    title: "Spread Joy",
    desc: "A simple greeting can light up a face and spread happiness across miles.",
    color: "from-yellow-400 to-orange-400"
  },
  {
    icon: <FaRocket className="text-purple-500 text-3xl mb-2" />,
    title: "Make It Memorable",
    desc: "Stand out! Sending a message on Festies is unique, fun, and truly memorable.",
    color: "from-purple-500 to-pink-500"
  },
];

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden pb-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-10 left-1/4 w-3 h-3 bg-white rounded-full opacity-70"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 0.3, 0.7]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-3/4 w-4 h-4 bg-yellow-300 rounded-full opacity-60"
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-16 right-1/3 w-2 h-2 bg-pink-200 rounded-full opacity-80"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.8, 0.4, 0.8]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-8 left-1/5 w-5 h-5 bg-indigo-200 rounded-full opacity-50"
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.5, 0.2, 0.5]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      {/* Main content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-2xl mb-6 leading-tight"
          variants={itemVariants}
        >
          Send a Festive
          <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Greeting
          </span>
          to Your Loved Ones!
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 max-w-4xl leading-relaxed"
          variants={itemVariants}
        >
          Make this festival unforgettable. Surprise your friends and family with a personalized message on the blockchain—lasting memories, just a click away.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-16"
          variants={itemVariants}
        >
          <Link
            to="/create"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-2xl text-lg md:text-xl hover:bg-blue-50 hover:shadow-blue-200/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span>Create Your Greeting</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/20 text-lg md:text-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105">
            <FaPlay className="text-sm" />
            Watch Demo
          </button>
        </motion.div>
      </motion.div>

      {/* Why Send a Message section */}
      <motion.div 
        className="relative z-10 max-w-7xl w-full mx-auto px-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12"
          variants={cardVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
            variants={itemVariants}
          >
            Why Send a Message During Festivals?
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {reasons.map((reason, idx) => (
              <motion.div 
                key={idx} 
                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${reason.color} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {reason.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-200 transition-colors duration-300">
                  {reason.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed">
                  {reason.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating action button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <Link
          to="/create"
          className="group w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-110"
        >
          <FaGift className="text-2xl group-hover:rotate-12 transition-transform duration-300" />
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero; // Hero build 1
// Hero build 2
