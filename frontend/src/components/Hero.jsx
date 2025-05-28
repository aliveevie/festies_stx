import { FaHeart, FaGift, FaSmile, FaRocket } from "react-icons/fa";

const reasons = [
  {
    icon: <FaHeart className="text-pink-500 text-3xl mb-2 animate-bounce" />,
    title: "Share the Love",
    desc: "Festivals are about connection. A heartfelt message can make someone's day unforgettable!",
  },
  {
    icon: <FaGift className="text-indigo-500 text-3xl mb-2 animate-bounce delay-100" />,
    title: "A Gift that Lasts",
    desc: "Digital greetings are timeless. Your words will be cherished long after the festival ends.",
  },
  {
    icon: <FaSmile className="text-yellow-400 text-3xl mb-2 animate-bounce delay-200" />,
    title: "Spread Joy",
    desc: "A simple greeting can light up a face and spread happiness across miles.",
  },
  {
    icon: <FaRocket className="text-purple-500 text-3xl mb-2 animate-bounce delay-300" />,
    title: "Make It Memorable",
    desc: "Stand out! Sending a message on Festies is unique, fun, and truly memorable.",
  },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-pink-400 to-purple-500 overflow-hidden pb-16">
      {/* Animated sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-ping" />
        <div className="absolute bottom-16 right-1/3 w-2 h-2 bg-pink-200 rounded-full opacity-80 animate-pulse" />
        <div className="absolute bottom-8 left-1/5 w-4 h-4 bg-indigo-200 rounded-full opacity-50 animate-ping" />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg animate-fade-in-up mb-4">
          Send a Festive Greeting to Your Loved Ones!
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in-up delay-150">
          Make this festival unforgettable. Surprise your friends and family with a personalized message on the blockchain—lasting memories, just a click away.
        </p>
        <a
          href="#"
          className="inline-block px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg text-lg md:text-xl hover:bg-indigo-50 hover:scale-105 transition-all duration-200 animate-fade-in-up delay-300"
        >
          Create Your Greeting
        </a>
      </div>
      {/* Why Send a Message section */}
      <div className="relative z-10 mt-16 max-w-4xl w-full bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-md animate-fade-in-up delay-500">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Why Send a Message During Festivals?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4">
              {reason.icon}
              <h3 className="text-xl font-semibold text-white mb-2">{reason.title}</h3>
              <p className="text-white/90 text-base">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero; 