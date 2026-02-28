import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './index';

const ContributionHeatmap = ({
  data = [],
  year = new Date().getFullYear(),
  colorScheme = 'green',
  onDayClick,
  className = ''
}) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Color schemes
  const colors = {
    green: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    purple: ['#161b22', '#3d1f5f', '#5b2d8c', '#7c3aed', '#a78bfa'],
    orange: ['#161b22', '#7c2d12', '#9a3412', '#ea580c', '#fb923c'],
    blue: ['#161b22', '#1e3a8a', '#1d4ed8', '#3b82f6', '#60a5fa'],
    pink: ['#161b22', '#831843', '#be185d', '#ec4899', '#f472b6'],
  };

  const scheme = colors[colorScheme] || colors.green;

  // Generate calendar data
  const calendarData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Adjust start to Sunday
    const startDay = startDate.getDay();
    const calendarStart = new Date(startDate);
    calendarStart.setDate(startDate.getDate() - startDay);

    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(calendarStart);

    // Generate 53 weeks (max for a year)
    for (let week = 0; week < 53; week++) {
      currentWeek = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayData = data.find(d => d.date === dateStr) || { count: 0, date: dateStr };
        const isInYear = currentDate.getFullYear() === year;

        currentWeek.push({
          ...dayData,
          date: dateStr,
          dayOfWeek: day,
          week: week,
          isInYear,
          displayDate: new Date(currentDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(currentWeek);

      // Stop if we've passed the end of the year
      if (currentDate > endDate && weeks.length > 52) break;
    }

    return weeks;
  }, [data, year]);

  // Get color intensity based on count
  const getColor = (count) => {
    if (count === 0) return scheme[0];
    if (count === 1) return scheme[1];
    if (count <= 3) return scheme[2];
    if (count <= 5) return scheme[3];
    return scheme[4];
  };

  const calculateStreak = (data) => {
    const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const day of sorted) {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate - dayDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak && day.count > 0) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    return streak;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const maxStreak = data.reduce((max, d) => Math.max(max, d.count), 0);
    const activeDays = data.filter(d => d.count > 0).length;
    const streak = calculateStreak(data);
    return { total, maxStreak, activeDays, streak };
  }, [data]);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${className}`}>
      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            {stats.streak} day streak
          </h3>
          <p className="text-sm text-gray-400">Keep learning every day!</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{stats.total}</p>
            <p className="text-gray-500">Total XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{stats.activeDays}</p>
            <p className="text-gray-500">Active Days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-400">{stats.maxStreak}</p>
            <p className="text-gray-500">Max Streak</p>
          </div>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={year}
          onChange={(e) => { }}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>

        {/* Color Scheme Selector */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-400">Theme:</span>
          {Object.keys(colors).map(scheme => (
            <button
              key={scheme}
              onClick={() => { }}
              className={`w-5 h-5 rounded-full border-2 ${colorScheme === scheme ? 'border-white' : 'border-transparent'}`}
              style={{ background: colors[scheme][3] }}
            />
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex mb-1">
            <div className="w-8" /> {/* Spacer for day labels */}
            <div className="flex flex-1">
              {monthLabels.map((month, i) => (
                <div key={month} className="flex-1 text-xs text-gray-500 text-center">
                  {calendarData.some(week => week.some(day => {
                    const date = new Date(day.date);
                    return date.getMonth() === i && day.isInYear;
                  })) ? month : ''}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Day Labels */}
            <div className="w-8 flex flex-col justify-around mr-1">
              {['Mon', 'Wed', 'Fri'].map((day, i) => (
                <div key={day} className="text-[10px] text-gray-500 h-3 flex items-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex gap-1">
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${day.isInYear ? 'hover:ring-2 hover:ring-white/50' : 'opacity-20'
                        }`}
                      style={{
                        backgroundColor: day.isInYear ? getColor(day.count) : scheme[0],
                        transform: hoveredDay === day.date ? 'scale(1.3)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setHoveredDay(day.date)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onClick={() => onDayClick?.(day)}
                    >
                      {/* Tooltip */}
                      <AnimatePresence>
                        {hoveredDay === day.date && day.isInYear && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-white/20 pointer-events-none"
                            style={{
                              transform: 'translate(-50%, -120%)',
                            }}
                          >
                            <p className="font-medium">{day.displayDate}</p>
                            <p className="text-gray-400">
                              {day.count === 0 ? 'No activity' :
                                day.count === 1 ? '1 activity' :
                                  `${day.count} activities`}
                            </p>
                            {day.xp && <p className="text-purple-400">+{day.xp} XP</p>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {scheme.map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Activity Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-bold mb-3">Recent Activity</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {data
            .filter(d => d.count > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((day, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: getColor(day.count) }}
                  />
                  <span className="text-sm">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-purple-400">+{day.xp || day.count * 10} XP</span>
                </div>
              </div>
            ))}
          {data.filter(d => d.count > 0).length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No activity yet. Start learning today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Mini version for dashboards
export const MiniHeatmap = ({ data, colorScheme = 'green', days = 30 }) => {
  const colors = {
    green: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    purple: ['#161b22', '#3d1f5f', '#5b2d8c', '#7c3aed', '#a78bfa'],
  };

  const scheme = colors[colorScheme] || colors.green;

  const recentData = data
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, days)
    .reverse();

  const getColor = (count) => {
    if (count === 0) return scheme[0];
    if (count === 1) return scheme[1];
    if (count <= 3) return scheme[2];
    if (count <= 5) return scheme[3];
    return scheme[4];
  };

  return (
    <div className="flex items-center gap-1">
      {recentData.map((day, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.02 }}
          className="w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: getColor(day.count) }}
          title={`${day.date}: ${day.count} activities`}
        />
      ))}
    </div>
  );
};

export default ContributionHeatmap;
