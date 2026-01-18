import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, MessageSquare, Minimize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { medicineDatabase } from '../data/medicines';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "안녕하세요! Care Hub AI입니다. 😊\n\nGoogle Gemini로 구동됩니다.\n증상을 말씀해주시면 딱 맞는 약을 추천해드릴게요!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const dragConstraintsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const callGeminiAPI = async (userMessage) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCpRgZED7wefnOK7RBOAKdUC5JM8F4wNEM';
    
    // 카테고리별 약품 (재고 있는 것만)
    const categorizedMeds = {
      '해열진통제': medicineDatabase.filter(m => m.category === '해열진통제' && m.stock > 0),
      '감기약': medicineDatabase.filter(m => m.category === '감기약' && m.stock > 0),
      '소화제': medicineDatabase.filter(m => m.category === '소화제' && m.stock > 0),
      '항생제': medicineDatabase.filter(m => m.category === '항생제' && m.stock > 0),
      '파스/연고': medicineDatabase.filter(m => m.category === '파스/연고' && m.stock > 0),
      '비타민/영양제': medicineDatabase.filter(m => m.category === '비타민/영양제' && m.stock > 0),
      '안약': medicineDatabase.filter(m => m.category === '안약' && m.stock > 0),
    };

    let medicineList = '\n=== 보유 약품 ===\n';
    for (const [category, meds] of Object.entries(categorizedMeds)) {
      if (meds.length > 0) {
        medicineList += `\n【${category}】\n`;
        meds.forEach(m => {
          medicineList += `- ${m.name}: ${m.price.toLocaleString()}원 (재고 ${m.stock}${m.unit})\n`;
        });
      }
    }

    const prompt = `당신은 약국 챗봇입니다. 증상을 분석하고 **딱 맞는 카테고리의 약만** 추천하세요.

**증상:** ${userMessage}

**보유 약품:**
${medicineList}

**매칭 규칙:**
- 두통/발열 → 해열진통제
- 감기/기침/콧물 → 감기약
- 소화불량/속쓰림 → 소화제
- 근육통/타박상 → 파스/연고
- 눈 피로/충혈 → 안약
- 피로/영양 → 비타민/영양제

**중요:**
1. 증상에 맞는 카테고리만!
2. 1~2개 약만 추천
3. 복합증상이면 각각 추천

**답변 (150자 이내):**
💊 추천: [약이름] [가격]원
📋 복용: 간단히
⚠️ 주의: 한줄

이모지 써서 친근하게!`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 받지 못했습니다.';
      
    } catch (error) {
      console.error('Gemini API 오류:', error);
      return `😥 오류가 발생했습니다.\n약사에게 문의해주세요!`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await callGeminiAPI(userInput);
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: '오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-all"
        >
          <Sparkles className="w-8 h-8 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            AI
          </span>
        </motion.button>
      )}

      {/* 챗봇 창 */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-end p-4 sm:p-8" ref={dragConstraintsRef}>
            <motion.div
              drag
              dragConstraints={dragConstraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              className="pointer-events-auto w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            >
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between cursor-move">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Care Hub AI</h3>
                    <p className="text-blue-100 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      증상별 약 추천
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>

              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'bot' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-700'
                    }`}>
                      {message.type === 'bot' ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        message.type === 'bot' 
                          ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block px-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                
                {/* 타이핑 인디케이터 */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm w-fit">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 입력 영역 */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="예: 두통 / 감기 / 어깨 아픔"
                    disabled={isTyping}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1 disabled:cursor-not-allowed"
                  />
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`rounded-full w-8 h-8 p-0 flex items-center justify-center transition-all ${
                      input.trim() && !isTyping 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-300'
                    }`}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  🤖 Gemini AI • 증상별 맞춤 추천
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;