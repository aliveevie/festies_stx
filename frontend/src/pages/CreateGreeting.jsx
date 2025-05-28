import { useState, useEffect } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { STACKS_MOCKNET } from "@stacks/network";
import { stringAsciiCV, principalCV } from "@stacks/transactions";

const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const CONTRACT_NAME = "festies";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });
const appDetails = {
  name: "Festies",
  icon: "https://freesvg.org/img/1541103084.png",
};

const CreateGreeting = () => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [festival, setFestival] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [userData, setUserData] = useState(undefined);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    });
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setTxStatus("");
    const network = new STACKS_MOCKNET({ url: "http://localhost:3999" });
    try {
      const options = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "mint-greeting-card",
        functionArgs: [
          principalCV(recipient),
          stringAsciiCV(message),
          stringAsciiCV(festival),
          stringAsciiCV(imageUri),
        ],
        network,
        appDetails,
        onFinish: ({ txId }) => {
          setTxStatus(`Transaction submitted! TxID: ${txId}`);
        },
        onCancel: () => setTxStatus("Transaction canceled."),
      };
      await openContractCall(options);
    } catch (err) {
      setTxStatus("Error: " + err.message);
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
              placeholder="Image URI (optional)"
              value={imageUri}
              onChange={e => setImageUri(e.target.value)}
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
      </div>
    </section>
  );
};

export default CreateGreeting; 