/**
 * Calendar component - Date picker/calendar
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Calendar = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || new Date()
  );

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (!isDateDisabled(date) && onDateSelect) {
      onDateSelect(date);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div
      className={`
        bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 
        border border-purple-500/30 rounded-xl p-4 shadow-xl
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-purple-400" />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-purple-400" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-purple-300 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="aspect-square" />;
          }

          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const disabled = isDateDisabled(date);
          const selected =
            selectedDate && isSameDay(date, selectedDate);

          return (
            <motion.button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              className={`
                aspect-square rounded-lg transition-colors
                ${
                  selected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : disabled
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'hover:bg-purple-500/20 text-white'
                }
              `}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
// Style improvement
// Refactor improvement
// Documentation update
