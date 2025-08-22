# Festies NFT Contracts - Deployment Guide

This document provides comprehensive deployment instructions for the Festies NFT Contracts across different networks.

## 🚀 Overview

The Festies NFT Contracts consist of two main components:
1. **`nft-trait.clar`** - Enhanced NFT trait interface defining standards
2. **`festies.clar`** - Main NFT contract implementing all functionality

## 📋 Prerequisites

### Required Tools
- **Clarinet CLI** >= 2.0.0
- **Node.js** >= 18.0.0
- **Stacks CLI** (for mainnet deployment)

### Required Balances
- **Devnet/Testnet**: Minimum 0.05 STX
- **Mainnet**: Minimum 0.1 STX (recommended 0.2 STX)

### Network Access
- **Devnet**: Local or remote devnet instance
- **Testnet**: Hiro testnet API access
- **Mainnet**: Mainnet network access

## 🔧 Pre-deployment Setup

### 1. Environment Configuration
```bash
# Set your deployment address
export DEPLOYER_ADDRESS="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

# Verify Clarinet installation
clarinet --version

# Check network connectivity
clarinet requirements check
```

### 2. Contract Validation
```bash
# Validate contract syntax
clarinet check

# Run tests to ensure functionality
npm test

# Check for any linting issues
npm run test:coverage
```

## 🌐 Network-Specific Deployments

### Local Development (Simnet)

**Use Case**: Local development and testing

```bash
# Start local simnet
clarinet console

# Deploy contracts
clarinet deploy --network simnet

# Verify deployment
clarinet contracts list
```

**Configuration**: `deployments/default.simnet-plan.yaml`

### Development Network (Devnet)

**Use Case**: Development team testing and integration

```bash
# Deploy to devnet
clarinet deploy --network devnet

# Monitor deployment
clarinet deployments list --network devnet

# Verify on devnet explorer
# https://explorer.hiro.so/?chain=testnet
```

**Configuration**: `deployments/default.devnet-plan.yaml`

### Test Network (Testnet)

**Use Case**: Public testing and community feedback

```bash
# Deploy to testnet
clarinet deploy --network testnet

# Monitor deployment status
clarinet deployments list --network testnet

# Verify on testnet explorer
# https://explorer.hiro.so/?chain=testnet
```

**Configuration**: `deployments/default.testnet-plan.yaml`

### Production Network (Mainnet)

**Use Case**: Production deployment

```bash
# Verify mainnet configuration
clarinet deployments list --network mainnet

# Deploy to mainnet (requires confirmation)
clarinet deploy --network mainnet

# Monitor deployment
clarinet deployments list --network mainnet
```

**Configuration**: `deployments/default.mainnet-plan.yaml`

## 📊 Deployment Process

### Step 1: Trait Contract Deployment
The `nft-trait.clar` contract must be deployed first as it defines the interface that the main contract implements.

```bash
# Deploy trait contract
clarinet contract publish nft-trait --network <network>

# Verify trait deployment
clarinet contract call nft-trait get-contract-info --network <network>
```

### Step 2: Main Contract Deployment
Once the trait is deployed, deploy the main `festies.clar` contract.

```bash
# Deploy main contract
clarinet contract publish festies --network <network>

# Verify main contract deployment
clarinet contract call festies get-contract-info --network <network>
```

### Step 3: Post-Deployment Verification
After deployment, verify all functionality:

```bash
# Test basic functionality
clarinet contract call festies get-contract-status --network <network>

# Test NFT minting (if you have test STX)
clarinet contract call festies mint-greeting-card \
  --args recipient:ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM \
  --args name:"Test Card" \
  --args message:"Test Message" \
  --args festival:"Test Festival" \
  --args image-uri:"https://example.com/image.png" \
  --args metadata-uri:"https://example.com/metadata.json" \
  --network <network>
```

## 🔍 Verification Commands

### Contract Status
```bash
# Get contract information
clarinet contract call festies get-contract-info --network <network>

# Get contract status
clarinet contract call festies get-contract-status --network <network>

# Get contract owner
clarinet contract call festies get-contract-owner --network <network>
```

### NFT Functionality
```bash
# Get total supply
clarinet contract call festies get-total-supply --network <network>

# Get last token ID
clarinet contract call festies get-last-token-id --network <network>

# Get royalty information
clarinet contract call festies get-royalty-info --network <network>
```

## ⚠️ Important Notes

### Deployment Order
1. **Always deploy `nft-trait.clar` first**
2. **Then deploy `festies.clar`**
3. **Verify both contracts are accessible**

### Cost Considerations
- **Trait Contract**: ~15,000 microSTX
- **Main Contract**: ~25,000 microSTX
- **Total**: ~40,000 microSTX (~0.04 STX)

### Security Considerations
- **Verify contract addresses** after deployment
- **Test all functions** before mainnet deployment
- **Monitor for any unexpected behavior**
- **Keep private keys secure**

## 🚨 Troubleshooting

### Common Issues

#### Contract Not Found
```bash
# Verify contract deployment
clarinet contracts list --network <network>

# Check contract address
clarinet contract info festies --network <network>
```

#### Insufficient Balance
```bash
# Check STX balance
clarinet balance --network <network>

# Get testnet STX from faucet if needed
# https://faucet.testnet.hiro.so/
```

#### Network Connection Issues
```bash
# Test network connectivity
clarinet requirements check

# Verify network configuration
clarinet networks list
```

### Error Codes
- **ERR_OWNER_ONLY (100)**: Only contract owner can perform action
- **ERR_NOT_TOKEN_OWNER (101)**: Not the token owner
- **ERR_INVALID_INPUT (102)**: Invalid input parameters
- **ERR_NOT_AUTHORIZED (103)**: Contract is paused or unauthorized
- **ERR_TOKEN_NOT_FOUND (104)**: Token does not exist
- **ERR_INVALID_ROYALTY (105)**: Invalid royalty percentage
- **ERR_TRANSFER_FAILED (106)**: Transfer operation failed
- **ERR_APPROVAL_FAILED (107)**: Approval operation failed

## 📚 Additional Resources

- [Clarinet Documentation](https://docs.hiro.so/clarinet/)
- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/write-smart-contracts/overview)
- [Hiro Explorer](https://explorer.hiro.so/)

## 🤝 Support

For deployment issues or questions:
1. Check the troubleshooting section above
2. Review contract logs and error messages
3. Create an issue on the project repository
4. Consult the Stacks community forums

## 📝 Deployment Checklist

- [ ] Prerequisites installed and configured
- [ ] Contracts validated and tested
- [ ] Network connectivity verified
- [ ] Sufficient STX balance confirmed
- [ ] Trait contract deployed successfully
- [ ] Main contract deployed successfully
- [ ] All functions verified working
- [ ] Contract addresses documented
- [ ] Deployment recorded in project history
