import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Star, Package, X, Search, Filter } from 'lucide-react';

const PharmacyMap = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');

  const pharmacies = [
    {
      id: 1,
      name: '서울 강남 창고형약국',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      hours: '평일 09:00-22:00 / 주말 10:00-20:00',
      region: '서울',
      rating: 4.8,
      inventory: [
        { name: '타이레놀 500mg', stock: 450, price: 8500 },
        { name: '게보린', stock: 320, price: 6500 },
        { name: '베아제', stock: 410, price: 13500 },
      ]
    },
    {
      id: 2,
      name: '부산 해운대 창고형약국',
      address: '부산광역시 해운대구 우동 1234',
      phone: '051-2345-6789',
      hours: '평일 09:00-21:00 / 주말 10:00-19:00',
      region: '부산',
      rating: 4.6,
      inventory: [
        { name: '타이레놀 500mg', stock: 380, price: 8500 },
        { name: '콜대원', stock: 290, price: 7500 },
      ]
    },
    {
      id: 3,
      name: '인천 송도 창고형약국',
      address: '인천광역시 연수구 송도동 567',
      phone: '032-3456-7890',
      hours: '평일 08:30-22:00 / 주말 09:00-20:00',
      region: '인천',
      rating: 4.7,
      inventory: [
        { name: '활명수', stock: 530, price: 5500 },
        { name: '마데카솔', stock: 370, price: 8900 },
      ]
    },
    {
      id: 4,
      name: '대구 수성 창고형약국',
      address: '대구광역시 수성구 범어동 890',
      phone: '053-4567-8901',
      hours: '평일 09:00-21:00 / 주말 10:00-19:00',
      region: '대구',
      rating: 4.5,
      inventory: [
        { name: '펜잘', stock: 420, price: 5800 },
        { name: '지르텍', stock: 150, price: 15000 },
      ]
    },
    {
      id: 5,
      name: '광주 상무 창고형약국',
      address: '광주광역시 서구 상무대로 456',
      phone: '062-5678-9012',
      hours: '평일 09:00-22:00 / 주말 10:00-20:00',
      region: '광주',
      rating: 4.9,
      inventory: [
        { name: '이지엔6', stock: 350, price: 7200 },
        { name: '까스활명수', stock: 490, price: 6800 },
      ]
    },
    {
      id: 6,
      name: '대전 둔산 창고형약국',
      address: '대전광역시 서구 둔산동 789',
      phone: '042-6789-0123',
      hours: '평일 08:30-21:30 / 주말 09:00-19:00',
      region: '대전',
      rating: 4.6,
      inventory: [
        { name: '타이레놀 500mg', stock: 390, price: 8500 },
        { name: '센트룸', stock: 170, price: 32000 },
      ]
    }
  ];

  const regions = ['all', '서울', '부산', '인천', '대구', '광주', '대전'];

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || pharmacy.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">전국 창고형 약국</h1>
        <p className="text-blue-100">전국 {pharmacies.length}개 약국의 실시간 재고 정보를 확인하세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="약국명 또는 주소로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[150px]"
            >
              {regions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? '전체 지역' : region}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          검색 결과: <span className="font-semibold text-blue-600">{filteredPharmacies.length}개</span> 약국
        </div>
      </div>

      {/* 선택된 약국 상세 정보 */}
      <AnimatePresence>
        {selectedPharmacy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl border-2 border-blue-300 p-8 relative"
          >
            <button
              onClick={() => setSelectedPharmacy(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedPharmacy.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  전체 보유 재고
                </h3>
                <div className="space-y-2">
                  {selectedPharmacy.inventory.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">재고: {item.stock}개</p>
                      </div>
                      <p className="font-bold text-blue-600">₩{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">약국 정보</h3>
                <div className="bg-white rounded-lg p-4 space-y-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-gray-700">{selectedPharmacy.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <p className="text-gray-700">{selectedPharmacy.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <p className="text-gray-700">{selectedPharmacy.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 약국 목록 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPharmacies.map((pharmacy, index) => (
          <motion.div
            key={pharmacy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedPharmacy(pharmacy)}
            className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 ${
              selectedPharmacy?.id === pharmacy.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pharmacy.name}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {pharmacy.region}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                <span className="text-sm font-semibold text-yellow-700">{pharmacy.rating}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{pharmacy.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{pharmacy.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-gray-600 text-xs">{pharmacy.hours}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">보유 재고</span>
                </div>
                <span className="text-sm text-gray-500">{pharmacy.inventory.length}개</span>
              </div>
              <div className="space-y-2">
                {pharmacy.inventory.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-semibold text-blue-600">₩{item.price.toLocaleString()}</span>
                  </div>
                ))}
                {pharmacy.inventory.length > 2 && (
                  <p className="text-xs text-gray-500 text-center">+{pharmacy.inventory.length - 2}개 더보기</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPharmacies.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-600">검색 결과가 없습니다</p>
          <p className="text-gray-500 mt-2">다른 검색어를 시도해보세요</p>
        </div>
      )}
    </div>
  );
};

export default PharmacyMap;