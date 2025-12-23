import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-lg border border-blue-100">
            <span className="text-xs font-bold text-blue-600">STX</span>
            {isLoading ? (
                <div className="w-12 h-4 bg-blue-200/50 animate-pulse rounded" />
            ) : (
                <span className="font-mono font-medium text-gray-700">{balance ?? '0.00'}</span>
            )}
        </div>
    );
};

export default WalletBalance;
