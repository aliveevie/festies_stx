import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaHeart, FaArrowUp, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Create Greeting", href: "/create" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Collection", href: "/collection" },
        { name: "How It Works", href: "/about" },
        { name: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Status", href: "/status" },
        { name: "Bug Report", href: "/bugs" },
        { name: "Feature Request", href: "/features" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
        { name: "Licenses", href: "/licenses" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "https://twitter.com/festies", label: "Twitter", color: "hover:text-blue-400" },
    { icon: <FaDiscord />, href: "https://discord.gg/festies", label: "Discord", color: "hover:text-indigo-400" },
    { icon: <FaGithub />, href: "https://github.com/festies", label: "GitHub", color: "hover:text-gray-400" },
    { icon: <FaTelegram />, href: "https://t.me/festies", label: "Telegram", color: "hover:text-blue-500" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Brand section */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <FaHeart className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Festies
                </h3>
                <p className="text-sm text-gray-400">Blockchain Greetings</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Making festivals unforgettable with personalized blockchain greetings. 
              Share love, spread joy, and create lasting memories on the Stacks blockchain.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="mr-3 text-blue-400" />
                <span>hello@festies.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-3 text-purple-400" />
                <span>Global • Stacks Network</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaPhone className="mr-3 text-green-400" />
                <span>+1 (555) FESTIES</span>
              </div>
            </div>
          </motion.div>

          {/* Footer sections */}
          {footerSections.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-white border-b border-gray-700 pb-2">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter subscription */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 mb-12 border border-blue-500/20"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Stay Updated with Festies
            </h3>
            <p className="text-gray-300 mb-6">
              Get the latest updates on new features, festival themes, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-700"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Festies. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span>•</span>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 ${social.color} hover:bg-white/20 transition-all duration-300 transform hover:scale-110`}
                whileHover={{ y: -2 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ y: -2 }}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  );
};

export default Footer; // Footer build 1
// Footer build 2
// Footer optimization 1
// Footer refactor 1
// Footer docs update
// Footer style update
