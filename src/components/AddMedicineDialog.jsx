import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AddMedicineDialog = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    price: '',
    expiryDate: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const inventory = JSON.parse(localStorage.getItem('pharmacyInventory') || '[]');
    const newMedicine = {
      id: Date.now(),
      ...formData,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      price: parseFloat(formData.price)
    };
    
    inventory.push(newMedicine);
    localStorage.setItem('pharmacyInventory', JSON.stringify(inventory));
    
    toast({
      title: "의약품 추가 성공",
      description: "새로운 의약품이 재고 목록에 추가되었습니다."
    });
    
    setFormData({
      name: '',
      category: '',
      quantity: '',
      minStock: '',
      price: '',
      expiryDate: ''
    });
    
    onAdd();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-xl">새 의약품 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name" className="text-gray-700">의약품명</Label>
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
          <div>
            <Label htmlFor="category" className="text-gray-700">카테고리</Label>
            <input
              id="category"
              type="text"
              required
              placeholder="예: 진통제"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity" className="text-gray-700">수량</Label>
              <input
                id="quantity"
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="minStock" className="text-gray-700">최소 재고(알림용)</Label>
              <input
                id="minStock"
                type="number"
                required
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-gray-700">가격 ($)</Label>
              <input
                id="price"
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="expiryDate" className="text-gray-700">유효기간</Label>
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
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-gray-100">
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              의약품 추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineDialog;