import { useState } from 'react';
import { Heart, Copy, Check, Clock, User } from 'lucide-react';
import { GuestbookEntry, CardTheme } from '../types';

interface EntryCardProps {
  entry: GuestbookEntry;
  onLike: (id: string) => Promise<void>;
  onCopySuccess: () => void;
}

const THEME_STYLES: Record<
  CardTheme,
  { bg: string; border: string; accent: string; avatarBg: string }
> = {
  yellow: {
    bg: 'bg-amber-50/90 hover:bg-amber-50',
    border: 'border-amber-200/80 hover:border-amber-300',
    accent: 'text-amber-800',
    avatarBg: 'bg-amber-200 text-amber-900',
  },
  mint: {
    bg: 'bg-emerald-50/90 hover:bg-emerald-50',
    border: 'border-emerald-200/80 hover:border-emerald-300',
    accent: 'text-emerald-800',
    avatarBg: 'bg-emerald-200 text-emerald-900',
  },
  peach: {
    bg: 'bg-orange-50/90 hover:bg-orange-50',
    border: 'border-orange-200/80 hover:border-orange-300',
    accent: 'text-orange-800',
    avatarBg: 'bg-orange-200 text-orange-900',
  },
  lavender: {
    bg: 'bg-purple-50/90 hover:bg-purple-50',
    border: 'border-purple-200/80 hover:border-purple-300',
    accent: 'text-purple-800',
    avatarBg: 'bg-purple-200 text-purple-900',
  },
  sky: {
    bg: 'bg-sky-50/90 hover:bg-sky-50',
    border: 'border-sky-200/80 hover:border-sky-300',
    accent: 'text-sky-800',
    avatarBg: 'bg-sky-200 text-sky-900',
  },
  cream: {
    bg: 'bg-stone-50/90 hover:bg-stone-50',
    border: 'border-stone-200/80 hover:border-stone-300',
    accent: 'text-stone-800',
    avatarBg: 'bg-stone-200 text-stone-900',
  },
};

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return '방금 전';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}일 전`;

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')}`;
  } catch {
    return dateString;
  }
}

export default function EntryCard({ entry, onLike, onCopySuccess }: EntryCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const themeKey = (entry.theme || 'yellow') in THEME_STYLES ? entry.theme : 'yellow';
  const style = THEME_STYLES[themeKey];

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    setIsLiking(true);
    setHasLiked(true);
    try {
      await onLike(entry.id);
    } catch {
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`[${entry.name}] ${entry.message}`);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Get initial character for avatar
  const firstChar = entry.name ? entry.name.trim().charAt(0) : '?';

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${style.bg} ${style.border}`}
    >
      <div>
        {/* Top Header: Avatar & Info */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${style.avatarBg}`}
            >
              {firstChar}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-neutral-900 text-sm truncate leading-snug">
                {entry.name || '익명 친구'}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(entry.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-black/5 rounded-lg transition-all"
            title="응원글 내용 복사"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Message Content */}
        <p className="text-neutral-800 text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words font-normal">
          {entry.message}
        </p>
      </div>

      {/* Bottom Footer: Like counter & actions */}
      <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all active:scale-95 ${
            hasLiked
              ? 'bg-rose-100 text-rose-600 font-bold'
              : 'text-neutral-500 hover:text-rose-500 hover:bg-white/60'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
          <span className="font-mono font-medium">{entry.likes || 0}</span>
        </button>

        <span className="text-[10px] text-neutral-400 font-mono">
          #{entry.id.replace(/^msg_|^demo_/, '').slice(-6)}
        </span>
      </div>
    </div>
  );
}
