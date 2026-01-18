import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { medicineDatabase } from '../data/medicines';

const AIConsult = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '안녕하세요! 저는 Care Hub의 AI 의료 상담사입니다. 🏥\n\n저는 Google Gemini AI로 구동되며, 여러분의 증상을 듣고 최적의 약품을 추천해드립니다.\n\n**어떤 증상이 있으신가요?** 편하게 말씀해주세요.',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const callGeminiAPI = async (userMessage) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCpRgZED7wefnOK7RBOAKdUC5JM8F4wNEM';
    
    // 카테고리별 약품 정리
    const categorizedMeds = {
      '해열진통제': medicineDatabase.filter(m => m.category === '해열진통제' && m.stock > 0),
      '감기약': medicineDatabase.filter(m => m.category === '감기약' && m.stock > 0),
      '소화제': medicineDatabase.filter(m => m.category === '소화제' && m.stock > 0),
      '항생제': medicineDatabase.filter(m => m.category === '항생제' && m.stock > 0),
      '파스/연고': medicineDatabase.filter(m => m.category === '파스/연고' && m.stock > 0),
      '비타민/영양제': medicineDatabase.filter(m => m.category === '비타민/영양제' && m.stock > 0),
      '안약': medicineDatabase.filter(m => m.category === '안약' && m.stock > 0),
    };

    let medicineList = '\n📦 **현재 보유 중인 약품 목록:**\n';
    for (const [category, meds] of Object.entries(categorizedMeds)) {
      if (meds.length > 0) {
        medicineList += `\n【${category}】\n`;
        meds.forEach(m => {
          medicineList += `  • ${m.name} - ${m.price.toLocaleString()}원 (재고: ${m.stock}${m.unit}, 제조사: ${m.manufacturer})\n`;
        });
      }
    }

    // 대화 맥락 포함
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n📜 **이전 대화 내용:**\n';
      conversationHistory.slice(-4).forEach(msg => {
        conversationContext += `${msg.role === 'user' ? '환자' : 'AI'}: ${msg.content}\n`;
      });
    }

    const systemPrompt = `당신은 전문 약사이자 의료 상담 AI입니다. 

**역할:**
- 환자의 증상을 공감하며 들어주고, 자세히 질문합니다
- 증상의 원인과 메커니즘을 쉽게 설명합니다
- 보유 약품 중에서 최적의 약을 추천합니다
- 생활 습관 개선, 예방법도 함께 안내합니다
- 심각한 증상은 병원 방문을 권유합니다

**상담 스타일:**
- 친절하고 공감적인 톤
- 전문적이면서도 이해하기 쉬운 설명
- 환자의 불안을 덜어주는 따뜻한 말투
- 구체적이고 실용적인 조언

**증상별 카테고리 매칭:**
- 두통, 발열, 치통, 생리통, 근육통 → **해열진통제**
- 감기, 기침, 콧물, 목감기, 재채기 → **감기약**
- 소화불량, 속쓰림, 배탈, 가스, 복통 → **소화제**
- 타박상, 염좌, 어깨/허리 통증, 찰과상 → **파스/연고**
- 눈 피로, 충혈, 안구건조 → **안약**
- 피로, 무기력, 면역력 저하 → **비타민/영양제**
- 세균 감염 (중증) → **항생제** (처방 필요 안내)

**중요 원칙:**
1. 증상에 **정확히 맞는 카테고리**의 약만 추천
2. 한 증상당 1~2개 약품만 추천 (가격/재고 고려)
3. 복합 증상이면 각 증상별로 약 추천
4. 약의 효능, 복용법, 주의사항을 명확히 설명
5. 생활 습관 조언도 포함

**응답 형식:**

💬 **증상 이해**
환자의 말을 공감하며 요약하고, 추가 질문이 필요하면 합니다.

🔍 **원인 분석**
증상의 가능한 원인과 메커니즘을 쉽게 설명합니다.

💊 **추천 약품**
[약 이름] - [가격]원 (재고: [수량][단위])
▸ **효능:** [설명]
▸ **복용법:** [구체적 방법]
▸ **주의사항:** [부작용/금기사항]

(복합 증상이면 증상별로 각각 추천)

🏠 **생활 관리**
• [실천 가능한 조언 2-3가지]

⚠️ **병원 방문 필요 여부**
[증상이 심각하거나 지속되면 안내]

답변은 자연스럽고 읽기 쉽게, 400자 내외로 작성하세요.`;

    const prompt = `${systemPrompt}

${conversationContext}

${medicineList}

**환자의 새로운 증상/질문:**
${userMessage}

위 형식으로 친절하고 전문적으로 상담해주세요.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.8,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(`API 오류: ${errorData.error?.message || response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('응답을 받지 못했습니다.');
      
    } catch (error) {
      console.error('🔥 API 오류:', error);
      return `죄송합니다. 일시적인 오류가 발생했습니다. 😔

**문제:** ${error.message}

잠시 후 다시 시도하시거나, 약사에게 직접 문의해주세요.`;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    
    // 대화 히스토리에 추가
    setConversationHistory(prev => [...prev, { role: 'user', content: inputMessage }]);
    
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await callGeminiAPI(currentInput);

      // 대화 히스토리에 추가
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: '오류가 발생했습니다. 다시 시도해주세요.',
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-170px)] flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-2xl border border-purple-100">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white px-6 py-5 rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-9 h-9 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <h2 className="text-xl font-bold">AI 의료 전문 상담</h2>
            <p className="text-xs opacity-90 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Powered by Google Gemini Pro
            </p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                message.type === 'bot' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}>
                {message.type === 'bot' ? (
                  <Sparkles className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div className={`max-w-2xl px-5 py-4 rounded-2xl whitespace-pre-line shadow-md hover:shadow-lg transition-shadow ${
                message.type === 'bot' 
                  ? 'bg-white border border-purple-100' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-3 ${
                  message.type === 'bot' ? 'text-gray-400' : 'text-blue-100'
                }`}>
                  {message.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 고급 타이핑 인디케이터 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-white border border-purple-100 shadow-md px-5 py-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="text-xs text-gray-500 ml-2">AI가 증상을 분석 중입니다...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 경고 메시지 */}
      <div className="px-6 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-t border-yellow-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-xs text-yellow-800">
            <strong>주의:</strong> AI 상담은 참고용입니다. 심각하거나 지속되는 증상은 반드시 의료기관을 방문하세요.
          </p>
        </div>
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSendMessage} className="p-5 border-t bg-white rounded-b-2xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="증상을 자세히 말씀해주세요... (예: 어제부터 두통이 심하고 열도 나요)"
            disabled={isTyping}
            className="flex-1 px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-7 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* 빠른 질문 버튼 */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {['두통이 있어요', '감기 걸렸어요', '소화가 안돼요', '어깨가 아파요'].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setInputMessage(q)}
              disabled={isTyping}
              className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default AIConsult;