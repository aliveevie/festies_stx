import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getStacksApiBaseUrl } from '../config/stacks';
import { formatSTX } from '../utils/formatters';
import { getTimeAgo } from '../utils/time';

const WalletBalance = () => {
    const { userAddress } = useAuth();
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);

    const refreshIntervalMs = 30000;

    useEffect(() => {
        if (!userAddress) return undefined;

        const controller = new AbortController();

        const fetchBalance = async () => {
            if (!userAddress) return;

            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = getStacksApiBaseUrl();

                const response = await fetch(
                    `${apiUrl}/extended/v1/address/${userAddress}/balances`,
                    { signal: controller.signal }
                );
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();

                const microStx = Number.parseInt(data?.stx?.balance || '0', 10);
                setBalance(Number.isFinite(microStx) ? microStx : 0);
                setLastUpdated(new Date());
            } catch (error) {
                if (error?.name === 'AbortError') return;
                console.error('Failed to fetch balance:', error);
                setError('Unable to load balance');
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchBalance();

        const interval = setInterval(fetchBalance, refreshIntervalMs);
        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, [userAddress, refreshIntervalMs]);

    if (!userAddress) return null;

    const updatedLabel = lastUpdated ? getTimeAgo(lastUpdated) : 'never';

    return (
        <motion.div 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            title={`Updated ${updatedLabel}`}
            aria-live="polite"
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
                    {error ? 'Unavailable' : formatSTX(balance ?? 0, 4)}
                </motion.span>
            )}
        </motion.div>
    );
};

export default WalletBalance;
