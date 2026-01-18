import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
    setOrders(savedOrders.slice(0, 5));
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{order.patientName}</p>
                <p className="text-sm text-gray-500">{order.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">${order.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentOrders;