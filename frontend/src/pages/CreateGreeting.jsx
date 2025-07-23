import { useState, useEffect } from "react";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
  request,
} from "@stacks/connect";
import {
  makeContractCall,
  broadcastTransaction,
  Cl,
  stringAsciiCV,
  principalCV,
  uintCV,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

const CONTRACT_ADDRESS = "STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6";
const CONTRACT_NAME = "festies";

const appDetails = {
  name: "Festies",
  icon: "https://freesvg.org/img/1541103084.png",
};

const CreateGreeting = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [festival, setFestival] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [userData, setUserData] = useState(undefined);
  const [txStatus, setTxStatus] = useState("");
  const [recipient, setRecipient] = useState("");
  const [greetingCard, setGreetingCard] = useState(null);
  const [operatorAddress, setOperatorAddress] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [royaltyInfo, setRoyaltyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  // Fetch royalty info and verify contract deployment
  const fetchRoyaltyInfo = async () => {
    try {
      const response = await request('stx_callReadOnly', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "get-royalty-info",
        functionArgs: [],
        network: "testnet",
        appDetails,
      });
      if (response) {
        setRoyaltyInfo(response);
        console.log('✅ Contract is deployed and accessible');
      }
    } catch (err) {
      console.error('❌ Error fetching royalty info (contract may not be deployed):', err);
      setTxStatus("⚠️ Warning: Unable to verify contract deployment. Please ensure the contract is deployed to testnet.");
    }
  };

  useEffect(() => {
    // Check if user is connected using the new SDK
    const checkConnection = async () => {
      if (isConnected()) {
        try {
          const response = await request('getAddresses');
          if (response.addresses && response.addresses.length > 0) {
            const stxAddress = response.addresses.find(addr => addr.address.startsWith('ST'));
            if (stxAddress) {
              setUserData({
                profile: {
                  stxAddress: stxAddress.address,
                }
              });
              // Fetch royalty info when user connects
              fetchRoyaltyInfo();
            }
          }
        } catch (error) {
          console.error('Error fetching account data:', error);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const response = await connect({
        appDetails,
        onFinish: async () => {
          const accountData = await request('getAddresses');
          if (accountData.addresses && accountData.addresses.length > 0) {
            const stxAddress = accountData.addresses.find(addr => addr.address.startsWith('ST'));
            if (stxAddress) {
              setUserData({
                profile: {
                  stxAddress: stxAddress.address,
                }
              });
            }
          }
        },
        onCancel: () => {
          console.log('Connection cancelled');
        }
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setTxStatus("Error connecting wallet: " + error.message);
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setTxStatus("");
    setIsLoading(true);
    
    try {
      // Validate all required fields
      if (!recipient || !name || !message || !festival || !imageUri || !metadataUri) {
        throw new Error('Please fill in all required fields');
      }

      const addressResponse = await request('getAddresses');
      const stxAddress = addressResponse.addresses.find(addr => addr.address.startsWith('ST'));
      
      if (!stxAddress) {
        throw new Error('No STX address found');
      }

      // Request the transaction from the wallet
      console.log('Calling contract:', `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
      console.log('Function args:', [recipient, name, message, festival, imageUri, metadataUri]);
      
      const response = await request('stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "mint-greeting-card",
        functionArgs: [
          principalCV(recipient),
          stringAsciiCV(name),
          stringAsciiCV(message),
          stringAsciiCV(festival),
          stringAsciiCV(imageUri),
          stringAsciiCV(metadataUri),
        ],
        network: "testnet",
        appDetails,
        validateWithAbi: true,
      });

      if (response.txid) {
        setTxStatus(`🎉 Transaction submitted! TxID: ${response.txid}`);
        // Wait for transaction to be mined and then fetch the greeting card
        setTimeout(fetchGreetingCard, 5000);
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error calling contract:', err);
      setTxStatus("❌ Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGreetingCard = async () => {
    try {
      const response = await request('stx_callReadOnly', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "get-greeting-card",
        functionArgs: [uintCV(1)], // Fetch the first card for now
        network: "testnet",
        appDetails,
      });

      if (response) {
        setGreetingCard(response);
      }
    } catch (err) {
      console.error('Error fetching greeting card:', err);
    }
  };

  // Burn NFT handler
  const handleBurn = async () => {
    setTxStatus("");
    setIsBurning(true);
    try {
      const addressResponse = await request('getAddresses');
      const stxAddress = addressResponse.addresses.find(addr => addr.address.startsWith('ST'));
      if (!stxAddress) throw new Error('No STX address found');
      // Assume token-id is 1 for demo; in production, use actual token id
      const response = await request('stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "burn-greeting-card",
        functionArgs: [uintCV(1)],
        network: "testnet",
        appDetails,
        validateWithAbi: true,
      });
      if (response.txid) {
        setTxStatus(`🔥 Burn transaction submitted! TxID: ${response.txid}`);
        setGreetingCard(null);
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error burning NFT:', err);
      setTxStatus("❌ Error: " + err.message);
    } finally {
      setIsBurning(false);
    }
  };

  // Approve operator handler
  const handleApprove = async () => {
    setApprovalStatus("");
    setIsApproving(true);
    try {
      const addressResponse = await request('getAddresses');
      const stxAddress = addressResponse.addresses.find(addr => addr.address.startsWith('ST'));
      if (!stxAddress) throw new Error('No STX address found');
      const response = await request('stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "approve",
        functionArgs: [uintCV(1), principalCV(operatorAddress)],
        network: "testnet",
        appDetails,
        validateWithAbi: true,
      });
      if (response.txid) {
        setApprovalStatus(`✅ Approval transaction submitted! TxID: ${response.txid}`);
        setOperatorAddress("");
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error approving operator:', err);
      setApprovalStatus("❌ Error: " + err.message);
    } finally {
      setIsApproving(false);
    }
  };

  // Revoke approval handler
  const handleRevokeApproval = async () => {
    setApprovalStatus("");
    setIsApproving(true);
    try {
      const addressResponse = await request('getAddresses');
      const stxAddress = addressResponse.addresses.find(addr => addr.address.startsWith('ST'));
      if (!stxAddress) throw new Error('No STX address found');
      const response = await request('stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "revoke-approval",
        functionArgs: [uintCV(1)],
        network: "testnet",
        appDetails,
        validateWithAbi: true,
      });
      if (response.txid) {
        setApprovalStatus(`🔄 Revoke transaction submitted! TxID: ${response.txid}`);
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error revoking approval:', err);
      setApprovalStatus("❌ Error: " + err.message);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">Mint a Festival Greeting NFT</h1>
        {!userData ? (
          <div className="text-center">
            <button
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg mb-4 hover:bg-indigo-700 transition"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
            <p className="text-gray-600">Connect your wallet to start minting NFTs</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleMint}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="p-3 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Recipient Principal (e.g. ST...)"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                required
              />
              <input
                className="p-3 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <input
              className="p-3 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Festival Name"
              value={festival}
              onChange={e => setFestival(e.target.value)}
              required
            />
            <textarea
              className="p-3 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              required
            />
            <input
              className="p-3 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Image URI"
              value={imageUri}
              onChange={e => setImageUri(e.target.value)}
              required
            />
            <input
              className="p-3 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Metadata URI (JSON metadata file)"
              value={metadataUri}
              onChange={e => setMetadataUri(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 text-white font-bold rounded-lg mt-2 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "⏳ Minting..." : "Mint Greeting NFT"}
            </button>
          </form>
        )}
        
        {/* Transaction Status */}
        {txStatus && (
          <div className="mt-6 p-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50">
            <div className="text-indigo-700 font-semibold">{txStatus}</div>
          </div>
        )}
        {approvalStatus && (
          <div className="mt-6 p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
            <div className="text-green-700 font-semibold">{approvalStatus}</div>
          </div>
        )}
        
        {/* Royalty Info Display */}
        {royaltyInfo && (
          <div className="mt-6 p-4 border border-indigo-300 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="text-lg font-bold mb-3 text-indigo-700">💰 Royalty Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-mono text-sm break-all">{royaltyInfo.recipient}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="font-bold text-lg text-indigo-600">{royaltyInfo.percentage}%</p>
              </div>
            </div>
          </div>
        )}
        
        {/* NFT Display */}
        {greetingCard && (
          <div className="mt-6 p-6 border border-indigo-300 rounded-lg bg-gradient-to-br from-white to-indigo-50 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">🎉 Latest Greeting Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-lg">{greetingCard.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Festival</p>
                    <p className="font-semibold text-lg">{greetingCard.festival}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Message</p>
                    <p className="font-semibold text-lg italic">"{greetingCard.message}"</p>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src={greetingCard.image_uri} 
                  alt="Greeting Card" 
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
            
            {/* Owner Actions */}
            {userData && userData.profile.stxAddress === greetingCard.sender && (
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    className="py-2 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    onClick={handleBurn}
                    disabled={isBurning}
                  >
                    {isBurning ? "🔥 Burning..." : "🔥 Burn NFT"}
                  </button>
                </div>
                
                {/* Approval/Operator section */}
                <div className="p-4 border border-indigo-300 rounded-lg bg-white">
                  <h3 className="text-lg font-bold mb-3 text-indigo-700">🔐 Operator Management</h3>
                  <input
                    className="p-3 border border-indigo-300 rounded-lg mb-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Operator Address (e.g. ST...)"
                    value={operatorAddress}
                    onChange={e => setOperatorAddress(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      onClick={handleApprove}
                      disabled={!operatorAddress || isApproving}
                    >
                      {isApproving ? "⏳ Processing..." : "✅ Approve Operator"}
                    </button>
                    <button
                      className="py-2 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                      onClick={handleRevokeApproval}
                      disabled={isApproving}
                    >
                      {isApproving ? "⏳ Processing..." : "🔄 Revoke Approval"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateGreeting; 