import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Star,
  Plus,
  Clock
} from 'lucide-react';
import { medicineDatabase } from '../data/medicines';

const Dashboard = ({ setActiveView }) => {
  const totalItems = medicineDatabase.length;
  const lowStockItems = medicineDatabase.filter(m => m.stock <= m.lowStockThreshold);
  const totalStockValue = medicineDatabase.reduce((sum, m) => sum + (m.price * m.stock), 0);
  
  const [todaySales] = useState(45);
  const [todayRevenue] = useState(520000);

  const topProducts = [...medicineDatabase]
    .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
    .slice(0, 5);

  // 빠른 액션 핸들러
  const handleQuickAction = (action) => {
    switch(action) {
      case 'add-inventory':
        // 재고 추가 - 재고 관리 페이지로 이동
        if (setActiveView) {
          setActiveView('inventory');
        }
        break;
      
      case 'new-order':
        // 새 주문 - 결제 시스템으로 이동
        if (setActiveView) {
          setActiveView('checkout');
        }
        break;
      
      case 'receive-stock':
        // 입고 처리 - 재고 관리 페이지로 이동
        if (setActiveView) {
          setActiveView('inventory');
        }
        break;
      
      case 'stock-alert':
        // 재고 경고 - 재고 부족 항목으로 스크롤
        const alertSection = document.querySelector('#stock-alert-section');
        if (alertSection) {
          alertSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      
      default:
        break;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 환영 배너 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">환영합니다! 🎉</h1>
        <p className="text-blue-100 text-sm md:text-lg">오늘도 효율적인 약국 관리를 시작하세요</p>
      </div>

      {/* 주요 통계 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <p className="text-blue-100 text-xs md:text-base">총 재고</p>
            <Package className="w-6 h-6 md:w-8 md:h-8 text-blue-100" />
          </div>
          <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{totalItems}</p>
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-100">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>+12%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <p className="text-orange-100 text-xs md:text-base">재고 부족</p>
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-orange-100" />
          </div>
          <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{lowStockItems.length}</p>
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-orange-100">
            <span>즉시 확인</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <p className="text-green-100 text-xs md:text-base">오늘 판매</p>
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-green-100" />
          </div>
          <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{todaySales}</p>
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-100">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>+18%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <p className="text-purple-100 text-xs md:text-base">오늘 수익</p>
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-purple-100" />
          </div>
          <p className="text-xl md:text-3xl font-bold mb-1 md:mb-2">₩{todayRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-purple-100">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>+24%</span>
          </div>
        </motion.div>
      </div>

      {/* 인기 상품 & 빠른 액션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 인기 상품 */}
        <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900">인기 상품 TOP 5</h3>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base md:text-lg flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{product.name}</h4>
                  <p className="text-xs md:text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-blue-600 text-sm md:text-base">₩{product.price.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-gray-500">재고: {product.stock}{product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 바로 가기 */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">바로 가기</h3>
          
          <div className="space-y-2 md:space-y-3">
            <button 
              onClick={() => handleQuickAction('add-inventory')}
              className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">재고 추가</span>
            </button>
            
            <button 
              onClick={() => handleQuickAction('new-order')}
              className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">새 주문</span>
            </button>
            
            <button 
              onClick={() => handleQuickAction('receive-stock')}
              className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">입고 처리</span>
            </button>
            
            <button 
              onClick={() => handleQuickAction('stock-alert')}
              className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">재고 부족</span>
            </button>
          </div>
        </div>
      </div>

      {/* 재고 부족 알림 */}
      <div id="stock-alert-section" className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900">재고 부족 알림</h3>
        </div>
        
        {lowStockItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {lowStockItems.slice(0, 6).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 md:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{item.name}</p>
                  <p className="text-xs md:text-sm text-gray-600">재고: {item.stock}{item.unit}</p>
                </div>
                <span className="px-2 md:px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs md:text-sm font-semibold flex-shrink-0 ml-2">
                  부족
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8">
            <p className="text-gray-500 text-sm md:text-base">모든 품목 재고 충분함! ✅</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;