import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

const Dashboard = ({ setActiveView }) => {
  const [medicines] = useState([
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
  ]);

  // 통계 계산
  const totalItems = medicines.length;
  const lowStockCount = medicines.filter(m => m.stock <= m.lowStockThreshold).length;
  const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0);
  
  // 카테고리별 재고 데이터
  const categoryData = medicines.reduce((acc, med) => {
    const existing = acc.find(item => item.name === med.category);
    if (existing) {
      existing.value += med.stock;
      existing.count += 1;
    } else {
      acc.push({ name: med.category, value: med.stock, count: 1 });
    }
    return acc;
  }, []);

  // 카테고리별 재고 가치
  const categoryValueData = medicines.reduce((acc, med) => {
    const existing = acc.find(item => item.name === med.category);
    const value = med.price * med.stock;
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: med.category, value });
    }
    return acc;
  }, []);

  // 월별 판매 추이 (더미 데이터)
  const salesTrendData = [
    { month: '1월', 판매액: 2400000 },
    { month: '2월', 판매액: 2800000 },
    { month: '3월', 판매액: 3200000 },
    { month: '4월', 판매액: 2900000 },
    { month: '5월', 판매액: 3500000 },
    { month: '6월', 판매액: 3800000 },
  ];

  // 차트 색상
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].name === '판매액' || payload[0].dataKey === 'value' 
              ? `₩${payload[0].value.toLocaleString()}`
              : `${payload[0].value}개`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">약국 재고 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">총 품목</p>
              <p className="text-3xl font-bold mt-2">{totalItems}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">재고 부족</p>
              <p className="text-3xl font-bold mt-2">{lowStockCount}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">총 재고 가치</p>
              <p className="text-2xl font-bold mt-2">₩{(totalValue / 1000000).toFixed(1)}M</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">카테고리</p>
              <p className="text-3xl font-bold mt-2">7</p>
            </div>
            <Activity className="w-12 h-12 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 카테고리별 재고 비율 (파이 차트) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 재고 비율</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 카테고리별 재고 가치 (바 차트) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리별 재고 가치</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryValueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* 월별 판매 추이 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 판매 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="판매액" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 빠른 액션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('inventory')}
          className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 text-left transition-colors"
        >
          <Package className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">재고 관리</h3>
          <p className="text-sm text-gray-500">약품 재고를 확인하고 관리하세요</p>
        </button>

        <button
          onClick={() => setActiveView('checkout')}
          className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 text-left transition-colors"
        >
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">결제 시스템</h3>
          <p className="text-sm text-gray-500">장바구니 확인 및 결제를 진행하세요</p>
        </button>

        <button
          onClick={() => setActiveView('chatbot')}
          className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 text-left transition-colors"
        >
          <Calendar className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">AI 상담</h3>
          <p className="text-sm text-gray-500">의약품 정보를 AI에게 물어보세요</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;