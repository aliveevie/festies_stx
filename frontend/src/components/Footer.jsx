import { FaTwitter, FaTelegramPlane, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 text-white py-6 mt-12 rounded-t-xl shadow-inner">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Socials */}
        <div className="flex items-center gap-6 text-lg">
          <a
            href="https://twitter.com/iabdulkarim472"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-indigo-200 transition-colors text-white"
          >
            <FaTwitter className="text-xl" /> @iabdulkarim472
          </a>
          <a
            href="https://t.me/ibrahim_193"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-indigo-200 transition-colors text-white"
          >
            <FaTelegramPlane className="text-xl" /> @ibrahim_193
          </a>
        </div>
        {/* Website */}
        <div className="flex items-center gap-2 text-lg text-white">
          <FaGlobe className="text-xl" />
          <a
            href="https://arbilearn.club"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-200 transition-colors underline underline-offset-4 text-white"
          >
            arbilearn.club
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-white mt-4">
        &copy; {new Date().getFullYear()} Festies. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer; 