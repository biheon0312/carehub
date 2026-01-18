import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';

const LoginDialog = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: '관리자',
        email: email
      });
      toast({
        title: "로그인 성공",
        description: "환영합니다, 관리자님!"
      });
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
    }, 1000);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: `${provider} 사용자`,
        email: `user@${provider.toLowerCase()}.com`
      });
      toast({
        title: `${provider} 로그인 성공`,
        description: `${provider} 계정으로 로그인되었습니다.`
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-900">Care Hub 로그인</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
           {/* Naver Login Button */}
           <button 
            type="button"
            onClick={() => handleSocialLogin('Naver')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#03C75A] hover:bg-[#02b351] text-white font-medium transition-colors"
          >
            <span className="font-bold text-lg">N</span>
            <span>네이버로 로그인</span>
          </button>

          {/* Kakao Login Button */}
          <button 
            type="button"
            onClick={() => handleSocialLogin('Kakao')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FEE500] hover:bg-[#fdd800] text-[#000000] font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.58 3 4 5.79 4 9.24C4 11.33 5.37 13.2 7.56 14.29L6.68 17.52C6.6 17.81 6.94 18.06 7.21 17.88L11.08 15.3C11.38 15.32 11.69 15.33 12 15.33C16.42 15.33 20 12.54 20 9.09C20 5.64 16.42 3 12 3Z" />
            </svg>
            <span>카카오로 로그인</span>
          </button>

          {/* Google Login Button */}
          <button 
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google로 로그인</span>
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">또는 이메일로 로그인</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <input
              id="email"
              type="email"
              placeholder="pharmacist@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              "로그인 중..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> 이메일로 로그인
              </span>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            테스트용 계정: 아무 이메일이나 입력하세요
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;