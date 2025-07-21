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

const CONTRACT_ADDRESS = "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC";
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
  const [userData, setUserData] = useState(undefined);
  const [txStatus, setTxStatus] = useState("");
  const [recipient, setRecipient] = useState("");
  const [greetingCard, setGreetingCard] = useState(null);
  const [operatorAddress, setOperatorAddress] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [royaltyInfo, setRoyaltyInfo] = useState(null);

  // Fetch royalty info
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
      }
    } catch (err) {
      console.error('Error fetching royalty info:', err);
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
    
    try {
      const addressResponse = await request('getAddresses');
      const stxAddress = addressResponse.addresses.find(addr => addr.address.startsWith('ST'));
      
      if (!stxAddress) {
        throw new Error('No STX address found');
      }

      // Request the transaction from the wallet
      const response = await request('stx_callContract', {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: "mint-greeting-card",
        functionArgs: [
          principalCV(recipient),
          stringAsciiCV(name),
          stringAsciiCV(message),
          stringAsciiCV(festival),
          stringAsciiCV(imageUri),
        ],
        network: "testnet",
        appDetails,
        validateWithAbi: true,
      });

      if (response.txid) {
        setTxStatus(`Transaction submitted! TxID: ${response.txid}`);
        // Wait for transaction to be mined and then fetch the greeting card
        setTimeout(fetchGreetingCard, 5000);
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error calling contract:', err);
      setTxStatus("Error: " + err.message);
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
        setTxStatus(`Burn transaction submitted! TxID: ${response.txid}`);
        setGreetingCard(null);
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error burning NFT:', err);
      setTxStatus("Error: " + err.message);
    }
  };

  // Approve operator handler
  const handleApprove = async () => {
    setApprovalStatus("");
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
        setApprovalStatus(`Approval transaction submitted! TxID: ${response.txid}`);
        setOperatorAddress("");
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error approving operator:', err);
      setApprovalStatus("Error: " + err.message);
    }
  };

  // Revoke approval handler
  const handleRevokeApproval = async () => {
    setApprovalStatus("");
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
        setApprovalStatus(`Revoke transaction submitted! TxID: ${response.txid}`);
      } else {
        throw new Error('No transaction ID received');
      }
    } catch (err) {
      console.error('Error revoking approval:', err);
      setApprovalStatus("Error: " + err.message);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-6 text-center">Mint a Festival Greeting NFT</h1>
        {!userData ? (
          <button
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg mb-4 hover:bg-indigo-700 transition"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleMint}>
            <input
              className="p-3 border border-indigo-300 rounded"
              placeholder="Recipient Principal (e.g. ST...)"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              required
            />
            <input
              className="p-3 border border-indigo-300 rounded"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="p-3 border border-indigo-300 rounded"
              placeholder="Festival Name"
              value={festival}
              onChange={e => setFestival(e.target.value)}
              required
            />
            <textarea
              className="p-3 border border-indigo-300 rounded"
              placeholder="Your Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              required
            />
            <input
              className="p-3 border border-indigo-300 rounded"
              placeholder="Image URI"
              value={imageUri}
              onChange={e => setImageUri(e.target.value)}
              required
            />
            <button
              type="submit"
              className="py-3 bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 text-white font-bold rounded-lg mt-2 hover:scale-105 transition"
            >
              Mint Greeting NFT
            </button>
          </form>
        )}
        {txStatus && <div className="mt-6 text-center text-indigo-700 font-semibold">{txStatus}</div>}
        {approvalStatus && <div className="mt-6 text-center text-indigo-700 font-semibold">{approvalStatus}</div>}
        {/* Royalty Info Display */}
        {royaltyInfo && (
          <div className="mt-6 p-4 border border-indigo-300 rounded">
            <h3 className="text-lg font-bold mb-2">Royalty Information</h3>
            <p><strong>Recipient:</strong> {royaltyInfo.recipient}</p>
            <p><strong>Percentage:</strong> {royaltyInfo.percentage}%</p>
          </div>
        )}
        {greetingCard && (
          <div className="mt-6 p-4 border border-indigo-300 rounded">
            <h2 className="text-xl font-bold mb-2">Latest Greeting Card</h2>
            <p><strong>Name:</strong> {greetingCard.name}</p>
            <p><strong>Festival:</strong> {greetingCard.festival}</p>
            <p><strong>Message:</strong> {greetingCard.message}</p>
            <img src={greetingCard.image_uri} alt="Greeting Card" className="mt-2 max-w-full h-auto" />
            {/* Show Burn button if user is owner */}
            {userData && userData.profile.stxAddress === greetingCard.sender && (
              <button
                className="mt-4 py-2 px-6 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
                onClick={handleBurn}
              >
                Burn NFT
              </button>
            )}
            {/* Approval/Operator section */}
            {userData && userData.profile.stxAddress === greetingCard.sender && (
              <div className="mt-4 p-4 border border-indigo-300 rounded">
                <h3 className="text-lg font-bold mb-2">Operator Management</h3>
                <input
                  className="p-2 border border-indigo-300 rounded mb-2 w-full"
                  placeholder="Operator Address (e.g. ST...)"
                  value={operatorAddress}
                  onChange={e => setOperatorAddress(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="py-2 px-4 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
                    onClick={handleApprove}
                    disabled={!operatorAddress}
                  >
                    Approve Operator
                  </button>
                  <button
                    className="py-2 px-4 bg-orange-600 text-white font-bold rounded hover:bg-orange-700 transition"
                    onClick={handleRevokeApproval}
                  >
                    Revoke Approval
                  </button>
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