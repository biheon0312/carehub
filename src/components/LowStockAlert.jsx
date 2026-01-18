import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const LowStockAlert = () => {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem('pharmacyInventory') || '[]');
    const low = inventory.filter(item => item.quantity < item.minStock);
    setLowStockItems(low);
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
      </div>
      {lowStockItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-green-600 font-medium">All items well stocked!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
            >
              <p className="font-medium text-gray-900">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600">Stock: {item.quantity}</p>
                <p className="text-xs text-orange-600 font-medium">Min: {item.minStock}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LowStockAlert;