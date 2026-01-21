import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { formatAddress } from '../utils/formatters';

// Mock data for demonstration purposes
// In a real app, this would come from a websocket or polling the Chainhook API
const ChainhookActivityFeed = ({ maxEvents = 10, intervalMs = 15_000, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const seedEvents = useMemo(() => {
    const now = Date.now();
    return [
      {
        id: 'seed-1',
        type: 'mint',
        tokenName: 'Birthday Card #42',
        recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        timestamp: now - 1000 * 60 * 5
      },
      {
        id: 'seed-2',
        type: 'transfer',
        tokenName: 'Festival Greetings #10',
        from: 'ST3J2GVMMM2R07ZFBJDWTYEYAR8HX1YY6B7Z4KSB9',
        to: 'ST2C2YYX8Z9W8Z4G3V1N2N5T2V1G5Q5C6Z7T5KX5Z',
        timestamp: now - 1000 * 60 * 30
      }
    ];
  }, []);

  const [events, setEvents] = useState(seedEvents);

  // Simulate incoming events
  useEffect(() => {
    if (!intervalMs || intervalMs < 1000) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const typeRoll = Math.random();
      const type = typeRoll > 0.65 ? 'transfer' : typeRoll > 0.3 ? 'mint' : 'burn';

      const newEvent =
        type === 'transfer'
          ? {
              id: `evt-${now}`,
              type,
              tokenName: `Greeting Card #${Math.floor(Math.random() * 1000)}`,
              from: 'ST3J2GVMMM2R07ZFBJDWTYEYAR8HX1YY6B7Z4KSB9',
              to: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              timestamp: now
            }
          : {
              id: `evt-${now}`,
              type,
              tokenName: `Greeting Card #${Math.floor(Math.random() * 1000)}`,
              recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
              timestamp: now
            };

      setEvents((prev) => [newEvent, ...prev].slice(0, maxEvents));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, maxEvents]);

  return (
    <motion.div
      className={`bg-gradient-to-br from-white/20 via-purple-50/20 to-pink-50/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 shadow-2xl w-full max-w-md ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h3 
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          animate={{ 
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Live Chain Activity
        </motion.h3>
        <motion.span 
          className="flex h-4 w-4 relative"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 shadow-lg shadow-green-500/50"></span>
        </motion.span>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.4, type: 'spring', stiffness: 200 }
              }
              className="bg-gradient-to-r from-black/20 via-black/10 to-transparent rounded-xl p-4 border-2 border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  event.type === 'mint' ? 'bg-green-500/20 text-green-300' : 
                  event.type === 'transfer' ? 'bg-blue-500/20 text-blue-300' : 
                  'bg-red-500/20 text-red-300'
                }`}>
                  {event.type === 'mint' ? '✨' : event.type === 'transfer' ? '🔁' : '🔥'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{event.tokenName}</p>
                  <p className="text-xs text-slate-300">
                    {event.type === 'mint' && `Minted to ${formatAddress(event.recipient)}`}
                    {event.type === 'transfer' &&
                      `Transferred ${formatAddress(event.from)} → ${formatAddress(event.to)}`}
                    {event.type === 'burn' && `Burned`}
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-wider">Powered by Hiro Chainhook</p>
      </div>
    </motion.div>
  );
};

export default ChainhookActivityFeed;
