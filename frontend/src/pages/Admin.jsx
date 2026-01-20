/**
 * Admin page - Admin dashboard
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Settings,
  Shield,
  BarChart3,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../components/Card';
import { StatsCard } from '../components/StatsCard';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,234', trend: '+12%' },
    { label: 'Total NFTs', value: '5,678', trend: '+8%' },
    { label: 'Transactions', value: '9,012', trend: '+15%' },
    { label: 'Revenue', value: '$45,678', trend: '+23%' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

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
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage your Festies platform</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
              />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
        >
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Platform Overview
              </h2>
              <p className="text-gray-400">Overview content goes here...</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                User Management
              </h2>
              <p className="text-gray-400">User management content goes here...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Platform Settings
              </h2>
              <p className="text-gray-400">Settings content goes here...</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Security Settings
              </h2>
              <p className="text-gray-400">Security content goes here...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
// Style improvement
