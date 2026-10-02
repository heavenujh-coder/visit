import { useState } from 'react';
import { Send, Sparkles, Loader2, Smile, Palette, Dices } from 'lucide-react';
import { CardTheme } from '../types';

interface EntryFormProps {
  onSubmit: (data: { name: string; message: string; theme: CardTheme }) => Promise<void>;
  isSubmitting: boolean;
  isConnected: boolean;
}

const THEMES: { id: CardTheme; label: string; bg: string; border: string; ring: string }[] = [
  { id: 'yellow', label: '해바라기 옐로우', bg: 'bg-amber-100', border: 'border-amber-300', ring: 'ring-amber-400' },
  { id: 'mint', label: '산뜻 민트', bg: 'bg-emerald-100', border: 'border-emerald-300', ring: 'ring-emerald-400' },
  { id: 'peach', label: '달콤 피치', bg: 'bg-orange-100', border: 'border-orange-300', ring: 'ring-orange-400' },
  { id: 'lavender', label: '포근 라벤더', bg: 'bg-purple-100', border: 'border-purple-300', ring: 'ring-purple-400' },
  { id: 'sky', label: '맑은 하늘', bg: 'bg-sky-100', border: 'border-sky-300', ring: 'ring-sky-400' },
  { id: 'cream', label: '따뜻한 크림', bg: 'bg-stone-100', border: 'border-stone-300', ring: 'ring-stone-400' },
];

const RANDOM_NICKNAMES = [
  '행복한 다람쥐 🐿️',
  '꿈꾸는 고양이 🐱',
  '달콤한 꿀벌 🐝',
  '열정 가득 토끼 🐰',
  '날아라 펭귄 🐧',
  '포근한 곰돌이 🐻',
  '새벽 코더 ☕',
  '행운의 클로버 🍀',
  '별빛 여행자 🌟',
  '친절한 이웃 🌸',
];

const QUICK_EMOJIS = ['🎉', '🍀', '❤️', '🔥', '☕', '✨', '👏', '🌈', '💪', '🌸'];

export default function EntryForm({ onSubmit, isSubmitting, isConnected }: EntryFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<CardTheme>('yellow');
  const [error, setError] = useState<string | null>(null);

  const handleRandomNickname = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_NICKNAMES.length);
    setName(RANDOM_NICKNAMES[randomIndex]);
  };

  const handleAddEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError('응원 한마디 내용을 작성해주세요!');
      return;
    }
    setError(null);

    const author = name.trim() || '익명 친구';
    try {
      await onSubmit({
        name: author,
        message: trimmedMessage,
        theme,
      });
      // 성공 시 입력창 초기화
      setMessage('');
    } catch {
      // 에러 처리는 상위에서 toast로 처리
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-200 p-5 sm:p-7 relative overflow-hidden transition-all">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-neutral-900 text-base sm:text-lg">방명록 남기기</h2>
        </div>
        <span className="text-xs text-neutral-400 font-medium">
          {isConnected ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
              시트에 실시간 저장됨
            </span>
          ) : (
            <span className="text-amber-600 font-medium">데모 모드 (로컬 저장)</span>
          )}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input with Random Generator */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1.5">
            작성자 닉네임
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 또는 닉네임 (미입력 시 '익명 친구')"
              maxLength={25}
              disabled={isSubmitting}
              className="flex-1 px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={handleRandomNickname}
              disabled={isSubmitting}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
              title="랜덤 닉네임 생성"
            >
              <Dices className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">랜덤 닉네임</span>
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-neutral-700">
              따뜻한 응원 한마디 <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              {message.length}/300자
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder="자유롭게 방명록 글이나 따뜻한 응원의 말을 남겨주세요 :)"
            maxLength={300}
            rows={3}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
              error
                ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                : 'border-neutral-300 focus:ring-emerald-500'
            }`}
          />
          {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
        </div>

        {/* Quick Emoji Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-400 font-medium shrink-0 flex items-center gap-1 text-[11px] mr-1">
            <Smile className="w-3.5 h-3.5" /> 이모지:
          </span>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              disabled={isSubmitting}
              className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm transition-transform active:scale-95 shrink-0"
              title={`이모지 ${emoji} 추가`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Card Theme Picker */}
        <div>
          <label className="flex items-center gap-1 text-xs font-bold text-neutral-700 mb-2">
            <Palette className="w-3.5 h-3.5 text-neutral-500" />
            카드 배경 테마
          </label>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${t.bg} ${t.border} ${
                  theme === t.id
                    ? `ring-2 ${t.ring} shadow-xs font-bold scale-105`
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-black/10 bg-white" />
                <span>{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>구글 시트에 저장하는 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>방명록 응원 등록하기</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
