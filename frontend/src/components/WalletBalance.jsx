import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const WalletBalance = () => {
    const { userAddress } = useAuth();
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!userAddress) return;

            setIsLoading(true);
            try {
                const isMainnet = process.env.NODE_ENV === 'production';
                const apiUrl = isMainnet
                    ? 'https://stacks-node-api.mainnet.stacks.co'
                    : 'https://stacks-node-api.testnet.stacks.co';

                const response = await fetch(`${apiUrl}/extended/v1/address/${userAddress}/balances`);
                const data = await response.json();

                // Convert microSTX to STX
                const stxBalance = parseInt(data.stx.balance) / 1000000;
                setBalance(stxBalance.toLocaleString(undefined, { maximumFractionDigits: 2 }));
            } catch (error) {
                console.error('Failed to fetch balance:', error);
                setBalance('Error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [userAddress]);

    if (!userAddress) return null;

    return (
        <motion.div 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
                {isLoading ? (
                    <FaSpinner className="text-blue-500 text-sm" />
                ) : (
                    <FaCoins className="text-blue-600 text-sm" />
                )}
            </motion.div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">STX</span>
            {isLoading ? (
                <div className="w-16 h-4 bg-gradient-to-r from-blue-200 to-purple-200 animate-pulse rounded-md" />
            ) : (
                <motion.span 
                    className="font-mono font-semibold text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {balance ?? '0.00'}
                </motion.span>
            )}
        </motion.div>
    );
};

export default WalletBalance;
// Style improvement 35
// Performance optimization 66
// Refactor improvement 94
// Documentation update 119
// Version 144
// Final polish 169
// Release prep 194
