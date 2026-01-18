import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, index }) => {
  const isPositive = trend.startsWith('+');

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend}
            </span>
            <span className="text-sm text-gray-500">vs last week</span>
          </div>
        </div>
        <div className={`${color} w-14 h-14 rounded-lg flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;