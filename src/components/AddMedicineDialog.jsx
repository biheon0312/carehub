import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { addMedicine } from '@/lib/medicineService';

const AddMedicineDialog = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    lowStockThreshold: '',
    price: '',
    expiryDate: '',
    manufacturer: '',
    unit: '정'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newMedicine = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      price: parseFloat(formData.price),
      expiryDate: formData.expiryDate,
      manufacturer: formData.manufacturer,
      unit: formData.unit
    };
    
    const result = await addMedicine(newMedicine);
    
    if (result.success) {
      toast({
        title: "✅ 의약품 추가 성공",
        description: "새로운 의약품이 재고 목록에 추가되었습니다."
      });
      
      setFormData({
        name: '',
        category: '',
        stock: '',
        lowStockThreshold: '',
        price: '',
        expiryDate: '',
        manufacturer: '',
        unit: '정'
      });
      
      if (onAdd) onAdd();
      onClose();
    } else {
      toast({
        title: "❌ 추가 실패",
        description: "의약품 추가 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-xl">새 의약품 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name" className="text-gray-700">의약품명 *</Label>
            <input
              id="name"
              type="text"
              required
              placeholder="예: 타이레놀 500mg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-gray-700">카테고리 *</Label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="해열진통제">해열진통제</option>
                <option value="감기약">감기약</option>
                <option value="소화제">소화제</option>
                <option value="항생제">항생제</option>
                <option value="파스/연고">파스/연고</option>
                <option value="비타민/영양제">비타민/영양제</option>
                <option value="안약">안약</option>
              </select>
            </div>
            <div>
              <Label htmlFor="manufacturer" className="text-gray-700">제조사 *</Label>
              <input
                id="manufacturer"
                type="text"
                required
                placeholder="예: 한국얀센"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stock" className="text-gray-700">재고 수량 *</Label>
              <input
                id="stock"
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="lowStockThreshold" className="text-gray-700">최소 재고 *</Label>
              <input
                id="lowStockThreshold"
                type="number"
                required
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="unit" className="text-gray-700">단위 *</Label>
              <select
                id="unit"
                required
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="정">정</option>
                <option value="병">병</option>
                <option value="개">개</option>
                <option value="매">매</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-gray-700">가격 (₩) *</Label>
              <input
                id="price"
                type="number"
                step="100"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="expiryDate" className="text-gray-700">유효기한 *</Label>
              <input
                id="expiryDate"
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="hover:bg-gray-100"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? '추가 중...' : '의약품 추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineDialog;