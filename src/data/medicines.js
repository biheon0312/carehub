export const medicineDatabase = [
  // 해열진통제
  { id: 1, name: '타이레놀 500mg', category: '해열진통제', price: 8500, stock: 45, unit: '정', lowStockThreshold: 20, manufacturer: '한국얀센', expiryDate: '2026-12-31' },
  { id: 2, name: '어린이 타이레놀', category: '해열진통제', price: 12000, stock: 8, unit: '병', lowStockThreshold: 10, manufacturer: '한국얀센', expiryDate: '2026-08-15' },
  { id: 3, name: '게보린', category: '해열진통제', price: 6500, stock: 67, unit: '정', lowStockThreshold: 30, manufacturer: '삼진제약', expiryDate: '2027-03-20' },
  { id: 4, name: '펜잘', category: '해열진통제', price: 5800, stock: 82, unit: '정', lowStockThreshold: 30, manufacturer: '동화약품', expiryDate: '2026-11-10' },
  { id: 5, name: '이지엔6', category: '해열진통제', price: 7200, stock: 15, unit: '정', lowStockThreshold: 20, manufacturer: '한독', expiryDate: '2027-01-25' },
  
  // 감기약
  { id: 6, name: '판피린티정', category: '감기약', price: 9500, stock: 34, unit: '정', lowStockThreshold: 25, manufacturer: '동아제약', expiryDate: '2026-10-05' },
  { id: 7, name: '판콜에이내복액', category: '감기약', price: 8800, stock: 12, unit: '병', lowStockThreshold: 15, manufacturer: '동아제약', expiryDate: '2026-09-18' },
  { id: 8, name: '콜대원', category: '감기약', price: 7500, stock: 56, unit: '정', lowStockThreshold: 30, manufacturer: '대웅제약', expiryDate: '2027-02-14' },
  { id: 9, name: '코푸시럽', category: '감기약', price: 11000, stock: 23, unit: '병', lowStockThreshold: 20, manufacturer: '삼아제약', expiryDate: '2026-12-08' },
  { id: 10, name: '지르텍', category: '감기약', price: 15000, stock: 6, unit: '정', lowStockThreshold: 15, manufacturer: 'UCB', expiryDate: '2027-04-30' },

  // 소화제
  { id: 11, name: '베아제', category: '소화제', price: 13500, stock: 41, unit: '정', lowStockThreshold: 25, manufacturer: '종근당', expiryDate: '2026-11-22' },
  { id: 12, name: '닥터베아제', category: '소화제', price: 9800, stock: 29, unit: '정', lowStockThreshold: 20, manufacturer: '종근당', expiryDate: '2027-01-17' },
  { id: 13, name: '활명수', category: '소화제', price: 5500, stock: 73, unit: '병', lowStockThreshold: 30, manufacturer: '동화약품', expiryDate: '2026-08-09' },
  { id: 14, name: '훼스탈플러스', category: '소화제', price: 11200, stock: 18, unit: '정', lowStockThreshold: 20, manufacturer: '한독', expiryDate: '2026-12-25' },
  { id: 15, name: '까스활명수', category: '소화제', price: 6800, stock: 52, unit: '병', lowStockThreshold: 25, manufacturer: '동화약품', expiryDate: '2027-03-11' },

  // 항생제
  { id: 16, name: '아목시실린', category: '항생제', price: 18500, stock: 14, unit: '정', lowStockThreshold: 20, manufacturer: '유한양행', expiryDate: '2026-10-15' },
  { id: 17, name: '세파클러', category: '항생제', price: 22000, stock: 9, unit: '정', lowStockThreshold: 15, manufacturer: '종근당', expiryDate: '2026-11-30' },
  { id: 18, name: '클라리스', category: '항생제', price: 25000, stock: 7, unit: '정', lowStockThreshold: 12, manufacturer: '한미약품', expiryDate: '2027-01-08' },
  { id: 19, name: '아지트로마이신', category: '항생제', price: 19800, stock: 11, unit: '정', lowStockThreshold: 15, manufacturer: '대웅제약', expiryDate: '2026-09-22' },

  // 파스/연고
  { id: 20, name: '신신파스', category: '파스/연고', price: 4500, stock: 95, unit: '매', lowStockThreshold: 40, manufacturer: '신신제약', expiryDate: '2027-06-30' },
  { id: 21, name: '제일쿨파스', category: '파스/연고', price: 5200, stock: 68, unit: '매', lowStockThreshold: 35, manufacturer: '제일약품', expiryDate: '2027-05-18' },
  { id: 22, name: '마데카솔', category: '파스/연고', price: 8900, stock: 37, unit: '개', lowStockThreshold: 25, manufacturer: '동국제약', expiryDate: '2026-12-12' },
  { id: 23, name: '후시딘', category: '파스/연고', price: 12000, stock: 24, unit: '개', lowStockThreshold: 20, manufacturer: '동화약품', expiryDate: '2027-02-28' },

  // 비타민/영양제
  { id: 24, name: '센트룸', category: '비타민/영양제', price: 32000, stock: 19, unit: '병', lowStockThreshold: 15, manufacturer: '한국화이자', expiryDate: '2027-08-15' },
  { id: 25, name: '비맥스', category: '비타민/영양제', price: 28000, stock: 26, unit: '병', lowStockThreshold: 20, manufacturer: 'CJ', expiryDate: '2027-07-22' },
  { id: 26, name: '종근당 락토핏', category: '비타민/영양제', price: 35000, stock: 13, unit: '병', lowStockThreshold: 15, manufacturer: '종근당', expiryDate: '2027-06-10' },
  { id: 27, name: '알티비타민', category: '비타민/영양제', price: 15000, stock: 44, unit: '정', lowStockThreshold: 25, manufacturer: '광동제약', expiryDate: '2027-09-05' },

  // 안약
  { id: 28, name: '하이알', category: '안약', price: 9800, stock: 31, unit: '병', lowStockThreshold: 20, manufacturer: '삼일제약', expiryDate: '2026-11-18' },
  { id: 29, name: '인공눈물', category: '안약', price: 7500, stock: 48, unit: '병', lowStockThreshold: 25, manufacturer: '태준제약', expiryDate: '2027-01-30' },
  { id: 30, name: '비타민아이', category: '안약', price: 11200, stock: 22, unit: '병', lowStockThreshold: 18, manufacturer: '한국알콘', expiryDate: '2026-10-25' },
];