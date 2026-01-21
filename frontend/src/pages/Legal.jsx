import { motion } from 'framer-motion';
import { FaGavel, FaFileContract, FaShieldAlt, FaCookie } from 'react-icons/fa';
import Card from '../components/Card';

/**
 * Legal Page
 * Terms of Service, Privacy Policy, Cookie Policy, and Legal Information
 */
const Legal = () => {
  const legalSections = [
    {
      icon: <FaFileContract className="w-6 h-6" />,
      title: 'Terms of Service',
      lastUpdated: 'Last updated: January 15, 2024',
      content: [
        {
          heading: '1. Acceptance of Terms',
          text: 'By accessing and using Festies, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
        },
        {
          heading: '2. Use License',
          text: 'Permission is granted to temporarily access the materials on Festies for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.',
        },
        {
          heading: '3. NFT Ownership',
          text: 'When you purchase or mint a Festies NFT, you own the NFT on the blockchain. However, this does not grant you any intellectual property rights to the underlying content. The creator retains all copyrights to the content.',
        },
        {
          heading: '4. User Conduct',
          text: 'You agree not to use Festies for any unlawful purpose or in any way that could damage, disable, or impair the platform. You agree not to interfere with or disrupt the security of the site or any servers connected to the site.',
        },
        {
          heading: '5. Disclaimers',
          text: 'The materials on Festies are provided on an "as is" basis. Festies makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
        },
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 15, 2024',
      content: [
        {
          heading: '1. Information We Collect',
          text: 'We collect information that you provide directly to us, including wallet addresses, transaction data, and any information you provide when using our services. We also automatically collect certain information about your device, including IP address and browser type.',
        },
        {
          heading: '2. How We Use Your Information',
          text: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, and respond to your comments and questions.',
        },
        {
          heading: '3. Blockchain Transparency',
          text: 'Please note that transactions on the Stacks blockchain are public and transparent. Your wallet address and transaction history are publicly viewable on the blockchain.',
        },
        {
          heading: '4. Data Security',
          text: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.',
        },
        {
          heading: '5. Your Rights',
          text: 'You have the right to access, update, or delete your personal information. You can also opt out of certain data collection practices. Contact us to exercise these rights.',
        },
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaCookie className="w-6 h-6" />,
      title: 'Cookie Policy',
      lastUpdated: 'Last updated: January 15, 2024',
      content: [
        {
          heading: '1. What Are Cookies',
          text: 'Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.',
        },
        {
          heading: '2. How We Use Cookies',
          text: 'We use cookies to enhance your experience, analyze site usage, and assist with our marketing efforts. We use both session cookies (which expire when you close your browser) and persistent cookies (which stay on your device until they expire or you delete them).',
        },
        {
          heading: '3. Types of Cookies',
          text: 'We use essential cookies for site functionality, analytics cookies to understand how visitors use our site, and preference cookies to remember your settings and preferences.',
        },
        {
          heading: '4. Managing Cookies',
          text: 'You can control and manage cookies through your browser settings. Note that disabling cookies may affect the functionality of Festies.',
        },
      ],
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
            <FaGavel className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Legal Information
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Important legal documents and policies for Festies
          </p>
        </motion.div>

        {/* Legal Sections */}
        <div className="space-y-8">
          {legalSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} text-white`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {section.lastUpdated}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.heading}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <h3 className="text-xl font-semibold mb-2">Questions About Our Legal Policies?</h3>
            <p className="mb-4 text-purple-100">
              If you have any questions about our Terms of Service, Privacy Policy, or Cookie Policy,
              please contact us at <a href="mailto:legal@festies.io" className="underline">legal@festies.io</a>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;
// Style improvement
// Refactor improvement
// Additional style improvement
