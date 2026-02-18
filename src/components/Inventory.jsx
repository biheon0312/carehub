import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  ShoppingCart,
  Filter,
  Star,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Inventory = ({ highlightedMedicineId, setHighlightedMedicineId }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [medicines, setMedicines] = useState([]);
  const highlightedRef = useRef(null);

  const medicineDatabase = [
    { id: 1, name: '타이레놀 500mg', category: '해열진통제', price: 8500, stock: 45, unit: '정', lowStockThreshold: 20, manufacturer: '한국얀센', expiryDate: '2026-12-31' },
    { id: 2, name: '어린이 타이레놀', category: '해열진통제', price: 12000, stock: 8, unit: '병', lowStockThreshold: 10, manufacturer: '한국얀센', expiryDate: '2026-08-15' },
    { id: 3, name: '게보린', category: '해열진통제', price: 6500, stock: 67, unit: '정', lowStockThreshold: 30, manufacturer: '삼진제약', expiryDate: '2027-03-20' },
    { id: 4, name: '펜잘', category: '해열진통제', price: 5800, stock: 82, unit: '정', lowStockThreshold: 30, manufacturer: '동화약품', expiryDate: '2026-11-10' },
    { id: 5, name: '이지엔6', category: '해열진통제', price: 7200, stock: 15, unit: '정', lowStockThreshold: 20, manufacturer: '한독', expiryDate: '2027-01-25' },
    { id: 6, name: '판피린티정', category: '감기약', price: 9500, stock: 34, unit: '정', lowStockThreshold: 25, manufacturer: '동아제약', expiryDate: '2026-10-05' },
    { id: 7, name: '판콜에이내복액', category: '감기약', price: 8800, stock: 12, unit: '병', lowStockThreshold: 15, manufacturer: '동아제약', expiryDate: '2026-09-18' },
    { id: 8, name: '콜대원', category: '감기약', price: 7500, stock: 56, unit: '정', lowStockThreshold: 30, manufacturer: '대웅제약', expiryDate: '2027-02-14' },
    { id: 9, name: '코푸시럽', category: '감기약', price: 11000, stock: 23, unit: '병', lowStockThreshold: 20, manufacturer: '삼아제약', expiryDate: '2026-12-08' },
    { id: 10, name: '지르텍', category: '감기약', price: 15000, stock: 6, unit: '정', lowStockThreshold: 15, manufacturer: 'UCB', expiryDate: '2027-04-30' },
    { id: 11, name: '베아제', category: '소화제', price: 13500, stock: 41, unit: '정', lowStockThreshold: 25, manufacturer: '종근당', expiryDate: '2026-11-22' },
    { id: 12, name: '닥터베아제', category: '소화제', price: 9800, stock: 29, unit: '정', lowStockThreshold: 20, manufacturer: '종근당', expiryDate: '2027-01-17' },
    { id: 13, name: '활명수', category: '소화제', price: 5500, stock: 73, unit: '병', lowStockThreshold: 30, manufacturer: '동화약품', expiryDate: '2026-08-09' },
    { id: 14, name: '훼스탈플러스', category: '소화제', price: 11200, stock: 18, unit: '정', lowStockThreshold: 20, manufacturer: '한독', expiryDate: '2026-12-25' },
    { id: 15, name: '까스활명수', category: '소화제', price: 6800, stock: 52, unit: '병', lowStockThreshold: 25, manufacturer: '동화약품', expiryDate: '2027-03-11' },
    { id: 16, name: '아목시실린', category: '항생제', price: 18500, stock: 14, unit: '정', lowStockThreshold: 20, manufacturer: '유한양행', expiryDate: '2026-10-15' },
    { id: 17, name: '세파클러', category: '항생제', price: 22000, stock: 9, unit: '정', lowStockThreshold: 15, manufacturer: '종근당', expiryDate: '2026-11-30' },
    { id: 18, name: '클라리스', category: '항생제', price: 25000, stock: 7, unit: '정', lowStockThreshold: 12, manufacturer: '한미약품', expiryDate: '2027-01-08' },
    { id: 19, name: '아지트로마이신', category: '항생제', price: 19800, stock: 11, unit: '정', lowStockThreshold: 15, manufacturer: '대웅제약', expiryDate: '2026-09-22' },
    { id: 20, name: '신신파스', category: '파스/연고', price: 4500, stock: 95, unit: '매', lowStockThreshold: 40, manufacturer: '신신제약', expiryDate: '2027-06-30' },
    { id: 21, name: '제일쿨파스', category: '파스/연고', price: 5200, stock: 68, unit: '매', lowStockThreshold: 35, manufacturer: '제일약품', expiryDate: '2027-05-18' },
    { id: 22, name: '마데카솔', category: '파스/연고', price: 8900, stock: 37, unit: '개', lowStockThreshold: 25, manufacturer: '동국제약', expiryDate: '2026-12-12' },
    { id: 23, name: '후시딘', category: '파스/연고', price: 12000, stock: 24, unit: '개', lowStockThreshold: 20, manufacturer: '동화약품', expiryDate: '2027-02-28' },
    { id: 24, name: '센트룸', category: '비타민/영양제', price: 32000, stock: 19, unit: '병', lowStockThreshold: 15, manufacturer: '한국화이자', expiryDate: '2027-08-15' },
    { id: 25, name: '비맥스', category: '비타민/영양제', price: 28000, stock: 26, unit: '병', lowStockThreshold: 20, manufacturer: 'CJ', expiryDate: '2027-07-22' },
    { id: 26, name: '종근당 락토핏', category: '비타민/영양제', price: 35000, stock: 13, unit: '병', lowStockThreshold: 15, manufacturer: '종근당', expiryDate: '2027-06-10' },
    { id: 27, name: '알티비타민', category: '비타민/영양제', price: 15000, stock: 44, unit: '정', lowStockThreshold: 25, manufacturer: '광동제약', expiryDate: '2027-09-05' },
    { id: 28, name: '하이알', category: '안약', price: 9800, stock: 31, unit: '병', lowStockThreshold: 20, manufacturer: '삼일제약', expiryDate: '2026-11-18' },
    { id: 29, name: '인공눈물', category: '안약', price: 7500, stock: 48, unit: '병', lowStockThreshold: 25, manufacturer: '태준제약', expiryDate: '2027-01-30' },
    { id: 30, name: '비타민아이', category: '안약', price: 11200, stock: 22, unit: '병', lowStockThreshold: 18, manufacturer: '한국알콘', expiryDate: '2026-10-25' },
  ];

  useEffect(() => {
    setMedicines(medicineDatabase);
    
    const interval = setInterval(() => {
      checkLowStock();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (highlightedMedicineId && highlightedRef.current) {
      setTimeout(() => {
        highlightedRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);

      const timer = setTimeout(() => {
        if (setHighlightedMedicineId) {
          setHighlightedMedicineId(null);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [highlightedMedicineId]);

  const checkLowStock = () => {
    const lowStockItems = medicines.filter(m => m.stock <= m.lowStockThreshold);
    if (lowStockItems.length > 0) {
      toast({
        title: '⚠️ 재고 부족 알림',
        description: `${lowStockItems.length}개 품목의 재고가 부족합니다.`,
        variant: 'destructive'
      });
    }
  };

  const handleAddToCart = (medicine) => {
    if (medicine.stock <= 0) {
      toast({
        title: '재고 없음',
        description: `${medicine.name}의 재고가 없습니다.`,
        variant: 'destructive'
      });
      return;
    }

    const cartItem = {
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      unit: medicine.unit,
      manufacturer: medicine.manufacturer
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.id === medicine.id);

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));

    toast({
      title: '✅ 장바구니 추가',
      description: `${medicine.name}이(가) 장바구니에 추가되었습니다.`,
    });

    setMedicines(prev => 
      prev.map(m => 
        m.id === medicine.id 
          ? { ...m, stock: m.stock - 1 } 
          : m
      )
    );
  };

  // 🆕 엑셀 내보내기 함수
  const handleExportToExcel = () => {
    const excelData = medicines.map(med => ({
      '약품명': med.name,
      '카테고리': med.category,
      '제조사': med.manufacturer,
      '재고': med.stock,
      '단위': med.unit,
      '단가': med.price,
      '재고가치': med.price * med.stock,
      '최소재고': med.lowStockThreshold,
      '유효기한': med.expiryDate,
      '재고상태': med.stock <= med.lowStockThreshold ? '부족' : '정상'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    
    ws['!cols'] = [
      { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 8 },
      { wch: 6 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
      { wch: 12 }, { wch: 10 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '재고현황');

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `약국재고_${today}.xlsx`);

    toast({
      title: '✅ 엑셀 다운로드 완료',
      description: `${medicines.length}개 품목이 저장되었습니다.`,
    });
  };

  const categories = ['all', '해열진통제', '감기약', '소화제', '항생제', '파스/연고', '비타민/영양제', '안약'];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || medicine.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    if (a.id === highlightedMedicineId) return -1;
    if (b.id === highlightedMedicineId) return 1;
    return 0;
  });

  const lowStockCount = medicines.filter(m => m.stock <= m.lowStockThreshold).length;
  const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">총 품목</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{medicines.length}</p>
            </div>
            <Package className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">재고 부족</p>
              <p className="text-xl md:text-2xl font-bold text-red-600">{lowStockCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">총 재고 가치</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">
                ₩{totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">카테고리</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">{categories.length - 1}</p>
            </div>
            <Filter className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="약품명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? '전체 카테고리' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🆕 엑셀 다운로드 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
        >
          <Download className="w-4 h-4" />
          엑셀로 내보내기
        </Button>
      </div>

      {/* 약품 목록 - 모바일: 카드, 데스크탑: 테이블 */}
      
      {/* 모바일 카드 뷰 */}
      <div className="lg:hidden space-y-3">
        {sortedMedicines.map((medicine, index) => {
          const isHighlighted = medicine.id === highlightedMedicineId;
          
          return (
            <motion.div
              key={medicine.id}
              ref={isHighlighted ? highlightedRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                backgroundColor: isHighlighted ? '#FEF3C7' : '#FFFFFF'
              }}
              transition={{ 
                delay: index * 0.05,
                backgroundColor: { duration: 0.5 }
              }}
              className={`bg-white rounded-lg border p-4 shadow-sm ${
                isHighlighted ? 'ring-2 ring-yellow-400' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isHighlighted && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm">{medicine.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex-shrink-0">
                  {medicine.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">재고</p>
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${
                      medicine.stock <= medicine.lowStockThreshold 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {medicine.stock}{medicine.unit}
                    </span>
                    {medicine.stock <= medicine.lowStockThreshold && (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">단가</p>
                  <p className="font-semibold text-gray-900">₩{medicine.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">유효: {medicine.expiryDate}</p>
                <Button
                  onClick={() => handleAddToCart(medicine)}
                  disabled={medicine.stock <= 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  size="sm"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  담기
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 데스크탑 테이블 뷰 */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">약품명</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">제조사</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">재고</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">단가</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">유효기한</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedMedicines.map((medicine, index) => {
                const isHighlighted = medicine.id === highlightedMedicineId;
                
                return (
                  <motion.tr
                    key={medicine.id}
                    ref={isHighlighted ? highlightedRef : null}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      backgroundColor: isHighlighted ? '#FEF3C7' : '#FFFFFF'
                    }}
                    transition={{ 
                      delay: index * 0.05,
                      backgroundColor: { duration: 0.5 }
                    }}
                    className={`hover:bg-gray-50 ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isHighlighted && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                        )}
                        <div className="font-medium text-gray-900">{medicine.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {medicine.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {medicine.manufacturer}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          medicine.stock <= medicine.lowStockThreshold 
                            ? 'text-red-600' 
                            : 'text-green-600'
                        }`}>
                          {medicine.stock}{medicine.unit}
                        </span>
                        {medicine.stock <= medicine.lowStockThreshold && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₩{medicine.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {medicine.expiryDate}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleAddToCart(medicine)}
                        disabled={medicine.stock <= 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        담기
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;