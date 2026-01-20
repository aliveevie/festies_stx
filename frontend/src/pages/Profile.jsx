import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaGift, 
  FaChartLine, 
  FaTrophy,
  FaCalendarAlt,
  FaWallet,
  FaCopy
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress, copyToClipboard } from '../utils';
import { toast } from 'react-hot-toast';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';

const Profile = () => {
  const { user, userAddress, userDisplayName, isConnected } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'NFT enthusiast and greeting card collector',
    location: 'Stacks Network',
    website: 'https://festies.io',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCopyAddress = async () => {
    if (userAddress) {
      const success = await copyToClipboard(userAddress);
      if (success) {
        toast.success('Address copied to clipboard!');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center py-20">
          <FaUser className="text-gray-400 text-6xl mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Profile</h1>
          <p className="text-xl text-gray-600">
            Connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaUser className="text-white text-5xl" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-7xl font-extrabold mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-gradient-rainbow">{userDisplayName}</span>
            </motion.h1>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="success">Verified</Badge>
              <Badge variant="info">Active</Badge>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            variants={itemVariants}
          >
            <StatsCard
              title="Total NFTs"
              value="12"
              subtitle="Greeting cards owned"
              icon={<FaGift className="text-white text-2xl" />}
              trend="up"
              trendValue="+3"
              gradient="from-blue-500 to-cyan-500"
            />
            <StatsCard
              title="Total Value"
              value="1.5K STX"
              subtitle="Portfolio value"
              icon={<FaChartLine className="text-white text-2xl" />}
              trend="up"
              trendValue="+12%"
              gradient="from-purple-500 to-pink-500"
            />
            <StatsCard
              title="Achievements"
              value="8"
              subtitle="Badges earned"
              icon={<FaTrophy className="text-white text-2xl" />}
              trend="up"
              trendValue="+2"
              gradient="from-green-500 to-emerald-500"
            />
          </motion.div>

          {/* Profile Info */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 shadow-xl mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <motion.button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? <FaSave /> : <FaEdit />}
                {isEditing ? 'Save' : 'Edit'}
              </motion.button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                  <FaWallet className="text-blue-500" />
                  <span className="font-mono text-gray-800 flex-1">{userAddress}</span>
                  <motion.button
                    onClick={handleCopyAddress}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaCopy />
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    rows={4}
                  />
                ) : (
                  <p className="p-4 bg-white/50 rounded-xl text-gray-700">{profileData.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    />
                  ) : (
                    <p className="p-4 bg-white/50 rounded-xl text-gray-700">{profileData.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    />
                  ) : (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/50 rounded-xl text-blue-600 hover:text-blue-700 block"
                    >
                      {profileData.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Collection Progress</h2>
            <div className="space-y-6">
              <ProgressBar
                progress={60}
                label="Collection Completion"
                color="blue"
                milestones={[
                  { position: 25, label: 'Bronze' },
                  { position: 50, label: 'Silver' },
                  { position: 75, label: 'Gold' },
                  { position: 100, label: 'Platinum' },
                ]}
              />
              <ProgressBar
                progress={40}
                label="Festival Coverage"
                color="purple"
              />
              <ProgressBar
                progress={80}
                label="Community Engagement"
                color="green"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
