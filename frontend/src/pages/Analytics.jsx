/**
 * Analytics page - Platform analytics and insights
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { Card } from '../components/Card';

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      label: 'Total Revenue',
      value: '$125,432',
      change: '+23.5%',
      icon: DollarSign,
      color: 'green',
    },
    {
      label: 'Active Users',
      value: '3,421',
      change: '+12.3%',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'NFT Sales',
      value: '892',
      change: '+8.7%',
      icon: Activity,
      color: 'purple',
    },
    {
      label: 'Growth Rate',
      value: '18.2%',
      change: '+4.1%',
      icon: TrendingUp,
      color: 'pink',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-gray-400">Platform insights and metrics</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 rounded-lg transition-colors
                  ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 text-${metric.color}-400`} />
                    <span
                      className={`text-sm font-semibold text-${metric.color}-400`}
                    >
                      {metric.change}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-400 mb-1">{metric.label}</h3>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Revenue Chart
            </h3>
            <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart component goes here</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              User Growth
            </h3>
            <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart component goes here</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
// Style improvement
// Refactor improvement
// Additional performance optimization
