import { useState, useEffect } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";

const Header = () => {
  const [userData, setUserData] = useState(undefined);

  const appConfig = new AppConfig(["store_write"]);
  const userSession = new UserSession({ appConfig });

  const appDetails = {
    name: "Festies",
    icon: "https://freesvg.org/img/1541103084.png",
  };

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
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

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-indigo-600">FX</span>
        </div>
        <div>
          {!userData ? (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {userData.profile.stxAddress.mainnet.slice(0, 6)}...
                {userData.profile.stxAddress.mainnet.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 