/**
 * Staking page - NFT staking and rewards
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Lock, TrendingUp, Award } from 'lucide-react';
import { Card } from '../components/Card';
import { StatsCard } from '../components/StatsCard';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

export const Staking = () => {
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakeInput, setStakeInput] = useState('');

  const stats = [
    {
      label: 'Total Staked',
      value: '12,345',
      trend: '+5.2%',
      icon: Lock,
      color: 'purple',
    },
    {
      label: 'Total Rewards',
      value: '1,234',
      trend: '+12.3%',
      icon: Coins,
      color: 'yellow',
    },
    {
      label: 'APY',
      value: '18.5%',
      trend: '+2.1%',
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Your Rewards',
      value: '234.56',
      trend: '+8.7%',
      icon: Award,
      color: 'pink',
    },
  ];

  const handleStake = () => {
    const amount = parseFloat(stakeInput);
    if (amount > 0) {
      setStakedAmount((prev) => prev + amount);
      setStakeInput('');
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(stakeInput);
    if (amount > 0 && amount <= stakedAmount) {
      setStakedAmount((prev) => prev - amount);
      setStakeInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Staking Pool
          </h1>
          <p className="text-gray-400">
            Stake your NFTs and earn rewards
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 text-${stat.color}-400`} />
                    <span className={`text-sm font-semibold text-${stat.color}-400`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stake/Unstake Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Stake/Unstake NFTs
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Amount to Stake
                  </label>
                  <input
                    type="number"
                    value={stakeInput}
                    onChange={(e) => setStakeInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleStake}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    Stake
                  </Button>
                  <Button
                    onClick={handleUnstake}
                    variant="outline"
                    className="flex-1"
                  >
                    Unstake
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-purple-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Your Staked</span>
                  <span className="text-lg font-semibold text-white">
                    {stakedAmount.toFixed(2)} FSTX
                  </span>
                </div>
                <ProgressBar
                  value={(stakedAmount / 100) * 100}
                  max={100}
                  className="h-2"
                />
              </div>
            </Card>
          </motion.div>

          {/* Rewards Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Your Rewards
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Pending Rewards</span>
                    <span className="text-2xl font-bold text-white">
                      234.56 FSTX
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Claim your rewards to add them to your balance
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Staking Period</span>
                    <span className="text-lg font-semibold text-white">30 days</span>
                  </div>
                  <ProgressBar value={60} max={100} className="h-2" />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                  Claim Rewards
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
// Style improvement
