import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const EditMedicineDialog = ({ isOpen, onClose, medicine, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    price: '',
    expiryDate: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        category: medicine.category,
        quantity: medicine.quantity.toString(),
        minStock: medicine.minStock.toString(),
        price: medicine.price.toString(),
        expiryDate: medicine.expiryDate
      });
    }
  }, [medicine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const inventory = JSON.parse(localStorage.getItem('pharmacyInventory') || '[]');
    const updatedInventory = inventory.map(item => 
      item.id === medicine.id 
        ? {
            ...item,
            ...formData,
            quantity: parseInt(formData.quantity),
            minStock: parseInt(formData.minStock),
            price: parseFloat(formData.price)
          }
        : item
    );
    
    localStorage.setItem('pharmacyInventory', JSON.stringify(updatedInventory));
    
    toast({
      title: "수정 완료",
      description: "의약품 정보가 성공적으로 업데이트되었습니다."
    });
    
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-xl">의약품 정보 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="edit-name" className="text-gray-700">의약품명</Label>
            <input
              id="edit-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="edit-category" className="text-gray-700">카테고리</Label>
            <input
              id="edit-category"
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-quantity" className="text-gray-700">수량</Label>
              <input
                id="edit-quantity"
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-minStock" className="text-gray-700">최소 재고</Label>
              <input
                id="edit-minStock"
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
              <Label htmlFor="edit-price" className="text-gray-700">가격 ($)</Label>
              <input
                id="edit-price"
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
              <Label htmlFor="edit-expiryDate" className="text-gray-700">유효기간</Label>
              <input
                id="edit-expiryDate"
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
              정보 수정 완료
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineDialog; 