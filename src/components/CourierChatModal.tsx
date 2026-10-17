import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  ShieldCheck, 
  Bike,
  Sparkles,
  Bot
} from 'lucide-react';
import { CourierInfo, ChatMessage, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface CourierChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  courier: CourierInfo;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  language: Language;
  isCalling: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
}

export const CourierChatModal: React.FC<CourierChatModalProps> = ({
  isOpen,
  onClose,
  courier,
  messages,
  onSendMessage,
  language,
  isCalling,
  onStartCall,
  onEndCall,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Call timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sound.playChatMessage();
    onSendMessage(text);
    if (!textToSend) setInputText('');

    // Simulate realistic courier response after 1.5 - 2.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      sound.playChatMessage();
      
      const responses: Record<Language, string[]> = {
        ru: [
          'Принял! Буду у вас через 7-10 минут. Спасибо за уточнение!',
          'Хорошо, оставил у двери и сделал фото. Приятного аппетита!',
          'Понял, наберу как только припаркую скутер у подъезда.',
          'Спасибо! Уже поднимаюсь на этаж.',
        ],
        ja: [
          'かしこまりました！あと約7分ほどで到着予定です。',
          'ご指示ありがとうございます。ドア前に丁寧にお届けいたします。',
          '了解いたしました。到着直前にお電話いたします！',
        ],
        en: [
          'Got it! Arriving in about 7-10 minutes. Thanks for the note!',
          'Understood, will leave right at your door with care. Enjoy your meal!',
          'Thanks! I am pulling up to your building right now.',
        ],
        kk: [
          'Қабылданды! 7-10 минутта жеткіземін. Рақмет!',
          'Түсінікті, есік алдына ұқыпты қалдырамын. Асыңыз дәмді болсын!',
        ],
      };

      const langList = responses[language] || responses.ru;
      const randomReply = langList[Math.floor(Math.random() * langList.length)];
      onSendMessage(`[courier_reply]:${randomReply}`);
    }, 2000);
  };

  const quickReplies = [
    { key: 'quickReplyDoor', text: t('quickReplyDoor', language) },
    { key: 'quickReplyIntercom', text: t('quickReplyIntercom', language) },
    { key: 'quickReplyCall5min', text: t('quickReplyCall5min', language) },
    { key: 'quickReplyMeetOutside', text: t('quickReplyMeetOutside', language) },
  ];

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#222222] overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Chat Header */}
        <div className="p-4 bg-white dark:bg-[#121212] text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={courier.photo}
                alt={courier.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#D12F2F]"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-neutral-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm font-japanese-serif text-neutral-950 dark:text-white">{courier.name}</span>
                <span className="text-[10px] bg-neutral-100 dark:bg-[#1E1E1E] text-[#D12F2F] dark:text-[#FF6B6B] border border-neutral-200 dark:border-[#333333] px-1.5 py-0.2 rounded font-medium">
                  Курьер
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-[#888888] flex items-center gap-1">
                <Bike className="w-3 h-3 text-[#D12F2F]" />
                <span>Электроскутер • В сети</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="start-call-courier-btn"
              onClick={onStartCall}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              title="Позвонить курьеру"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              id="close-chat-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-[#888888] hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Call Overlay if active */}
        {isCalling ? (
          <div className="flex-1 bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              <img
                src={courier.photo}
                alt={courier.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30 pointer-events-none" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold font-japanese-serif">{courier.name}</h3>
              <p className="text-sm text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Идёт разговор: {formatCallTime(callDuration)}</span>
              </p>
              <p className="text-xs text-[#888888]">Связь через защищённый IP-шлюз «Суши Роллы»</p>
            </div>

            {/* Audio Wave Visualizer Animation */}
            <div className="flex items-center gap-1 h-8">
              {[40, 70, 100, 60, 30, 80, 95, 50, 65, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* Call Action Controls */}
            <div className="flex items-center gap-6 pt-4">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`p-4 rounded-full border transition-colors ${
                  isCallMuted ? 'bg-amber-600 border-amber-500 text-white' : 'bg-[#1E1E1E] border-[#333333] text-[#CCCCCC]'
                }`}
              >
                {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                id="end-call-btn"
                onClick={onEndCall}
                className="p-5 rounded-full bg-[#D12F2F] hover:bg-[#B71C1C] text-white shadow-lg transition-transform hover:scale-105"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                className="p-4 rounded-full bg-[#1E1E1E] border border-[#333333] text-[#CCCCCC]"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50 dark:bg-[#0A0A0A]">
              
              {/* Privacy badge */}
              <div className="flex items-center justify-center my-2">
                <span className="text-[11px] bg-white dark:bg-[#161616] text-neutral-600 dark:text-[#888888] border border-neutral-200 dark:border-[#262626] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Прямой безопасный чат с доставщиком</span>
                </span>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="text-[10px] text-neutral-400 dark:text-[#666666] bg-neutral-100 dark:bg-[#161616] px-2.5 py-0.5 rounded-md">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <img
                        src={courier.photo}
                        alt={courier.name}
                        className="w-6 h-6 rounded-full object-cover mb-1 border border-[#D12F2F]"
                      />
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                        isUser
                          ? 'bg-[#D12F2F] text-white rounded-br-none shadow-sm'
                          : 'bg-white dark:bg-[#161616] text-neutral-950 dark:text-[#E0E0E0] border border-neutral-200 dark:border-[#262626] rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          isUser ? 'text-rose-200' : 'text-neutral-400 dark:text-[#666666]'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-neutral-500 text-xs italic">
                  <img
                    src={courier.photo}
                    alt={courier.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="bg-white dark:bg-[#161616] px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#262626] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D12F2F] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D12F2F] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D12F2F] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates Bar */}
            <div className="p-2.5 bg-white dark:bg-[#121212] border-t border-neutral-200 dark:border-[#222222] overflow-x-auto flex gap-1.5 scrollbar-none">
              {quickReplies.map((qr) => (
                <button
                  key={qr.key}
                  onClick={() => handleSend(qr.text)}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-[#1A1A1A] hover:bg-neutral-200 dark:hover:bg-[#262626] text-neutral-700 dark:text-[#CCCCCC] border border-neutral-200 dark:border-[#2A2A2A] transition-colors"
                >
                  {qr.text}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-[#121212] border-t border-neutral-200 dark:border-[#222222] flex items-center gap-2"
            >
              <input
                id="courier-chat-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('chatPlaceholder', language)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 text-xs sm:text-sm border border-neutral-200 dark:border-[#262626] focus:outline-none focus:border-[#D12F2F]"
              />
              <button
                id="send-chat-msg-btn"
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] disabled:opacity-50 text-white transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
