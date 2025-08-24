# Festies NFT Contracts

Professional NFT contracts for Festival Greetings built on Stacks blockchain using Clarity smart contract language.

## 🎯 Overview

Festies NFT Contracts provide a comprehensive solution for creating, managing, and trading festival greeting cards as non-fungible tokens. Built with enterprise-grade features including royalty support, approval systems, and advanced metadata management.

## ✨ Features

- **NFT Standards Compliance**: Implements comprehensive NFT standards with metadata support
- **Royalty System**: Built-in royalty mechanism for creators and artists
- **Approval System**: Advanced approval and operator management for secure trading
- **Batch Operations**: Efficient batch minting for multiple NFTs
- **Pause Functionality**: Emergency pause/unpause capability for contract management
- **Event Tracking**: Comprehensive event logging for transparency
- **Input Validation**: Robust input validation and error handling
- **Metadata Management**: Rich metadata support with creation timestamps

## 🏗️ Architecture

### Core Contracts

- **`festies.clar`**: Main NFT contract implementing all core functionality
- **`nft-trait.clar`**: Enhanced trait interface defining NFT standards

### Key Components

- **GreetingCard NFT**: Core NFT type with festival-specific metadata
- **Royalty System**: Configurable royalty percentages and recipients
- **Approval Management**: Secure token approval and transfer mechanisms
- **Metadata Storage**: Structured data storage for NFT information

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Clarinet CLI >= 2.0.0
- Stacks CLI (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/festies/festies-nft-contracts.git
cd festies-nft-contracts

# Install dependencies
npm install

# Build contracts
npm run build
```

### Development

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Check contract validity
npm run check
```

### Deployment

```bash
# Deploy to devnet
npm run deploy:devnet

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

## 📖 Usage

### Minting NFTs

```clarity
;; Mint a single greeting card
(mint-greeting-card 
    recipient 
    "John Doe" 
    "Happy New Year!" 
    "New Year 2024" 
    "ipfs://image-uri" 
    "ipfs://metadata-uri"
)

;; Batch mint multiple cards
(batch-mint-greeting-cards 
    recipients 
    names 
    messages 
    festivals 
    image-uris 
    metadata-uris
)
```

### Transferring NFTs

```clarity
;; Transfer with approval
(approve token-id operator)
(transfer token-id sender recipient)

;; Revoke approval
(revoke-approval token-id)
```

### Royalty Management

```clarity
;; Set royalty information (owner only)
(set-royalty-info recipient percentage)

;; Get royalty information
(get-royalty-info)

;; Calculate royalty for a sale price
(calculate-royalty sale-price)
```

## 🔧 Configuration

### Contract Parameters

- **Royalty Percentage**: Default 5%, configurable by contract owner
- **Metadata Limits**: 
  - Name: 40 characters
  - Festival: 100 characters
  - Message: 500 characters
  - URIs: 500 characters each

### Network Support

- **Devnet**: Development and testing
- **Testnet**: Public testing network
- **Mainnet**: Production network

## 🧪 Testing

The contracts include comprehensive test coverage:

```bash
# Run all tests
npm test

# Generate coverage report
npm run test:coverage

# Interactive test UI
npm run test:ui
```

Test files are located in the `tests/` directory and cover:
- NFT minting and burning
- Transfer and approval operations
- Royalty calculations
- Error handling
- Edge cases and security scenarios

## 🔒 Security Features

- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive validation of all inputs
- **Pause Mechanism**: Emergency pause capability for security incidents
- **Approval System**: Secure token approval management
- **Error Handling**: Descriptive error codes and messages

## 📊 Contract Statistics

- **Total Supply**: Tracked and queryable
- **Token IDs**: Sequential and unique
- **Creation Timestamps**: Block-based timestamps for each NFT
- **Event Logging**: Comprehensive event tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test examples

## 🔄 Version History

- **v2.0.0**: Enhanced features, professional structure, comprehensive testing
- **v1.0.0**: Initial implementation with basic NFT functionality

## 📚 Additional Resources

- [Clarity Language Documentation](https://docs.stacks.co/write-smart-contracts/overview)
- [Stacks Blockchain](https://www.stacks.co/)
- [Clarinet Development Guide](https://docs.hiro.so/clarinet/)
