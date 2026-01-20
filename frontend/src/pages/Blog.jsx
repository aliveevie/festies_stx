import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with Festies NFTs',
      excerpt: 'Learn how to create and mint your first greeting card NFT on the Stacks blockchain.',
      author: 'Festies Team',
      date: '2024-01-15',
      tags: ['NFT', 'Tutorial', 'Blockchain'],
      image: 'https://via.placeholder.com/400x250',
    },
    {
      id: 2,
      title: 'Understanding NFT Royalties',
      excerpt: 'A comprehensive guide to how royalties work in the Festies ecosystem.',
      author: 'Festies Team',
      date: '2024-01-10',
      tags: ['Royalties', 'Guide'],
      image: 'https://via.placeholder.com/400x250',
    },
    {
      id: 3,
      title: 'Marketplace Best Practices',
      excerpt: 'Tips and tricks for successfully selling your greeting cards on the marketplace.',
      author: 'Festies Team',
      date: '2024-01-05',
      tags: ['Marketplace', 'Tips'],
      image: 'https://via.placeholder.com/400x250',
    },
  ];

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gradient-rainbow">Blog</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Latest news, tutorials, and updates from the Festies community
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                hover
                className="h-full"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="primary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaUser />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{post.date}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Blog;
// Style improvement
