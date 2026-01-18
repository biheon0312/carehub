import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Search, LogOut, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LoginDialog from '@/components/LoginDialog';
import { medicineDatabase } from '../data/medicines';

const Header = ({ isLoggedIn, user, onLogin, onLogout, setActiveView, setHighlightedMedicineId }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  const notifications = [
    { id: 1, type: 'alert', message: '타이레놀 재고가 부족합니다 (5개 남음)', time: '10분 전' },
    { id: 2, type: 'order', message: '새로운 주문이 접수되었습니다', time: '30분 전' },
    { id: 3, type: 'info', message: '시스템 점검이 예정되어 있습니다', time: '2시간 전' },
  ];

  // 검색 결과 필터링
  const searchResults = searchQuery.trim()
    ? medicineDatabase.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(e.target.value.trim().length > 0);
  };

  const handleSearchSelect = (medicine) => {
    toast({
      title: '약품 선택됨',
      description: `${medicine.name}을(를) 확인합니다.`,
    });
    setSearchQuery('');
    setIsSearchOpen(false);
    
    // 선택된 약품 ID를 Inventory로 전달
    if (setHighlightedMedicineId) {
      setHighlightedMedicineId(medicine.id);
    }
    
    // 재고 관리 페이지로 이동
    if (setActiveView) {
      setActiveView('inventory');
    }
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
    } else {
      toast({
        title: `현재 로그인: ${user.name}`,
        description: '계정 관리 페이지로 이동합니다.',
      });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* 🔹 LEFT : LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CH</span>
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-gray-900">Care Hub</h1>
              <p className="text-xs text-gray-500">통합 약국 관리 시스템</p>
            </div>
          </div>

          {/* 🔹 CENTER : SEARCH */}
          <div className="flex-1 max-w-xl mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="타이레놀..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* 검색 결과 드롭다운 */}
            <AnimatePresence>
              {isSearchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <p className="text-sm font-semibold text-gray-700">
                      검색 결과 {searchResults.length}개
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((medicine) => (
                      <motion.div
                        key={medicine.id}
                        whileHover={{ backgroundColor: '#EFF6FF' }}
                        onClick={() => handleSearchSelect(medicine)}
                        className="p-4 border-b border-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{medicine.name}</p>
                              <p className="text-xs text-gray-500">
                                {medicine.category} · {medicine.manufacturer}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">₩{medicine.price.toLocaleString()}</p>
                            <div className="flex items-center gap-1">
                              {medicine.stock <= medicine.lowStockThreshold && (
                                <AlertTriangle className="w-3 h-3 text-orange-500" />
                              )}
                              <p className="text-xs text-gray-500">재고: {medicine.stock}{medicine.unit}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {isSearchOpen && searchResults.length === 0 && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center z-50"
                >
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm text-gray-400 mt-1">다른 키워드로 검색해보세요</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 검색창 외부 클릭 시 닫기 */}
            {isSearchOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSearchOpen(false)}
              />
            )}
          </div>

          {/* 🔹 RIGHT : ACTIONS */}
          <div className="flex items-center gap-3">
            
            {/* 알림 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative hover:bg-blue-50"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </Button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50"
                  >
                    <div className="p-3 border-b bg-gray-50 font-semibold text-sm">
                      알림 센터
                    </div>
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 border-b hover:bg-blue-50">
                        <p className="text-sm font-medium">{n.message}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 로그인 / 로그아웃 */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}님</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleUserClick}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <User className="w-4 h-4 mr-2" />
                로그인
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={onLogin}
      />
    </>
  );
};

export default Header;