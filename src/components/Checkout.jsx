import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Checkout = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast({
      title: '상품 제거',
      description: '장바구니에서 상품이 제거되었습니다.',
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', '[]');
    toast({
      title: '장바구니 비우기',
      description: '모든 상품이 제거되었습니다.',
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    const total = calculateTotal();
    return total >= 30000 ? 0 : 3000;
  };

  const getFinalTotal = () => {
    return calculateTotal() + calculateDeliveryFee();
  };

  // 토스페이 결제
  const handleTossPayment = async () => {
    if (!validateCustomerInfo()) return;

    setIsProcessing(true);

    try {
      // 실제로는 토스페이 SDK를 사용해야 합니다
      // https://docs.tosspayments.com/guides/payment-widget/integration
      
      toast({
        title: '🔄 결제 진행 중',
        description: '토스페이 결제창으로 이동합니다...',
      });

      // 시뮬레이션: 3초 후 결제 완료
      setTimeout(() => {
        completeOrder('토스페이');
      }, 3000);

      // 실제 토스페이 연동 코드 (주석 처리)
      /*
      const tossPayments = TossPayments('YOUR_CLIENT_KEY');
      await tossPayments.requestPayment('카드', {
        amount: getFinalTotal(),
        orderId: `ORDER_${Date.now()}`,
        orderName: `${cartItems[0].name} 외 ${cartItems.length - 1}건`,
        customerName: customerInfo.name,
        successUrl: window.location.origin + '/payment/success',
        failUrl: window.location.origin + '/payment/fail',
      });
      */

    } catch (error) {
      setIsProcessing(false);
      toast({
        title: '❌ 결제 실패',
        description: '결제 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 카카오페이 결제
  const handleKakaoPayment = async () => {
    if (!validateCustomerInfo()) return;

    setIsProcessing(true);

    try {
      toast({
        title: '🔄 결제 진행 중',
        description: '카카오페이 결제창으로 이동합니다...',
      });

      // 시뮬레이션: 3초 후 결제 완료
      setTimeout(() => {
        completeOrder('카카오페이');
      }, 3000);

      // 실제 카카오페이 연동 코드 (주석 처리)
      /*
      const response = await fetch('/api/kakao-pay/ready', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cid: 'TC0ONETIME',
          partner_order_id: `ORDER_${Date.now()}`,
          partner_user_id: customerInfo.phone,
          item_name: `${cartItems[0].name} 외 ${cartItems.length - 1}건`,
          quantity: cartItems.length,
          total_amount: getFinalTotal(),
          tax_free_amount: 0,
          approval_url: window.location.origin + '/payment/success',
          cancel_url: window.location.origin + '/payment/cancel',
          fail_url: window.location.origin + '/payment/fail',
        })
      });
      
      const data = await response.json();
      window.location.href = data.next_redirect_pc_url;
      */

    } catch (error) {
      setIsProcessing(false);
      toast({
        title: '❌ 결제 실패',
        description: '결제 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const validateCustomerInfo = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: '⚠️ 정보 입력 필요',
        description: '고객 정보를 모두 입력해주세요.',
        variant: 'destructive'
      });
      return false;
    }

    if (!paymentMethod) {
      toast({
        title: '⚠️ 결제 방법 선택',
        description: '결제 방법을 선택해주세요.',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const completeOrder = (method) => {
    setIsProcessing(false);
    setOrderComplete(true);
    
    toast({
      title: '✅ 결제 완료!',
      description: `${method}로 결제가 완료되었습니다.`,
    });

    // 주문 내역 저장
    const order = {
      orderId: `ORD${Date.now()}`,
      items: cartItems,
      customer: customerInfo,
      paymentMethod: method,
      total: getFinalTotal(),
      date: new Date().toLocaleString('ko-KR'),
      status: '결제완료'
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // 장바구니 비우기
    setTimeout(() => {
      clearCart();
      setOrderComplete(false);
      setCustomerInfo({ name: '', phone: '', address: '' });
      setPaymentMethod('');
    }, 3000);
  };

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl shadow-lg p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">결제가 완료되었습니다!</h2>
        <p className="text-gray-600 mb-8">주문 내역은 대시보드에서 확인하실 수 있습니다.</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-2">주문번호</p>
            <p className="text-2xl font-bold text-green-900">ORD{Date.now()}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 왼쪽: 장바구니 */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">장바구니</h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {cartItems.length}개
              </span>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                전체 삭제
              </Button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">장바구니가 비어있습니다</p>
              <p className="text-gray-400 text-sm mt-2">재고 관리에서 상품을 추가해보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.manufacturer}</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        ₩{item.price.toLocaleString()} / {item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-bold text-gray-900">
                        ₩{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 고객 정보 */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">배송 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배송 주소 *
                </label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  placeholder="서울시 강남구 테헤란로 123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 오른쪽: 결제 정보 */}
      <div className="space-y-4">
        {cartItems.length > 0 && (
          <>
            {/* 주문 요약 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">주문 요약</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span className="font-semibold">₩{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span className="font-semibold">
                    {calculateDeliveryFee() === 0 ? '무료' : `₩${calculateDeliveryFee().toLocaleString()}`}
                  </span>
                </div>
                {calculateTotal() < 30000 && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    ₩{(30000 - calculateTotal()).toLocaleString()} 더 구매하시면 무료배송!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>총 결제금액</span>
                  <span className="text-blue-600">₩{getFinalTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* 결제 방법 선택 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">결제 방법</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod('toss')}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'toss'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">토스페이</p>
                      <p className="text-xs text-gray-500">간편 결제</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('kakao')}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'kakao'
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-gray-900" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">카카오페이</p>
                      <p className="text-xs text-gray-500">간편 결제</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 결제 버튼 */}
              <Button
                onClick={paymentMethod === 'toss' ? handleTossPayment : handleKakaoPayment}
                disabled={!paymentMethod || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ₩{getFinalTotal().toLocaleString()} 결제하기
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                결제 시 개인정보 처리방침 및 이용약관에 동의하게 됩니다.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;