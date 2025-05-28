import { useState, useEffect } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";
import { FaTicketAlt } from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Explore", href: "#" },
  { name: "My Tickets", href: "#" },
  { name: "About", href: "#" },
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
    <header className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-white text-3xl" />
          <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">Festies</span>
        </div>
        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white text-lg font-medium hover:underline hover:underline-offset-4 transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>
        {/* Wallet Connect */}
        <div>
          {!userData ? (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg shadow hover:bg-indigo-100 transition-colors"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white font-mono text-sm">
                {userData.profile.stxAddress.mainnet.slice(0, 6)}...{userData.profile.stxAddress.mainnet.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="flex md:hidden justify-center gap-6 py-2 bg-white/10">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-white text-base font-medium hover:underline hover:underline-offset-4 transition-all"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header; 