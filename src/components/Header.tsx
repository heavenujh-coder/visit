import { FileSpreadsheet, RefreshCw, BookOpen, Settings2, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  gasUrl: string;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  totalCount: number;
}

export default function Header({
  gasUrl,
  isLoading,
  onRefresh,
  onOpenGuide,
  onOpenSettings,
  totalCount,
}: HeaderProps) {
  const isConnected = !!gasUrl.trim();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                시트방명록
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                SheetGuestbook
              </span>
            </div>
            <p className="text-xs text-neutral-500 hidden sm:block">
              구글 스프레드시트를 실시간 NoSQL 데이터베이스로 활용하는 초간단 방명록
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <button
            onClick={onOpenSettings}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
            title="클릭하여 시트 연동 설정을 변경합니다"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isConnected ? '구글 시트 실시간 연동' : '데모 체험 모드'}</span>
            <span className="text-[10px] bg-white/70 px-1.5 py-0.2 rounded font-mono font-semibold">
              {totalCount}개
            </span>
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            title="Apps Script 코드 및 연동 가이드"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">연동 가이드 & 코드</span>
            <span className="sm:hidden">가이드</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-2xs ${
              isConnected
                ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-emerald-600/20'
            }`}
            title="구글 시트 연동 URL 설정"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isConnected ? '시트 URL 설정' : '내 시트 연결하기'}</span>
            <span className="sm:hidden">{isConnected ? '설정' : '연결'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-neutral-100 disabled:opacity-50 text-neutral-700 border border-neutral-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="방명록 새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden lg:inline">새로고침</span>
          </button>
        </div>
      </div>
    </header>
  );
}
