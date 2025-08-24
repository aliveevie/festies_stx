# 🎉 Festies Frontend

A modern, professional web application for creating and sharing personalized blockchain greetings on the Stacks network.

## ✨ Features

### 🎨 Modern UI/UX Design
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Glassmorphism Effects**: Modern backdrop blur and transparency effects
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Theme System**: Light/dark mode support with smooth transitions
- **Professional Typography**: Optimized font hierarchy and readability

### 🚀 Enhanced Components
- **Header**: Professional navigation with wallet integration and mobile menu
- **Hero Section**: Engaging landing page with animated elements
- **CreateGreeting**: Advanced form with live preview and customization options
- **Footer**: Comprehensive site information with newsletter signup
- **Page Transitions**: Smooth navigation between routes

### 🛠️ Technical Features
- **React 18**: Latest React features and hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Professional animations and transitions
- **React Query**: Efficient data fetching and caching
- **React Router**: Client-side routing with navigation guards

### 📱 Responsive Features
- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Optimized for mobile and tablet interactions
- **Progressive Enhancement**: Core functionality works without JavaScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd festies_stx/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx    # Navigation and wallet integration
│   │   ├── Hero.jsx      # Landing page hero section
│   │   └── Footer.jsx    # Site footer and links
│   ├── pages/            # Page components
│   │   └── CreateGreeting.jsx  # Greeting creation form
│   ├── hooks/            # Custom React hooks
│   │   └── index.js      # Utility hooks collection
│   ├── utils/            # Utility functions
│   │   └── index.js      # Helper functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.cjs   # Tailwind CSS configuration
├── vite.config.js        # Vite build configuration
└── README.md             # This file
```

## 🎯 Component Overview

### Header Component
- **Navigation**: Professional navigation with active states
- **Wallet Integration**: Connect/disconnect wallet functionality
- **Mobile Menu**: Responsive mobile navigation
- **Theme Toggle**: Light/dark mode switching
- **User Menu**: Profile and account management

### Hero Component
- **Animated Background**: Floating elements with smooth animations
- **Call-to-Action**: Prominent buttons for user engagement
- **Feature Cards**: Interactive cards explaining benefits
- **Responsive Layout**: Optimized for all screen sizes

### CreateGreeting Component
- **Advanced Form**: Professional form with validation
- **Live Preview**: Real-time preview of greeting cards
- **Theme Selection**: Multiple visual themes and styles
- **Customization Options**: Font styles, color schemes, privacy settings
- **Gift Integration**: Optional virtual gift inclusion

### Footer Component
- **Site Information**: Comprehensive site details
- **Navigation Links**: Organized link sections
- **Newsletter Signup**: Email subscription form
- **Social Media**: Professional social links
- **Contact Information**: Business contact details

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradients
- **Secondary**: Pink (#EC4899) and Indigo (#6366F1)
- **Accent**: Yellow (#F59E0B) and Green (#10B981)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, modern fonts with proper hierarchy
- **Body Text**: Readable fonts optimized for screens
- **Interactive Elements**: Clear call-to-action text

### Spacing & Layout
- **Consistent Spacing**: 4px base unit system
- **Responsive Grid**: Flexible layouts for all devices
- **Component Spacing**: Proper margins and padding

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:
- Extended color palette
- Custom spacing and sizing
- Component-specific utilities

### Vite Configuration
- Fast HMR (Hot Module Replacement)
- Optimized build process
- Environment variable support

### ESLint & Prettier
- Code quality enforcement
- Consistent formatting
- Best practices compliance

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: WebP format support
- **Minified Assets**: Production build optimization
- **Caching**: React Query for efficient data management

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run test suite
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Core functionality works in older browsers

## 🔒 Security Features

- **Input Validation**: Client-side form validation
- **XSS Protection**: React's built-in XSS protection
- **Secure Routing**: Protected routes and navigation guards
- **Environment Variables**: Secure configuration management

## 📈 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Email**: Contact the development team

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Modern UI/UX design
- ✅ Responsive components
- ✅ Animation system
- ✅ Form enhancements

### Phase 2 (Next)
- 🔄 Advanced wallet integration
- 🔄 NFT marketplace
- 🔄 User profiles
- 🔄 Social features

### Phase 3 (Future)
- 📋 Analytics dashboard
- 🔄 Advanced customization
- 🔄 Multi-language support
- 🔄 PWA capabilities

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For the animation library
- **Stacks Community** - For blockchain integration support

---

**Built with ❤️ by the Festies Team**

*Making festivals unforgettable with personalized blockchain greetings*
