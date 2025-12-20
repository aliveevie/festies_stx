import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for demonstration purposes
// In a real app, this would come from a websocket or polling the Chainhook API
const MOCK_EVENTS = [
  {
    id: '1',
    type: 'mint',
    tokenName: 'Birthday Card #42',
    recipient: 'SP2...',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
  },
  {
    id: '2',
    type: 'transfer',
    tokenName: 'Festival Greetings #10',
    from: 'SP3...',
    to: 'SP4...',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
  },
];

interface ChainhookEvent {
  id: string;
  type: 'mint' | 'transfer' | 'burn';
  tokenName: string;
  recipient?: string;
  from?: string;
  to?: string;
  timestamp: number;
}

const ChainhookActivityFeed: React.FC = () => {
  const [events, setEvents] = useState<ChainhookEvent[]>(MOCK_EVENTS);

  // Simulate incoming events
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent: ChainhookEvent = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'mint' : 'transfer',
        tokenName: `Greeting Card #${Math.floor(Math.random() * 1000)}`,
        recipient: 'SP123...ABC',
        timestamp: Date.now(),
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 10)); // Keep last 10
    }, 15000); // New event every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Live Chain Activity
        </h3>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-black/20 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors"
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
                    {event.type === 'mint' && `Minted by ${event.recipient}`}
                    {event.type === 'transfer' && `Transferred from ${event.from}`}
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
    </div>
  );
};

export default ChainhookActivityFeed;
