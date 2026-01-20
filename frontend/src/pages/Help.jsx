import { motion } from 'framer-motion';
import { FaQuestionCircle, FaBook, FaComments, FaEnvelope } from 'react-icons/fa';
import Accordion from '../components/Accordion';
import Card from '../components/Card';

const Help = () => {
  const faqItems = [
    {
      title: 'How do I create a greeting card?',
      content: 'To create a greeting card, navigate to the "Create Greeting" page, fill in the recipient details, write your message, select a festival type, and click "Mint NFT". You\'ll need to connect your wallet and have some STX for the minting fee.',
    },
    {
      title: 'What is the minting fee?',
      content: 'The minting fee varies but is typically around 1-2 STX. This covers the blockchain transaction costs and platform fees.',
    },
    {
      title: 'How do I transfer my NFT?',
      content: 'You can transfer your NFT by going to your collection, selecting the card you want to transfer, and entering the recipient\'s Stacks address. Confirm the transaction in your wallet.',
    },
    {
      title: 'What are royalties?',
      content: 'Royalties are a percentage of the sale price that goes to the original creator when an NFT is sold on the secondary market. The default royalty rate is 7%.',
    },
    {
      title: 'Can I burn my NFT?',
      content: 'Yes, you can burn (permanently delete) your NFT if you own it. This action is irreversible, so make sure you want to delete it before confirming.',
    },
  ];

  const helpSections = [
    {
      icon: <FaBook className="text-4xl text-blue-500" />,
      title: 'Documentation',
      description: 'Comprehensive guides and tutorials',
      link: '/docs',
    },
    {
      icon: <FaComments className="text-4xl text-purple-500" />,
      title: 'Community',
      description: 'Join our Discord community',
      link: '/community',
    },
    {
      icon: <FaEnvelope className="text-4xl text-pink-500" />,
      title: 'Contact Support',
      description: 'Get help from our support team',
      link: '/contact',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FaQuestionCircle className="text-white text-5xl" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gradient-rainbow">Help Center</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions and get support
          </p>
        </motion.div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {helpSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                title={section.title}
                subtitle={section.description}
                hover
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {section.icon}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <Accordion items={faqItems} />
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
