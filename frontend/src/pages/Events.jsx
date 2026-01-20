/**
 * Events page - Festival events and calendar
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Filter } from 'lucide-react';
import { Card } from '../components/Card';
import { Calendar as CalendarComponent } from '../components/Calendar';
import { Badge } from '../components/Badge';

export const Events = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: 'New Year Festival 2024',
      date: new Date(2024, 0, 1),
      location: 'Global',
      attendees: 5000,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Spring Festival',
      date: new Date(2024, 3, 15),
      location: 'Tokyo, Japan',
      attendees: 3200,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Summer Music Festival',
      date: new Date(2024, 6, 20),
      location: 'Los Angeles, USA',
      attendees: 8500,
      status: 'upcoming',
    },
  ];

  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter((event) => event.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Festival Events
          </h1>
          <p className="text-gray-400">
            Discover and join upcoming festival celebrations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <CalendarComponent
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </motion.div>

          {/* Events List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {['all', 'upcoming', 'ongoing', 'past'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                    ${
                      filter === filterType
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                    }
                  `}
                >
                  <Filter className="w-4 h-4" />
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {/* Events */}
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {event.title}
                          </h3>
                          <Badge variant={event.status}>
                            {event.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {event.date.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {event.attendees.toLocaleString()} attendees
                          </div>
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:opacity-90 transition-opacity">
                        View Details
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
