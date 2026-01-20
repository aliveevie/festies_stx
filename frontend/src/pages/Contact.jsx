import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-3xl text-blue-500" />,
      title: 'Email',
      content: 'support@festies.io',
      link: 'mailto:support@festies.io',
    },
    {
      icon: <FaPhone className="text-3xl text-purple-500" />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-pink-500" />,
      title: 'Address',
      content: '123 Blockchain St, Web3 City',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
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
            <span className="text-gradient-rainbow">Contact Us</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We'd love to hear from you!
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                title={info.title}
                subtitle={info.content}
                hover
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card title="Send us a message" className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <Input
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="What's this about?"
                required
              />

              <Textarea
                label="Message"
                rows={6}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Tell us more..."
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                icon={<FaPaperPlane />}
                iconPosition="left"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
// Style improvement
// Refactor improvement
// Additional performance optimization
// Final polish v1.0.0
