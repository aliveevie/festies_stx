import { useState, useEffect } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";
import { FaTicketAlt } from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#" },
  { name: "Create Greetings", href: "#" }
];

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
    <header className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 shadow-lg rounded-b-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between min-h-[72px]">
        {/* Logo */}
        <div className="flex items-center gap-4 pr-8">
          <FaTicketAlt className="text-white text-3xl drop-shadow" />
          <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">Festies</span>
        </div>
        {/* Navigation */}
        <nav className="flex gap-8 flex-1">
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-white text-lg font-semibold hover:underline hover:underline-offset-8 transition-all ${idx === 0 ? 'opacity-90' : 'opacity-80'} px-2`}
            >
              {link.name}
            </a>
          ))}
        </nav>
        {/* Wallet Connect */}
        <div className="flex items-center">
          {!userData ? (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg shadow-md hover:bg-indigo-50 hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg shadow">
              <span className="text-white font-mono text-sm">
                {userData.profile.stxAddress.mainnet.slice(0, 6)}...{userData.profile.stxAddress.mainnet.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 