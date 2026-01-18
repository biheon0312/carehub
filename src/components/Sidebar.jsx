import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'inventory', label: '재고 관리', icon: Package },
    { id: 'checkout', label: '결제 시스템', icon: ShoppingCart },
    { id: 'pharmacy-map', label: '전국 창고형 약국 정보', icon: Building2 },
    { id: 'chatbot', label: 'AI 상담', icon: MessageSquare }
  ];

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 p-4"
    >
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600")} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-0 w-full px-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-800 mb-1">접속 상태</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-blue-600">정상 작동 중</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;