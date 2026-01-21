import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaQuestionCircle, FaBook, FaHeadset, FaComments, FaTicketAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import Accordion from '../components/Accordion';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Card from '../components/Card';

/**
 * Support Page
 * Help center with search, FAQ, contact options, and ticket system
 */
const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <FaQuestionCircle className="w-5 h-5" />,
      items: [
        {
          question: 'How do I create my first Festies NFT?',
          answer: 'To create your first Festies NFT, click on "Create Greeting" in the navigation menu. Connect your wallet, fill in the festival details, add a message, and optionally upload an image. Once you submit, your NFT will be minted on the Stacks blockchain.',
        },
        {
          question: 'Do I need a Stacks wallet?',
          answer: 'Yes, you need a Stacks wallet to interact with Festies. We support Hiro Wallet, Xverse, and other compatible Stacks wallets. You can download one from their official websites.',
        },
        {
          question: 'What is the cost to mint a Festies NFT?',
          answer: 'The minting cost varies depending on network fees. Typically, minting a Festies NFT costs a small amount of STX (Stacks token) to cover blockchain transaction fees. The exact amount will be displayed before you confirm the transaction.',
        },
      ],
    },
    {
      title: 'Marketplace',
      icon: <FaBook className="w-5 h-5" />,
      items: [
        {
          question: 'How do I buy a Festies NFT?',
          answer: 'Browse the Marketplace page to see available Festies NFTs. Click on any NFT to view details, then click "Buy Now" or "Make Offer" if the seller has enabled offers. Confirm the transaction in your wallet.',
        },
        {
          question: 'Can I list my Festies NFT for sale?',
          answer: 'Yes! Go to your Collection page, select the NFT you want to sell, and click "List for Sale". Set your price in STX and confirm the listing. Your NFT will appear in the Marketplace.',
        },
        {
          question: 'What are royalties?',
          answer: 'Royalties are a percentage of each secondary sale that goes to the original creator. When you mint a Festies NFT, you can set a royalty percentage (typically 5-10%) that you will receive every time your NFT is sold.',
        },
      ],
    },
    {
      title: 'Technical Support',
      icon: <FaHeadset className="w-5 h-5" />,
      items: [
        {
          question: 'My transaction is pending. What should I do?',
          answer: 'Stacks blockchain transactions can take a few minutes to confirm. If your transaction is pending for more than 30 minutes, check your wallet for the transaction status. You can also check the transaction ID on a Stacks blockchain explorer.',
        },
        {
          question: 'I lost access to my wallet. Can I recover my NFTs?',
          answer: 'Unfortunately, if you lose access to your wallet and don\'t have your recovery phrase, your NFTs cannot be recovered. This is why it\'s crucial to securely store your recovery phrase. Festies cannot help recover lost wallets.',
        },
        {
          question: 'Why is my NFT not showing in my collection?',
          answer: 'If your NFT isn\'t showing, try refreshing the page or disconnecting and reconnecting your wallet. If it still doesn\'t appear, verify the transaction was successful on a Stacks blockchain explorer using your wallet address.',
        },
      ],
    },
  ];

  const contactOptions = [
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: 'Email Support',
      description: 'Get help via email',
      action: 'Send Email',
      href: 'mailto:support@festies.io',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FaComments className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      href: '#',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FaTicketAlt className="w-6 h-6" />,
      title: 'Submit Ticket',
      description: 'Create a support ticket',
      action: 'Create Ticket',
      href: '#',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const filteredFAQs = faqCategories.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search our knowledge base or get in touch with our support team
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500"
            />
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {contactOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                className={`bg-gradient-to-br ${option.color} p-6 text-white cursor-pointer`}
                onClick={() => window.location.href = option.href}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                    <p className="text-white text-opacity-90 mb-4">{option.description}</p>
                  </div>
                  <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100">
                    {option.action}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {filteredFAQs.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <FaQuestionCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No results found for "{searchQuery}"
              </p>
            </div>
          ) : (
            filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + categoryIndex * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-purple-500">{category.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <Accordion
                      key={itemIndex}
                      title={item.question}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                      <p className="text-gray-600 dark:text-gray-300 p-4">
                        {item.answer}
                      </p>
                    </Accordion>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
// Style improvement
// Refactor improvement
// Additional style improvement
// Documentation update
// Additional performance optimization
