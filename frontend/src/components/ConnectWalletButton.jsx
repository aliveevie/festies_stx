import { motion } from 'framer-motion';
import { FaWallet } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ConnectWalletButton = ({ className, label = "Connect Wallet" }) => {
    const { connectWallet, isLoading } = useAuth();

    return (
        <motion.button
            onClick={connectWallet}
            disabled={isLoading}
            className={`relative overflow-hidden group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <div className="flex items-center gap-2 relative z-10">
                <FaWallet className="text-lg" />
                <span>{isLoading ? 'Connecting...' : label}</span>
            </div>
        </motion.button>
    );
};

export default ConnectWalletButton;
// UI phase 36
// UI phase 37
// UI phase 38
// UI phase 39
// UI phase 40
// UI phase 41
// UI phase 42
