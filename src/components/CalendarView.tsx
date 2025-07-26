import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Entry } from '../App';

interface CalendarViewProps {
  entries: Entry[];
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-3"></div>;
          }

          const entry = getEntryForDate(day);
          const hasEntry = !!entry;
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day.toISOString().split('T')[0])}
              className={`relative p-3 text-center transition-all rounded-lg hover:bg-amber-100 ${
                today 
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-semibold' 
                  : hasEntry 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="text-sm">{day.getDate()}</span>
              {hasEntry && (
                <Circle className="h-2 w-2 fill-current text-emerald-500 absolute top-1 right-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-amber-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-100 to-teal-100"></div>
          <span className="text-sm text-gray-600">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded bg-amber-50 relative">
            <Circle className="h-2 w-2 fill-current text-emerald-500 absolute top-0.5 right-0.5" />
          </div>
          <span className="text-sm text-gray-600">Has Entry</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;