import { motion } from 'framer-motion';
import { FaNetworkWired, FaCheckCircle } from 'react-icons/fa';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const NetworkIndicator = () => {
    const isMainnet = process.env.NODE_ENV === 'production';
    const networkName = isMainnet ? 'Mainnet' : 'Testnet';
    const indicatorColor = isMainnet ? 'bg-green-500' : 'bg-yellow-500';
    const indicatorGlow = isMainnet ? 'shadow-green-500/50' : 'shadow-yellow-500/50';

    return (
        <motion.div 
            className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div 
                className={`w-3 h-3 rounded-full ${indicatorColor} ${indicatorGlow} shadow-lg`}
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                }}
                transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <FaNetworkWired className="text-white/80 text-sm" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">
                Stacks {networkName}
            </span>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="opacity-50"
            >
                <FaCheckCircle className="text-white/60 text-xs" />
            </motion.div>
        </motion.div>
    );
};

export default NetworkIndicator;
// Style improvement 32
// Performance optimization 67
// Refactor improvement 95
