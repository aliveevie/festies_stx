import { motion } from 'framer-motion';
import { FaNetworkWired, FaCheckCircle } from 'react-icons/fa';
import { getNetwork } from '../utils/environment';

const NetworkIndicator = () => {
    const network = getNetwork();
    const networkName = network === 'mainnet' ? 'Mainnet' : network === 'devnet' ? 'Devnet' : 'Testnet';
    const indicatorColor =
        network === 'mainnet' ? 'bg-green-500' : network === 'devnet' ? 'bg-blue-500' : 'bg-yellow-500';
    const indicatorGlow =
        network === 'mainnet'
            ? 'shadow-green-500/50'
            : network === 'devnet'
              ? 'shadow-blue-500/50'
              : 'shadow-yellow-500/50';

    const label = `Stacks ${networkName}`;

    return (
        <motion.div 
            className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={label}
            aria-label={label}
            role="status"
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
