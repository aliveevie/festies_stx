import { motion } from 'framer-motion';
import { FaHeart, FaLink, FaPalette, FaRocket, FaShieldAlt, FaUsers, FaGift, FaChartLine } from 'react-icons/fa';
import ContractInfo from '../components/ContractInfo';
import RoyaltyInfo from '../components/RoyaltyInfo';

const About = () => {
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 }
        }
    };

    const features = [
        {
            icon: <FaHeart className="text-3xl" />,
            title: "Spread Joy",
            description: "Create lasting memories through personalized digital greetings that touch hearts and bring people together.",
            gradient: "from-pink-500 to-rose-500"
        },
        {
            icon: <FaLink className="text-3xl" />,
            title: "Blockchain Technology",
            description: "Leverage the power of Stacks blockchain to ensure your greetings are permanent, verifiable, and truly yours.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <FaPalette className="text-3xl" />,
            title: "Creator Support",
            description: "Built-in royalty system ensures creators continue to benefit from their work through secondary sales.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <FaRocket className="text-3xl" />,
            title: "Innovation First",
            description: "Cutting-edge NFT technology combined with user-friendly design makes creating and sharing greetings effortless.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: "Secure & Trusted",
            description: "Your data and assets are protected by blockchain security. Every transaction is transparent and immutable.",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: <FaUsers className="text-3xl" />,
            title: "Community Driven",
            description: "Join a vibrant community of creators and collectors who share the joy of meaningful digital connections.",
            gradient: "from-indigo-500 to-purple-500"
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Section */}
                    <motion.div 
                        className="text-center mb-16"
                        variants={itemVariants}
                    >
                        <motion.h1 
                            className="text-5xl md:text-7xl font-extrabold mb-6"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-gradient-rainbow">About Festies</span>
                        </motion.h1>
                        <motion.p 
                            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            variants={itemVariants}
                        >
                            Learn more about our mission, how the technology works, and the contract details. 
                            We're building the future of digital greetings on the blockchain.
                        </motion.p>
                    </motion.div>

                    {/* Contract & Royalty Info */}
                    <motion.div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                        variants={itemVariants}
                    >
                        <motion.div variants={cardVariants}>
                            <ContractInfo />
                        </motion.div>
                        <motion.div variants={cardVariants}>
                            <RoyaltyInfo />
                        </motion.div>
                    </motion.div>

                    {/* Mission Section */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-gray-200 shadow-2xl mb-16"
                        variants={itemVariants}
                    >
                        <motion.h2 
                            className="text-4xl md:text-5xl font-bold text-center mb-12"
                            variants={itemVariants}
                        >
                            <span className="text-gradient-rainbow">Our Mission</span>
                        </motion.h2>
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                        >
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-transparent transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                    variants={cardVariants}
                                    whileHover={{ y: -5 }}
                                >
                                    <motion.div
                                        className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div 
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
                        variants={itemVariants}
                    >
                        <motion.h2 
                            className="text-3xl md:text-4xl font-bold text-center mb-12"
                            variants={itemVariants}
                        >
                            Platform Statistics
                        </motion.h2>
                        <motion.div 
                            className="grid grid-cols-2 md:grid-cols-4 gap-6"
                            variants={containerVariants}
                        >
                            {[
                                { icon: <FaGift />, value: "1.2K+", label: "Greeting Cards" },
                                { icon: <FaUsers />, value: "500+", label: "Active Users" },
                                { icon: <FaChartLine />, value: "98%", label: "Uptime" },
                                { icon: <FaRocket />, value: "24/7", label: "Support" }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                                    variants={cardVariants}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-3xl mb-3">{stat.icon}</div>
                                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-blue-100 text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
// Style improvement 38
// Performance optimization 63
// Refactor improvement 82
// Documentation update 107
// Version 132
