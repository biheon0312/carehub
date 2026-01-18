import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CreditCard, Building, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaymentDialog = ({ isOpen, onClose, cart, total, patientName, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const { toast } = useToast();

  const handlePayment = (e) => {
    e.preventDefault();

    // Update inventory
    const inventory = JSON.parse(localStorage.getItem('pharmacyInventory') || '[]');
    const updatedInventory = inventory.map(item => {
      const cartItem = cart.find(c => c.id === item.id);
      if (cartItem) {
        return { ...item, quantity: item.quantity - cartItem.quantity };
      }
      return item;
    });
    localStorage.setItem('pharmacyInventory', JSON.stringify(updatedInventory));

    // Save order
    const orders = JSON.parse(localStorage.getItem('pharmacyOrders') || '[]');
    const newOrder = {
      id: Date.now(),
      patientName,
      items: cart,
      total,
      paymentMethod,
      date: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem('pharmacyOrders', JSON.stringify(orders));

    toast({
      title: "결제 완료!",
      description: "주문이 성공적으로 처리되었습니다."
    });

    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold text-xl">결제 진행</DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">구매자(환자):</span>
              <span className="font-semibold text-gray-900">{patientName}</span>
            </div>
            <div className="my-2 border-t border-blue-100"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 결제 금액:</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <Label className="text-gray-700 mb-2 block font-medium">결제 수단 선택</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600' 
                    : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                신용카드
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'bank' 
                    ? 'border-blue-600 bg-blue-50 text-blue-600 ring-1 ring-blue-600' 
                    : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <Building className="w-5 h-5" />
                계좌이체
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-gray-700">카드 번호</Label>
            <input
              id="cardNumber"
              type="text"
              required
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength="19"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-gray-700">유효기간</Label>
              <input
                id="expiryDate"
                type="text"
                required
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength="5"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="text-gray-700">CVC/CVV</Label>
              <input
                id="cvv"
                type="password"
                required
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength="3"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-gray-100">
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Wallet className="w-4 h-4 mr-2" />
              ${total.toFixed(2)} 결제하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;